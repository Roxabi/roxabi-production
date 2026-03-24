---
name: reverse-engineer
description: 'Analyze existing videos with local VLM to extract visual patterns, then generate new TSX components or update the component inventory. Triggers: "reverse-engineer" | "extract style" | "recreate this" | "video to components" | "analyze video style".'
version: 2.0.0
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, Agent
---

# Reverse-Engineer

**Goal:** Run the VLM-powered video analysis pipeline on one or more videos, aggregate results, and update the component inventory with new build targets.

## Pipeline overview

```
YouTube URL → yt-dlp → ffmpeg (scene detection) → qwen3-vl VLM (frame descriptions)
  → per-video JSON → aggregation → COMPONENT_INVENTORY.md → new TSX components
```

This wraps the existing `web-intel/scripts/video_analyzer.py` pipeline and the aggregation workflow from the original retro engineering session (12 videos, 1946 frames).

## Entry points

```
/reverse-engineer https://youtube.com/watch?v=...                  # Single video
/reverse-engineer https://youtube.com/watch?v=... https://...      # Multiple videos
/reverse-engineer --aggregate                                       # Re-aggregate existing analyses
/reverse-engineer --inventory                                       # Update component inventory from aggregation
/reverse-engineer --build <ComponentName>                            # Build a component from the inventory
```

## Prerequisites

- `yt-dlp`, `ffmpeg`, `ollama` installed and in PATH
- A vision model pulled in Ollama (auto-detected by VRAM):
  - 12 GB+ VRAM → `qwen3-vl:8b`
  - 6–12 GB VRAM → `qwen3-vl:4b`
  - <6 GB → `qwen3-vl:2b`
- `web-intel` plugin at `~/projects/roxabi-plugins/plugins/web-intel/`

## Steps

### Phase 1 — Analyze videos

1. **Check dependencies:**
   ```bash
   which yt-dlp ffmpeg ollama
   ollama list | grep qwen3-vl
   ```

2. **Run the video analyzer** for each URL:
   ```bash
   cd ~/projects/roxabi-plugins/plugins/web-intel && \
   uv run python scripts/video_analyzer.py "<URL>" \
     --model qwen3-vl:4b \
     --output ~/projects/roxabi-production/artifacts/video-analyses/<VIDEO_ID>.json
   ```

   Extract `VIDEO_ID` from URL: `echo "$URL" | sed 's/.*v=//'`

   **CLI flags:**
   | Flag | Default | Description |
   |------|---------|-------------|
   | `--model` | auto-detect | Ollama vision model |
   | `--fps` | 1.0 | Frames/sec (only with `--no-scene-detection`) |
   | `--output` / `-o` | stdout | Output JSON path |
   | `--keep-frames` | off | Keep extracted frame JPGs |
   | `--no-scene-detection` | off | Disable smart scene detection, use uniform FPS |
   | `--scene-threshold` | 0.2 | Scene change sensitivity 0–1 (lower = more frames) |

   **What the pipeline does internally:**
   1. Scrapes metadata + transcript via web-intel scraper
   2. Downloads video via yt-dlp (1080p max)
   3. Extracts frames using ffmpeg scene detection (or uniform FPS)
   4. Auto-detects GPU and selects best VLM via `gpu_detector.py`
   5. Batch-describes every frame via Ollama `/api/chat` (reads from `thinking` field for qwen3-vl)
   6. Outputs JSON with: `url`, `metadata`, `frame_descriptions[]`, `stats`

   **Frame description prompt extracts per frame:**
   - Scene type: `3d_scene`, `2d_graphics`, `text_card`, `illustration`, `mixed`, `live_action`
   - Main objects with positions
   - Background type and colors
   - Color palette (3–5 colors)
   - On-screen text (verbatim)
   - Visual effects: `chromatic_aberration`, `glow`, `blur`, `fog`, `particles`, `glitch`, `grain`, `bokeh`, `vignette`
   - What appears animated
   - Suggested React component name (PascalCase)

   **Output JSON structure:**
   ```json
   {
     "url": "https://...",
     "metadata": { "text": "transcript..." },
     "model": "qwen3-vl:4b",
     "frame_descriptions": [
       {
         "frame": 1,
         "second": 0.0,
         "timestamp": "0:00",
         "type": "scene_change",
         "description": "...",
         "inference_ms": 2034
       }
     ],
     "stats": { "total_frames": 148, "described": 148, "failed": 0, "avg_inference_ms": 2034 }
   }
   ```

3. **For batch analysis** (multiple URLs), run sequentially — each video takes 5–15 minutes depending on length and GPU. Log progress:
   ```bash
   echo "[$N/${TOTAL}] Processing $VIDEO_ID ..."
   ```

### Phase 2 — Aggregate

4. **Aggregate all analyses** — read every `*.json` file in `artifacts/video-analyses/` (excluding `AGGREGATION.json`) and produce:

   **`AGGREGATION.md`** — human-readable report with:
   - Per-video summary table (ID, title, frames, top scene types, top effects)
   - Global statistics:
     - Scene type totals (ranked by frequency)
     - Visual effect totals (ranked by frequency)
     - Color palette distribution
     - Top 50 keywords
   - Component candidates (PascalCase words extracted from descriptions, ranked by count)

   **`AGGREGATION.json`** — machine-readable version with the same data structured for programmatic use.

   Both saved to `artifacts/video-analyses/`.

### Phase 3 — Update component inventory

5. **Diff against existing components** — read all kits to find what's already built:
   ```bash
   find kits/ -name "*.tsx" -not -name "index.ts" | sort
   ```

   Compare component candidates from the aggregation against existing exports. Categorize each as:
   - **Already built** — component exists in a kit
   - **HIGH PRIORITY** — >500 frame occurrences or present in 5+ videos, not yet built
   - **MEDIUM PRIORITY** — 50–500 occurrences or 3–4 videos
   - **LOW PRIORITY** — <50 occurrences or 1–2 videos
   - **Skip** — too video-specific (e.g., `SamouraiDansLa` = content from a specific video, not a reusable pattern)

6. **Update `COMPONENT_INVENTORY.md`** with:
   - Updated "Already Built" table
   - New entries in priority sections with: component name, why (frequency/pattern), estimated complexity, implementation notes
   - Recommended build order (impact × ease)

### Phase 4 — Build components (optional, with `--build`)

7. **Build a specific component** from the inventory:
   - Read the inventory entry for the target component
   - Read 2–3 similar existing components from the same kit for patterns
   - Generate the TSX file in the appropriate kit directory
   - Export from the kit's `index.ts`
   - Follow conventions:
     - `useCurrentFrame()` and `useVideoConfig()` from core
     - `delay` and `duration` props for timing
     - `interpolate()` and `spring()` for animations
     - Color props (never hardcode)
     - JSDoc comment with component purpose
   - Run `bun run typecheck`
   - Update COMPONENT_INVENTORY.md to move from "Needs to be Built" to "Already Built"

## Existing corpus

The original retro engineering session analyzed **12 videos (1946 frames)**. Results live in:

```
artifacts/video-analyses/
├── AGGREGATION.md          # 53 KB — global report
├── AGGREGATION.json        # 282 KB — machine-readable
├── COMPONENT_INVENTORY.md  # 23 KB — build roadmap
├── run_batch.sh            # batch pipeline script
├── batch.log               # execution log
├── 0soFIReWb1w.json        # How to Make OpenClaw 10x More Powerful
├── 5O1uFIdUgVA.json        # Vous n'avez pas vraiment vu Ready Player One
├── 7TuovV_f5d8.json        # Le langage de Dieu (320 frames — largest)
├── 8r_hAwaUTa4.json        # Le monstre qui connaît déjà votre avenir
├── GnmzcahoJ18.json        # 1089 pixels pour comprendre que vous n'existez pas
├── LV9CjEqqKHQ.json        # Le complexe de dieu
├── LqN_ItMqovA.json        # I Didn't Know This Was Possible Until Now
├── Nd2pavAegx4.json        # 285 milliards partis en fumée: comment Anthropic
├── q4j6y-Yjp90.json        # -4800$/client: L'ardoise salée des SaaS IA
├── UhRGHr7pgnU.json        # How I ACTUALLY Use Opencode As A Senior Engineer
├── uEit1oOJK0w.json        # GSD Is the Missing Piece For Claude Code
└── YPEvrpzz72w.json        # Apple capitule! Le piège qui va tuer OpenAI
```

When running `--aggregate`, include all existing JSON files — new analyses add to the corpus incrementally.

## Key stats from current corpus

| Metric | Top 3 |
|--------|-------|
| Scene types | 2d_graphics (2815), animation (1681), 3d_scene (1593) |
| Effects | glow (4385), blur (4361), chromatic_aberration (2083) |
| Colors | black (7640), white (7444), dark (6576) |
