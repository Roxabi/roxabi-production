#!/usr/bin/env -S uv run --no-project --quiet --with nats-py --with nkeys python
"""Subscribe to lyra.voice.tts.heartbeat for 6s, dump worker_ids + subscribed subjects."""
from __future__ import annotations

import asyncio, json, os, ssl, sys
from pathlib import Path
import nats

INBOX = "_inbox.hub"
HEARTBEAT = "lyra.voice.tts.heartbeat"

async def main() -> None:
    seed = Path(os.path.expanduser(os.environ["NATS_NKEY_SEED_PATH"])).read_text().strip()
    ca = Path(os.path.expanduser(os.environ["NATS_CA_CERT"])).read_text()
    tls = ssl.create_default_context(cadata=ca)
    nc = await nats.connect(os.environ["NATS_URL"], inbox_prefix=INBOX, nkeys_seed_str=seed, tls=tls)
    seen: dict[str, dict] = {}

    async def cb(msg):
        try:
            data = json.loads(msg.data)
        except Exception:
            return
        wid = data.get("worker_id", "?")
        seen[wid] = data

    sub = await nc.subscribe(HEARTBEAT, cb=cb)
    print(f"Listening on {HEARTBEAT} for 6s...", flush=True)
    await asyncio.sleep(6.0)
    await sub.unsubscribe()
    await nc.drain()
    await nc.close()
    if not seen:
        print("NO HEARTBEATS — satellite is DOWN")
        sys.exit(2)
    for wid, data in seen.items():
        print(f"  ✓ {wid}")
        for k in ("model_loaded", "vram_free_mb", "vram_status", "engine", "subjects", "subscribed_to"):
            if k in data:
                print(f"      {k}: {data[k]}")

if __name__ == "__main__":
    asyncio.run(main())
