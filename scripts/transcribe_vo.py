#!/usr/bin/env -S uv run --no-project --quiet --with faster-whisper --with rich python
"""
transcribe_vo.py — word-level timing for narration.wav.

Runs faster-whisper on the stitched narration to produce per-word timestamps,
which can drive future subtitle tracks and audio-reactive triggers.

Output:
  artifacts/narration-words.json  — word-level transcript
  artifacts/narration.srt         — standard SRT for video players
"""
from __future__ import annotations

import json
from pathlib import Path

from faster_whisper import WhisperModel
from rich.console import Console
from rich.table import Table
from rich import box

ROOT = Path(__file__).resolve().parents[1]
INPUT = ROOT / "showcase" / "roxabi-narration.wav"
OUT_JSON = ROOT / "artifacts" / "narration-words.json"
OUT_SRT = ROOT / "artifacts" / "narration.srt"

console = Console()


def fmt_srt(t: float) -> str:
    h = int(t // 3600)
    m = int((t % 3600) // 60)
    s = int(t % 60)
    ms = int((t - int(t)) * 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def main() -> None:
    if not INPUT.exists():
        raise SystemExit(f"missing: {INPUT}")

    console.print(f"[dim]Loading model 'small.en' (CPU int8)...[/]")
    model = WhisperModel("small.en", device="cpu", compute_type="int8")

    console.print(f"[dim]Transcribing {INPUT.name}...[/]")
    segments, info = model.transcribe(
        str(INPUT),
        language="en",
        word_timestamps=True,
        vad_filter=True,
        vad_parameters={"min_silence_duration_ms": 300},
    )
    seg_list = list(segments)

    words: list[dict] = []
    srt_lines: list[str] = []
    idx = 1
    for seg in seg_list:
        srt_lines.append(str(idx))
        srt_lines.append(f"{fmt_srt(seg.start)} --> {fmt_srt(seg.end)}")
        srt_lines.append(seg.text.strip())
        srt_lines.append("")
        idx += 1
        for w in (seg.words or []):
            words.append({
                "word": w.word.strip(),
                "start": round(w.start, 3),
                "end": round(w.end, 3),
            })

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps({
        "language": info.language,
        "duration": round(info.duration, 3),
        "word_count": len(words),
        "words": words,
    }, indent=2))
    OUT_SRT.write_text("\n".join(srt_lines))

    # Pretty preview
    t = Table(title="Word-level timing (first 30)", box=box.SIMPLE_HEAD,
              header_style="bold")
    t.add_column("#", justify="right", style="dim")
    t.add_column("Start", justify="right")
    t.add_column("End", justify="right")
    t.add_column("Word")
    for i, w in enumerate(words[:30]):
        t.add_row(str(i), f"{w['start']:6.2f}s", f"{w['end']:6.2f}s", w["word"])
    console.print(t)

    console.print(f"\n[green]✓[/] {len(words)} words · {info.duration:.1f}s")
    console.print(f"  [dim]{OUT_JSON.relative_to(ROOT)}[/]")
    console.print(f"  [dim]{OUT_SRT.relative_to(ROOT)}[/]")


if __name__ == "__main__":
    main()
