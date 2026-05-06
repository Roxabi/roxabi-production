#!/usr/bin/env -S uv run --no-project --quiet --with nats-py --with nkeys --with pyyaml --with rich python
"""Synthesize Roxabi trailer VO chunks via the NATS hub.

Reads `showcase/roxabi-trailer-vo.md` frontmatter, sends one TTS request per
chunk to `lyra.voice.tts.request`, and writes each reply WAV to
`showcase/roxabi-vo/<chunk_id>.wav`.

Per-chunk fields applied: text, emotion, speed, exaggeration. Voice/engine/
base personality come from the frontmatter top-level keys.

Usage:
    NATS_URL=tls://192.168.1.16:4222 \\
    NATS_NKEY_SEED_PATH=~/.voicecli/nkeys/voice-client.seed \\
    NATS_CA_CERT=~/.voicecli/nkeys/ca.crt \\
    ./scripts/synth_vo_chunks.py
"""

from __future__ import annotations

import asyncio
import base64
import json
import os
import ssl
import sys
import time
from pathlib import Path
from typing import Any
from uuid import uuid4

import nats
import yaml
from nats.aio.client import Client as NATS
from rich.console import Console
from rich.progress import Progress, SpinnerColumn, TextColumn, TimeElapsedColumn

REPO = Path(__file__).resolve().parent.parent
VO_MD = REPO / "showcase" / "roxabi-trailer-vo.md"
OUT_DIR = REPO / "showcase" / "roxabi-vo"

TTS_SUBJECT_BASE = "lyra.voice.tts.request"  # per-worker: f"{base}.{worker_id}"
TTS_HEARTBEAT = "lyra.voice.tts.heartbeat"
INBOX_PREFIX = "_inbox.hub"  # ADR-051 normalized inbox ACL — matches hub.seed identity
CONTRACT_VERSION = "1"
PER_CHUNK_TIMEOUT = 90.0
HEARTBEAT_DISCOVER_TIMEOUT = 8.0

console = Console()


def _read_frontmatter(path: Path) -> dict:
    raw = path.read_text(encoding="utf-8")
    if not raw.startswith("---"):
        sys.exit(f"FAIL: {path} has no frontmatter")
    parts = raw.split("---", 2)
    if len(parts) < 3:
        sys.exit(f"FAIL: {path} frontmatter is malformed")
    return yaml.safe_load(parts[1])


def _seed_str() -> str:
    p = os.environ.get("NATS_NKEY_SEED_PATH")
    if not p:
        sys.exit("FAIL: NATS_NKEY_SEED_PATH not set")
    return Path(os.path.expanduser(p)).read_text().strip()


def _tls_ctx() -> ssl.SSLContext | None:
    ca = os.environ.get("NATS_CA_CERT")
    if not ca:
        return None
    ca_data = Path(os.path.expanduser(ca)).read_text()
    return ssl.create_default_context(cadata=ca_data)


async def _connect(url: str) -> NATS:
    kwargs: dict[str, Any] = {
        "inbox_prefix": INBOX_PREFIX,
        "nkeys_seed_str": _seed_str(),
    }
    tls = _tls_ctx()
    if tls is not None:
        kwargs["tls"] = tls
    return await nats.connect(url, **kwargs)


def _build_payload(chunk: dict, top: dict) -> bytes:
    body = {
        "contract_version": CONTRACT_VERSION,
        "request_id": f"roxabi-{chunk['id']}-{uuid4().hex[:8]}",
        "text": chunk["text"],
        "engine": top.get("engine", "qwen"),
        "voice": top.get("voice", "Sohee"),
        "language": top.get("language", "English"),
        "personality": top.get("base_personality", ""),
        "accent": top.get("base_accent", ""),
        "speed": chunk.get("speed", top.get("base_speed", "")),
        "emotion": chunk.get("emotion", ""),
    }
    if "exaggeration" in chunk:
        body["exaggeration"] = float(chunk["exaggeration"])
    return json.dumps(body, ensure_ascii=False).encode("utf-8")


async def _discover_worker(nc: NATS) -> str:
    """Subscribe to heartbeats briefly, return the first worker_id seen."""
    found: list[str] = []

    async def cb(msg) -> None:
        try:
            data = json.loads(msg.data)
        except json.JSONDecodeError:
            return
        wid = data.get("worker_id")
        if isinstance(wid, str) and wid not in found:
            found.append(wid)

    sub = await nc.subscribe(TTS_HEARTBEAT, cb=cb)
    deadline = asyncio.get_event_loop().time() + HEARTBEAT_DISCOVER_TIMEOUT
    while not found and asyncio.get_event_loop().time() < deadline:
        await asyncio.sleep(0.25)
    await sub.unsubscribe()
    if not found:
        sys.exit("FAIL: no TTS worker heartbeat seen — satellite is down")
    return found[0]


async def _synth_one(nc: NATS, subject: str, chunk: dict, top: dict, out_path: Path) -> tuple[bool, str]:
    payload = _build_payload(chunk, top)
    try:
        reply = await nc.request(subject, payload, timeout=PER_CHUNK_TIMEOUT)
    except Exception as exc:  # noqa: BLE001
        return False, f"request error: {exc}"
    try:
        data = json.loads(reply.data)
    except json.JSONDecodeError as exc:
        return False, f"reply not JSON: {exc}"
    if not data.get("ok"):
        return False, f"satellite error: {data.get('error', 'no detail')}"
    audio_b64 = data.get("audio_b64", "")
    if not audio_b64:
        return False, "no audio_b64 in reply"
    audio_bytes = base64.b64decode(audio_b64)
    out_path.write_bytes(audio_bytes)
    duration_ms = data.get("duration_ms", 0)
    return True, f"{len(audio_bytes)} bytes · {duration_ms} ms"


async def _amain(only: str | None = None) -> int:
    nats_url = os.environ.get("NATS_URL")
    if not nats_url:
        sys.exit("FAIL: NATS_URL not set")

    fm = _read_frontmatter(VO_MD)
    chunks = fm.get("chunks") or []
    if only:
        chunks = [c for c in chunks if c["id"] == only]
        if not chunks:
            sys.exit(f"FAIL: chunk id {only!r} not found")

    console.print(f"[cyan]Connecting to {nats_url}...[/cyan]")
    nc = await _connect(nats_url)
    console.print(f"[green]✓ connected[/green] (inbox_prefix={INBOX_PREFIX})")

    worker_id = await _discover_worker(nc)
    subject = f"{TTS_SUBJECT_BASE}.{worker_id}"
    console.print(f"[green]✓ worker[/green] {worker_id} → publishing to {subject}")

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    failures: list[tuple[str, str]] = []
    successes: list[tuple[str, str, float]] = []

    try:
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            TimeElapsedColumn(),
            console=console,
        ) as prog:
            task = prog.add_task("Synthesizing chunks…", total=len(chunks))
            for ch in chunks:
                cid = ch["id"]
                out = OUT_DIR / f"{cid}.wav"
                t0 = time.perf_counter()
                prog.update(task, description=f"[cyan]{cid}[/cyan]: {ch['text'][:60]}…")
                ok, info = await _synth_one(nc, subject, ch, fm, out)
                dt = time.perf_counter() - t0
                if ok:
                    successes.append((cid, info, dt))
                    console.print(f"  [green]✓[/green] {cid}  {info}  [dim]{dt:.1f}s[/dim]")
                else:
                    failures.append((cid, info))
                    console.print(f"  [red]✗[/red] {cid}  {info}")
                prog.advance(task)
    finally:
        await nc.drain()
        await nc.close()

    console.print()
    console.print(
        f"[bold]Done:[/bold] {len(successes)} ok · {len(failures)} failed"
    )
    if failures:
        for cid, msg in failures:
            console.print(f"  [red]{cid}[/red]: {msg}")
        return 1
    return 0


def main() -> None:
    only = None
    if len(sys.argv) > 1 and sys.argv[1] == "--only":
        only = sys.argv[2]
    rc = asyncio.run(_amain(only=only))
    sys.exit(rc)


if __name__ == "__main__":
    main()
