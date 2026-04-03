---
name: reverse-engineer
description: 'Analyze existing videos with local VLM to extract visual patterns, then generate new TSX components or update the component inventory. Triggers: "reverse-engineer" | "extract style" | "recreate this" | "video to components" | "analyze video style".'
version: 2.0.0
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, Agent
---

# Reverse-Engineer

**Goal:** Run the VLM-powered video analysis pipeline on one or more videos, aggregate results, update component inventory with new build targets.

Let: A = `artifacts/video-analyses/`, W = `web-intel`, INV = `COMPONENT_INVENTORY.md`

## Pipeline

```
YouTube URL → yt-dlp → ffmpeg (scene detection) → qwen3-vl VLM (frame descriptions)
  → per-video JSON → aggregation → COMPONENT_INVENTORY.md → new TSX components
```

Wraps `web-intel/scripts/video_analyzer.py` and the aggregation workflow (12 videos, 1946 frames).

## Entry points

```
/reverse-engineer <URL>                  # Single video
/reverse-engineer <URL1> <URL2> ...      # Multiple videos
/reverse-engineer --aggregate            # Re-aggregate existing analyses
/reverse-engineer --inventory            # Update INV from aggregation
/reverse-engineer --build <ComponentName> # Build component from INV
```

## Prerequisites

- `yt-dlp`, `ffmpeg`, `ollama` in PATH
- Vision model in Ollama (auto-detected by VRAM): 12GB+ → `qwen3-vl:8b` | 6–12GB → `qwen3-vl:4b` | <6GB → `qwen3-vl:2b`
- `web-intel` plugin at `~/projects/roxabi-plugins/plugins/web-intel/`

## Steps

### Phase 1 — Analyze videos

1. **Check dependencies:**
   ```bash
   which yt-dlp ffmpeg ollama
   ollama list | grep qwen3-vl
   ```

2. **Run analyzer** ∀ URL:
   ```bash
   cd ~/projects/roxabi-plugins/plugins/web-intel && \
   uv run python scripts/video_analyzer.py "<URL>" \
     --model qwen3-vl:4b \
     --output ~/projects/roxabi-production/A/<VIDEO_ID>.json
   ```
   Extract `VIDEO_ID`: `echo "$URL" | sed 's/.*v=//'`

   **CLI flags:**
   | Flag | Default | Description |
   |------|---------|-------------|
   | `--model` | auto-detect | Ollama vision model |
   | `--fps` | 1.0 | Frames/sec (only with `--no-scene-detection`) |
   | `--output` / `-o` | stdout | Output JSON path |
   | `--keep-frames` | off | Keep extracted frame JPGs |
   | `--no-scene-detection` | off | Use uniform FPS instead |
   | `--scene-threshold` | 0.2 | Scene change sensitivity 0–1 (lower = more frames) |

   **Pipeline internals:** scrape metadata+transcript → yt-dlp download (1080p max) → ffmpeg frame extraction → GPU auto-detect + VLM select → batch describe via Ollama `/api/chat` (reads `thinking` field for qwen3-vl) → output JSON.

   **∀ frame, description extracts:** scene type (`3d_scene`/`2d_graphics`/`text_card`/`illustration`/`mixed`/`live_action`) | main objects + positions | background type + colors | color palette (3–5) | on-screen text (verbatim) | visual effects (`chromatic_aberration`/`glow`/`blur`/`fog`/`particles`/`glitch`/`grain`/`bokeh`/`vignette`) | animated elements | suggested React component name (PascalCase).

   **Output JSON:**
   ```json
   {
     "url": "https://...",
     "metadata": { "text": "transcript..." },
     "model": "qwen3-vl:4b",
     "frame_descriptions": [
       { "frame": 1, "second": 0.0, "timestamp": "0:00", "type": "scene_change", "description": "...", "inference_ms": 2034 }
     ],
     "stats": { "total_frames": 148, "described": 148, "failed": 0, "avg_inference_ms": 2034 }
   }
   ```

3. **Batch** — run sequentially (5–15 min/video). Log: `echo "[$N/${TOTAL}] Processing $VIDEO_ID ..."`.

### Phase 2 — Aggregate

4. **Aggregate** — read every `A/*.json` (excluding `AGGREGATION.json`), produce:
   - **`A/AGGREGATION.md`** — per-video summary table (ID/title/frames/top scene types/top effects); global stats (scene type totals ranked, effect totals ranked, color distribution, top 50 keywords); component candidates (PascalCase, ranked by count).
   - **`A/AGGREGATION.json`** — machine-readable same data.

### Phase 3 — Update component inventory

5. **Diff against built** — `find kits/ -name "*.tsx" -not -name "index.ts" | sort`. Categorize candidates:
   - Already built | HIGH (>500 frames or 5+ videos) | MEDIUM (50–500 or 3–4 videos) | LOW (<50 or 1–2 videos) | Skip (video-specific, not reusable).

6. **Update `INV`** — updated "Already Built" table + new priority entries (name/why/complexity/notes) + recommended build order (impact × ease).

### Phase 4 — Build components (`--build`)

7. **Build target component** — read INV entry → read 2–3 similar existing components (same kit) → generate TSX in kit dir → export from `index.ts`.

   Conventions: `useCurrentFrame()` + `useVideoConfig()` from core | `delay`/`duration` props | `interpolate()`/`spring()` for animation | color props (never hardcode) | JSDoc comment. Run `bun run typecheck`. Move INV entry from "Needs to be Built" to "Already Built".

## Output directory

```
artifacts/video-analyses/
├── <VIDEO_ID>.json       # Per-video frame descriptions
├── AGGREGATION.md        # Human-readable global report
├── AGGREGATION.json      # Machine-readable aggregation
├── COMPONENT_INVENTORY.md # Prioritized build roadmap
├── run_batch.sh          # Batch pipeline script
└── batch.log             # Execution log
```

`--aggregate` re-processes all `*.json` incrementally.
