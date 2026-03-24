---
name: render
description: 'Render a named composition to MP4 using the Roxabi video engine (Puppeteer + FFmpeg). Triggers: "render" | "export video" | "render composition" | "export mp4" | "generate video".'
version: 1.0.0
allowed-tools: Read, Bash, Glob, Grep
---

# Render

**Goal:** Render a registered composition to an MP4 file via the CLI pipeline.

## Steps

1. **Discover compositions** — read `dev/main.tsx` to list registered composition IDs and their metadata (fps, duration, dimensions).

2. **Confirm target** — if the user did not specify a composition ID, show the list and ask which one to render. If only one exists, proceed automatically.

3. **Auto-detect audio assets** — before building the command, scan for available audio:
   ```bash
   # Check for VO
   ls compositions/*/vo.wav dist/*/vo.wav 2>/dev/null
   # Check for soundtrack spec
   ls compositions/*/soundtrack.md 2>/dev/null
   # Check for BGM
   ls assets/bgm/*.mp3 2>/dev/null
   # Check for SFX
   ls assets/sfx/*.mp3 2>/dev/null
   ```
   If a `soundtrack.md` exists for the composition, parse it and auto-populate `--audio`, `--bgm`, and `--sfx` flags. If only a VO WAV exists, add `--audio`. Present the detected audio to the user for confirmation.

4. **Build render command:**
   ```bash
   bun render --composition <id> --fps <fps> --output dist/<id>.mp4 [--codec h264] \
     [--audio compositions/<name>/vo.wav] \
     [--bgm=assets/bgm/track.mp3:vol=0.2] \
     [--sfx=t=<time>:file=assets/sfx/<name>.mp3:vol=<vol>] ...
   ```

5. **Run the render** — execute the command with Bash. Stream output so the user can see progress.

6. **Report result** — on success, report the output path, file size, and audio layers included. On failure, surface the error and suggest fixes (missing codec, Puppeteer timeout, FFmpeg not found).

## Audio flags reference

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
