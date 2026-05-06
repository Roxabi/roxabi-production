#!/usr/bin/env -S uv run --no-project --quiet --with rich python
"""
timing_map.py — diagnostic Gantt for the Roxabi trailer.

Parses RoxabiTrailer.tsx visual anchors, stitch_vo.sh chunk timings,
build_sfx.sh SFX cues, and the measured WAV durations of each VO chunk,
then renders a unified ASCII Gantt of the 110s timeline with sync flags.

Inputs (all relative to repo root):
  showcase/RoxabiTrailer.tsx       — visual anchors (Sequence offsets + cInterpolate appearance frames)
  showcase/roxabi-vo/cNN.wav       — measured chunk durations
  scripts/stitch_vo.sh             — VO chunk start times
  scripts/build_sfx.sh             — SFX cue table

Output:
  stdout — Gantt + flags
  artifacts/timing-map.json        — machine-readable map (optional)

Flags emitted:
  - VO_LEAD     : VO starts >2s before its visual anchor
  - VO_TRAIL    : VO starts >2s after its visual anchor
  - DEAD_ZONE   : >1.5s of no audio (no VO, no SFX) — possible flat patch
  - VO_OVERLAP  : two VO chunks overlap (must always be empty for a clean mix)
  - SFX_CLASH   : SFX cue lands within ±0.3s of a VO chunk's keyword landing
"""
from __future__ import annotations

import json
import re
import subprocess
from dataclasses import dataclass, field, asdict
from pathlib import Path

from rich.console import Console
from rich.table import Table
from rich import box

ROOT = Path(__file__).resolve().parents[1]
FPS = 30
DURATION = 110.0
GANTT_WIDTH = 110  # one char per second

console = Console()


# ─── Visual anchors ──────────────────────────────────────────────────────────
# Hand-curated map of {chunk_id: visual_anchor_seconds} based on the trailer's
# scene structure. Updating this is cheaper than parsing every cInterpolate.
VISUAL_ANCHORS: dict[str, tuple[float, str]] = {
    "c01": (185 / FPS, "S01 typewriter f185"),                  # 6.17s
    "c02": (255 / FPS, "S01 mono 'five times' f255"),           # 8.50s
    "c03": (10 + 12 / FPS, "S02 team-cluster appear localF12"),  # 10.40s
    "c04": (10 + 150 / FPS, "S02 scaffold start localF150"),     # 15.00s
    "c05": (10 + 330 / FPS, "S02 'foundations' localF330"),      # 21.00s
    "c06": (25 + 80 / FPS, "S03 hero-text localF80"),            # 27.67s
    "c07": (25 + 200 / FPS, "S03 '14 years' localF200"),         # 31.67s
    "c08": (25 + 340 / FPS, "S03 'Same craft' localF340"),       # 36.33s
    "c09": (42 + 50 / FPS, "S04 terminal fade localF50"),        # 43.67s
    "c10": (42 + 130 / FPS, "S04 creed header localF130"),       # 46.33s
    "c11": (42 + 260 / FPS, "S04 'local' localF260"),            # 50.67s
    "c12": (42 + 200 / FPS, "S04 'open by arch' localF200"),     # 48.67s (group)
    "c13": (42 + 510 / FPS, "S04 'yours' localF510"),            # 59.00s
    "c14": (68 + 10 / FPS, "S05 'Primitives' label localF10"),   # 68.33s
    "c15": (68 + 60 / FPS, "S05 first node localF60"),           # 70.00s
    "c16": (68 + 240 / FPS, "S05 edges localF240"),              # 76.00s
    "c17": (82 + 10 / FPS, "S06 LAYER 03 badge localF10"),       # 82.33s
    "c18": (82 + 60 / FPS, "S06 forks essaime localF60"),        # 84.00s
    "c19": (82 + 240 / FPS, "S06 mirror line localF240"),        # 90.00s
    "c20": (96 + 260 / FPS, "S07 'One person.' localF260"),      # 104.67s
}


# ─── Data classes ────────────────────────────────────────────────────────────
@dataclass
class VOChunk:
    id: str
    start: float
    duration: float
    text: str = ""
    anchor: float = 0.0
    anchor_label: str = ""
    flags: list[str] = field(default_factory=list)

    @property
    def end(self) -> float:
        return self.start + self.duration


@dataclass
class SFXCue:
    t: float
    file: str
    vol: float
    flags: list[str] = field(default_factory=list)


# ─── Parsers ─────────────────────────────────────────────────────────────────
def parse_stitch_vo() -> list[tuple[str, int]]:
    text = (ROOT / "scripts" / "stitch_vo.sh").read_text()
    cues = re.findall(r'"(c\d{2}):(\d+)"', text)
    return [(cid, int(ms)) for cid, ms in cues]


def parse_build_sfx() -> list[tuple[int, str, float]]:
    text = (ROOT / "scripts" / "build_sfx.sh").read_text()
    cues = re.findall(r'"(\d+):([^:]+\.mp3):([\d.]+)"', text)
    return [(int(ms), f, float(v)) for ms, f, v in cues]


def parse_vo_script() -> dict[str, str]:
    text = (ROOT / "showcase" / "roxabi-trailer-vo.md").read_text()
    out: dict[str, str] = {}
    for m in re.finditer(r"- id:\s*(c\d{2})\s*\n\s*scene:[^\n]+\n\s*text:\s*\"([^\"]+)\"", text):
        out[m.group(1)] = m.group(2)
    return out


def measure_wav(path: Path) -> float:
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "csv=p=0", str(path)],
        check=True, capture_output=True, text=True,
    )
    return float(r.stdout.strip())


# ─── Build model ─────────────────────────────────────────────────────────────
def build_chunks() -> list[VOChunk]:
    cues = parse_stitch_vo()
    texts = parse_vo_script()
    chunks: list[VOChunk] = []
    for cid, ms in cues:
        wav = ROOT / "showcase" / "roxabi-vo" / f"{cid}.wav"
        dur = measure_wav(wav) if wav.exists() else 0.0
        anchor, label = VISUAL_ANCHORS.get(cid, (0.0, "—"))
        c = VOChunk(
            id=cid, start=ms / 1000.0, duration=dur,
            text=texts.get(cid, ""), anchor=anchor, anchor_label=label,
        )
        chunks.append(c)
    return chunks


def flag_vo(chunks: list[VOChunk]) -> None:
    # Sync flags relative to visual anchor
    for c in chunks:
        if c.anchor <= 0:
            continue
        delta = c.start - c.anchor
        if delta < -2.0:
            c.flags.append(f"VO_LEAD({delta:+.1f}s)")
        elif delta > 2.0:
            c.flags.append(f"VO_TRAIL({delta:+.1f}s)")
    # Overlap flags
    sorted_c = sorted(chunks, key=lambda x: x.start)
    for a, b in zip(sorted_c, sorted_c[1:]):
        if b.start < a.end:
            overlap = a.end - b.start
            a.flags.append(f"VO_OVERLAP({overlap:.2f}s with {b.id})")
            b.flags.append(f"VO_OVERLAP({overlap:.2f}s with {a.id})")


def find_dead_zones(chunks: list[VOChunk], sfx: list[SFXCue],
                    threshold: float = 1.5) -> list[tuple[float, float]]:
    """Return [(start, duration), ...] of audio-empty stretches > threshold."""
    busy: list[tuple[float, float]] = []
    for c in chunks:
        busy.append((c.start, c.end))
    for s in sfx:
        # SFX assumed ~0.6s footprint
        busy.append((s.t, s.t + 0.6))
    busy.sort()
    # Merge overlapping intervals
    merged: list[list[float]] = []
    for s, e in busy:
        if merged and s <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], e)
        else:
            merged.append([s, e])
    # Find gaps between merged intervals
    dead: list[tuple[float, float]] = []
    prev_end = 0.0
    for s, e in merged:
        gap = s - prev_end
        if gap > threshold:
            dead.append((prev_end, gap))
        prev_end = e
    if DURATION - prev_end > threshold:
        dead.append((prev_end, DURATION - prev_end))
    return dead


def flag_sfx_clash(chunks: list[VOChunk], sfx: list[SFXCue],
                   tolerance: float = 0.3) -> None:
    """Flag SFX cues that hit within ±tolerance of a VO chunk's start
    (typically the keyword landing). Manifesto rule: SFX punctuates
    transitions and animation beats, never steps on a VO landing."""
    for s in sfx:
        for c in chunks:
            if abs(s.t - c.start) <= tolerance:
                s.flags.append(f"SFX_CLASH(start of {c.id})")
                break


# ─── Rendering ───────────────────────────────────────────────────────────────
def gantt_bar(start: float, end: float, total: float, width: int, char: str) -> str:
    cells = [" "] * width
    s = max(0, int(start / total * width))
    e = min(width, max(s + 1, int(end / total * width)))
    for i in range(s, e):
        cells[i] = char
    return "".join(cells)


def render_gantt(chunks: list[VOChunk], sfx: list[SFXCue]) -> None:
    console.rule("[bold amber]Roxabi Trailer · Timing Map (v0.2)[/]")

    # Time ruler
    ruler = "".join("│" if i % 10 == 0 else ("·" if i % 5 == 0 else " ")
                    for i in range(GANTT_WIDTH))
    labels = "".join(f"{i:>10}" for i in range(0, GANTT_WIDTH + 1, 10))
    console.print(f"      [dim]{labels}[/]")
    console.print(f"      [dim]{ruler}[/]")

    # Scene boundaries (S01..S07 frame transitions)
    scene_bounds = [(0, "S01"), (10, "S02"), (25, "S03"), (42, "S04"),
                    (68, "S05"), (82, "S06"), (96, "S07"), (110, "")]
    for sec, name in scene_bounds[:-1]:
        bar = [" "] * GANTT_WIDTH
        col = int(sec / DURATION * GANTT_WIDTH)
        if col < GANTT_WIDTH:
            bar[col] = "│"
        sw = "".join(bar)
        console.print(f"[dim]{name:>5}[/] [dim cyan]{sw}[/]")

    # VO chunks
    for c in sorted(chunks, key=lambda x: x.start):
        bar = gantt_bar(c.start, c.end, DURATION, GANTT_WIDTH, "█")
        # Anchor mark
        if c.anchor > 0:
            anchor_col = int(c.anchor / DURATION * GANTT_WIDTH)
            if 0 <= anchor_col < GANTT_WIDTH:
                bar_list = list(bar)
                if bar_list[anchor_col] == " ":
                    bar_list[anchor_col] = "▼"
                bar = "".join(bar_list)
        flagged = bool(c.flags)
        color = "red" if flagged else "yellow"
        console.print(f"[dim]{c.id:>5}[/] [{color}]{bar}[/]")

    # SFX cues — single column markers
    sfx_bar = [" "] * GANTT_WIDTH
    for s in sfx:
        col = int(s.t / DURATION * GANTT_WIDTH)
        if 0 <= col < GANTT_WIDTH:
            sfx_bar[col] = "!" if s.flags else "▪"
    console.print(f"[dim]{'SFX':>5}[/] [magenta]{''.join(sfx_bar)}[/]")
    console.print()


def render_table(chunks: list[VOChunk]) -> None:
    t = Table(title="VO Chunks · Visual sync", box=box.SIMPLE_HEAD,
              show_lines=False, header_style="bold")
    t.add_column("ID", style="dim", width=4)
    t.add_column("Start", justify="right")
    t.add_column("End", justify="right")
    t.add_column("Dur", justify="right", style="dim")
    t.add_column("Anchor", justify="right")
    t.add_column("Δ", justify="right")
    t.add_column("Text", style="dim", max_width=44, overflow="ellipsis")
    t.add_column("Flags", style="red")
    for c in sorted(chunks, key=lambda x: x.start):
        delta = c.start - c.anchor if c.anchor > 0 else 0.0
        delta_str = f"{delta:+.1f}s" if c.anchor > 0 else "—"
        delta_color = "red" if abs(delta) > 2 else ("yellow" if abs(delta) > 1 else "green")
        t.add_row(c.id,
                  f"{c.start:6.2f}s",
                  f"{c.end:6.2f}s",
                  f"{c.duration:.2f}s",
                  f"{c.anchor:6.2f}s" if c.anchor > 0 else "—",
                  f"[{delta_color}]{delta_str}[/]",
                  c.text,
                  ", ".join(c.flags) or "")
    console.print(t)


def render_dead_zones(dead: list[tuple[float, float]]) -> None:
    if not dead:
        console.print("[green]✓ No dead zones[/]")
        return
    t = Table(title="Dead zones (>1.5s, no VO + no SFX)", box=box.SIMPLE,
              header_style="bold")
    t.add_column("Start", justify="right")
    t.add_column("Duration", justify="right")
    t.add_column("Verdict")
    for start, dur in dead:
        verdict = "intentional (hero pause)" if dur > 4 else "consider filler"
        color = "green" if "intentional" in verdict else "yellow"
        t.add_row(f"{start:6.2f}s", f"{dur:.2f}s", f"[{color}]{verdict}[/]")
    console.print(t)


def render_sfx_clashes(sfx: list[SFXCue]) -> None:
    clashes = [s for s in sfx if s.flags]
    if not clashes:
        console.print("[green]✓ No SFX/VO clashes[/]")
        return
    t = Table(title="SFX/VO clashes", box=box.SIMPLE, header_style="bold red")
    t.add_column("t")
    t.add_column("File")
    t.add_column("Flag")
    for s in clashes:
        t.add_row(f"{s.t:.2f}s", s.file, ", ".join(s.flags))
    console.print(t)


# ─── Main ────────────────────────────────────────────────────────────────────
def main() -> None:
    chunks = build_chunks()
    sfx_raw = parse_build_sfx()
    sfx = [SFXCue(t=ms / 1000.0, file=f, vol=v) for ms, f, v in sfx_raw]

    flag_vo(chunks)
    flag_sfx_clash(chunks, sfx)
    dead = find_dead_zones(chunks, sfx)

    render_gantt(chunks, sfx)
    render_table(chunks)
    console.print()
    render_dead_zones(dead)
    console.print()
    render_sfx_clashes(sfx)

    # Machine-readable
    artifact = ROOT / "artifacts" / "timing-map.json"
    artifact.parent.mkdir(parents=True, exist_ok=True)
    artifact.write_text(json.dumps({
        "duration": DURATION,
        "fps": FPS,
        "chunks": [asdict(c) for c in chunks],
        "sfx": [asdict(s) for s in sfx],
        "dead_zones": [{"start": s, "duration": d} for s, d in dead],
    }, indent=2))
    console.print(f"\n[dim]Machine-readable: {artifact.relative_to(ROOT)}[/]")


if __name__ == "__main__":
    main()
