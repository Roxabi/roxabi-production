---
name: render
description: 'Render a video composition to MP4 using the headless Puppeteer + FFmpeg pipeline. Triggers: "render video" | "export video" | "render to mp4" | "export mp4" | "render composition".'
version: 0.1.0
argument-hint: '[composition-id] [--output path] [--codec h264|prores|vp9] [--audio path]'
allowed-tools: Read, Bash, Glob, Grep, AskUserQuestion
---

# Render Video

Render a registered composition to MP4 using the headless rendering pipeline.

## Context

The renderer at `renderer/cli.ts` captures frames via Puppeteer and encodes with FFmpeg:

```bash
bun run render <compositionId> [output.mp4] [--audio=path]
```

Supported codecs: `h264` (default, universal), `prores` (professional editing), `vp9` (web-optimized).

## Phases

**1 — Identify the composition.** If the user specifies a composition ID, use it. Otherwise, read `dev/main.tsx` to list available compositions and ask which one to render.

**2 — Check prerequisites.** Verify FFmpeg is installed: `which ffmpeg`. If missing, inform the user.

**3 — Render.** Run the render command:

```bash
bun run render <compositionId> [output.mp4] [--audio=path/to/audio]
```

Default output path: `./<compositionId>.mp4` in the project root.

**4 — Report.** After rendering completes, report:
- Output file path and size
- Duration and frame count
- Any warnings from the render process

## Edge Cases

| Scenario | Behavior |
|----------|----------|
| No compositions registered | Inform user — suggest using the `generate` skill first |
| FFmpeg not installed | Provide install instructions for the current OS |
| Render fails | Read error output, diagnose (missing deps, Puppeteer issues, OOM), suggest fix |
| User wants specific resolution | Remind them to set width/height in the CompositionConfig before rendering |
| Audio file specified | Pass `--audio=<path>` flag to the render command |

$ARGUMENTS
