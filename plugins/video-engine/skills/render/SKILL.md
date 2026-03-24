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

3. **Build render command:**
   ```bash
   bun render --composition <id> --fps <fps> --output dist/<id>.mp4 [--codec h264]
   ```

4. **Run the render** — execute the command with Bash. Stream output so the user can see progress.

5. **Report result** — on success, report the output path and file size. On failure, surface the error and suggest fixes (missing codec, Puppeteer timeout, FFmpeg not found).

## Codec reference

| Flag | Use case |
|------|---------|
| `--codec h264` | Default — web delivery, small files |
| `--codec prores` | Editing — lossless, large files |
| `--codec vp9` | Web — open format, good compression |
