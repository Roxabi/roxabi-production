---
name: voice-over
description: 'Generate a voice-over script and render it to WAV from a composition''s scene structure. Triggers: "voice-over" | "generate vo" | "narration" | "add voice" | "voice over".'
version: 1.0.0
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# Voice-Over

**Goal:** Analyze a composition's scene structure, generate a VoiceCLI-compatible `.md` voice script, and render it to WAV.

Let: P = `compositions/<name>`, V = `voicecli`, VO = voice-over script

## Prerequisites

- VoiceCLI installed as `voicecli` (or `uv run voicecli` from `~/projects/voiceCLI`)
- TTS daemon running (`make tts` or `voicecli serve --engine qwen`)

## Steps

1. **Identify composition** — read `dev/main.tsx`, ask if unspecified. Extract from TSX: scene count + timing (frames→seconds at composition fps), visible text per scene, narrative arc (hook→content→close), mood/tone (GlitchText=edgy, BokehBackground=warm, TunnelEffect=intense).

2. **Choose voice profile** — ask or infer from style:

   | Style | Voice | Engine | Personality |
   |-------|-------|--------|-------------|
   | Tech product launch | `Sohee`/`Ryan` | qwen | Confident, measured |
   | Warm storytelling | `Vivian` | qwen | Warm, expressive |
   | Energetic demo | `Dylan` | qwen | Upbeat, fast-paced |
   | Cinematic | `Eric` | qwen | Deep, dramatic |
   | Multilingual | any | chatterbox | Adjust per language |

3. **Generate script** — create `P/vo.md`:

   ```markdown
   ---
   language: English
   voice: Sohee
   engine: qwen
   personality: "Warm and confident narrator"
   emotion: "Engaged and passionate"
   speed: "Measured, deliberate pace"
   segment_gap: 500
   crossfade: 80
   ---

   [Scene 1 — Opening, 0:00–0:07]
   Hook line that grabs attention.

   <!-- emotion: "Building intensity" -->
   [Scene 2 — Problem, 0:07–0:17]
   Narration for the second scene.

   <!-- emotion: "Triumphant reveal", speed: "Slower for emphasis" -->
   [Scene 3 — Solution, 0:17–0:27]
   The reveal narration.
   ```

   Rules: segment fits scene duration (~2.5w/s) | `[brackets]` stripped by VoiceCLI | `<!-- directives -->` for per-segment shifts | paralinguistic tags sparingly | 0.5–1s breathing room at boundaries.

4. **Render:**
   ```bash
   cd ~/projects/voiceCLI && uv run voicecli generate \
     /path/to/P/vo.md \
     -o /path/to/P/vo.wav \
     --mp3
   ```

5. **Verify timing:**
   ```bash
   ffprobe -v error -show_entries format=duration -of csv=p=0 P/vo.wav
   ```
   VO too long → trim text. VO too short → increase `segment_gap` or expand narration.

6. **Report:** output path (`P/vo.wav`), duration vs composition duration, render flag `--audio P/vo.wav`.

## Pacing reference

| Content type | Words/second | Words for 6s |
|-------------|-------------|--------------|
| Dramatic/slow | 2.0 | ~12 |
| Conversational | 2.5 | ~15 |
| Energetic/fast | 3.5 | ~21 |

## Engine selection

| Need | Engine | Why |
|------|--------|-----|
| Emotion control | `qwen` | Structured instruct (accent, personality, speed, emotion) |
| Speed | `qwen-fast` | CUDA graph, 5-9x faster |
| Non-English | `chatterbox` | 23 languages |
| Paralinguistic tags | `chatterbox-turbo` | Native `[laugh]`/`[sigh]` (English only) |
