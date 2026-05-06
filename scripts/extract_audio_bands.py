#!/usr/bin/env -S uv run --no-project --quiet --with soundfile --with numpy --with rich python
"""
extract_audio_bands.py — per-frame VO amplitude bands for audio-reactive visuals.

Reads showcase/roxabi-narration.wav, computes per-frame (33.3ms @ 30fps) RMS
in three bands — low (<400Hz), mid (400-2000Hz), high (>2000Hz) — and writes a
3300-element array suitable for direct import into the React composition.

Output: showcase/audio-bands.json
"""
from __future__ import annotations

import json
from pathlib import Path

import numpy as np
import soundfile as sf
from rich.console import Console

ROOT = Path(__file__).resolve().parents[1]
WAV = ROOT / "showcase" / "roxabi-narration.wav"
OUT = ROOT / "showcase" / "audio-bands.json"
FPS = 30
DURATION = 110.0
TOTAL_FRAMES = int(FPS * DURATION)

console = Console()


def bandpass_rms(samples: np.ndarray, sr: int, lo: float, hi: float) -> np.ndarray:
    """FFT-based bandpass envelope, returned per video-frame."""
    samples_per_frame = int(sr / FPS)
    out = np.zeros(TOTAL_FRAMES, dtype=np.float32)
    for i in range(TOTAL_FRAMES):
        s = i * samples_per_frame
        e = s + samples_per_frame
        if e > len(samples):
            break
        win = samples[s:e]
        # FFT
        spec = np.fft.rfft(win * np.hanning(len(win)))
        freqs = np.fft.rfftfreq(len(win), 1 / sr)
        mask = (freqs >= lo) & (freqs < hi)
        if not mask.any():
            out[i] = 0.0
            continue
        # Reconstruct band, take RMS of magnitude
        band_mag = np.abs(spec[mask])
        out[i] = float(np.sqrt(np.mean(band_mag ** 2)))
    # Normalize 0-1
    p = float(np.percentile(out, 95))
    if p > 0:
        out = np.clip(out / p, 0, 1)
    return out


def smooth(x: np.ndarray, window: int = 5) -> np.ndarray:
    """Box-car smoothing to avoid jittery per-frame flicker."""
    if window <= 1:
        return x
    kernel = np.ones(window, dtype=np.float32) / window
    return np.convolve(x, kernel, mode="same")


def main() -> None:
    if not WAV.exists():
        raise SystemExit(f"missing: {WAV}")

    samples, sr = sf.read(str(WAV), dtype="float32", always_2d=False)
    if samples.ndim > 1:
        samples = samples.mean(axis=1)
    console.print(f"[dim]Loaded {len(samples)} samples @ {sr}Hz "
                  f"({len(samples)/sr:.1f}s)[/]")

    console.print("[dim]Computing bands (low/mid/high)...[/]")
    low = smooth(bandpass_rms(samples, sr, 60, 400), window=3)
    mid = smooth(bandpass_rms(samples, sr, 400, 2000), window=3)
    high = smooth(bandpass_rms(samples, sr, 2000, 8000), window=3)

    # Combined amplitude (RMS of the full signal, per frame)
    spf = int(sr / FPS)
    full = np.zeros(TOTAL_FRAMES, dtype=np.float32)
    for i in range(TOTAL_FRAMES):
        s, e = i * spf, (i + 1) * spf
        if e > len(samples):
            break
        full[i] = float(np.sqrt(np.mean(samples[s:e] ** 2)))
    p = float(np.percentile(full, 95))
    if p > 0:
        full = np.clip(full / p, 0, 1)
    full = smooth(full, window=3)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps({
        "fps": FPS,
        "totalFrames": TOTAL_FRAMES,
        "low": [round(float(x), 3) for x in low],
        "mid": [round(float(x), 3) for x in mid],
        "high": [round(float(x), 3) for x in high],
        "rms": [round(float(x), 3) for x in full],
    }))

    console.print(f"[green]✓[/] {OUT.relative_to(ROOT)} · {TOTAL_FRAMES} frames "
                  f"(low p95: {low.max():.2f} · mid: {mid.max():.2f} · "
                  f"high: {high.max():.2f})")


if __name__ == "__main__":
    main()
