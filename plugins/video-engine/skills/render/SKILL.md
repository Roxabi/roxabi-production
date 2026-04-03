---
name: render
description: 'Render a named composition to MP4 using the Roxabi video engine (Puppeteer + FFmpeg). Triggers: "render" | "export video" | "render composition" | "export mp4" | "generate video".'
version: 1.0.0
allowed-tools: Read, Bash, Glob, Grep
---

# Render

**Goal:** Render a registered composition to MP4 via the CLI pipeline.

## Steps

1. **Discover compositions** — read `dev/main.tsx` for registered IDs + metadata (fps, duration, dimensions).

2. **Confirm target** — user didn't specify → show list, ask. ∃ only one → proceed automatically.

3. **Auto-detect audio** — scan before building command:
   ```bash
   ls compositions/*/vo.wav dist/*/vo.wav 2>/dev/null
   ls compositions/*/soundtrack.md 2>/dev/null
   ls assets/bgm/*.mp3 2>/dev/null
   ls assets/sfx/*.mp3 2>/dev/null
   ```
   `soundtrack.md` exists → parse, auto-populate `--audio`/`--bgm`/`--sfx`. ∄ soundtrack but ∃ VO WAV → add `--audio`. Present detected audio for confirmation.

4. **Build command:**
   ```bash
   bun render --composition <id> --fps <fps> --output dist/<id>.mp4 [--codec h264] \
     [--audio compositions/<name>/vo.wav] \
     [--bgm=assets/bgm/track.mp3:vol=0.2] \
     [--sfx=t=<time>:file=assets/sfx/<name>.mp3:vol=<vol>] ...
   ```

5. **Run render** — execute with Bash, stream output for progress.

6. **Report** — success: output path + file size + audio layers. Failure: surface error + suggest fixes (missing codec, Puppeteer timeout, FFmpeg not found).

## Audio flags

| Flag | Format | Example |
|------|--------|---------|
| `--audio` | path to WAV | `--audio compositions/demo/vo.wav` |
| `--bgm` | `path:vol=N` | `--bgm=assets/bgm/ambient.mp3:vol=0.2` |
| `--sfx` | `t=N:file=path:vol=N` | `--sfx=t=2.5:file=assets/sfx/whoosh.mp3:vol=0.8` |

## Codec reference

| Flag | Use case |
|------|---------|
| `--codec h264` | Default — web delivery, small files |
| `--codec prores` | Editing — lossless, large files |
| `--codec vp9` | Web — open format, good compression |
