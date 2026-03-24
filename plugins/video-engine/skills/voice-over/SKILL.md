---
name: voice-over
description: 'Generate a voice-over script and render it to WAV from a composition''s scene structure. Triggers: "voice-over" | "generate vo" | "narration" | "add voice" | "voice over".'
version: 1.0.0
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# Voice-Over

**Goal:** Analyze a composition's scene structure, generate a VoiceCLI-compatible `.md` voice script, and render it to WAV.

## Prerequisites

- VoiceCLI installed and available as `voicecli` (or via `uv run voicecli` from `~/projects/voiceCLI`)
- TTS daemon running for fast generation (`make tts` or `voicecli serve --engine qwen`)

## Steps

1. **Identify composition** — read `dev/main.tsx` to list compositions. If the user didn't specify one, ask. Then read the composition TSX file to extract:
   - Scene count and timing (frame ranges → seconds at the composition's fps)
   - Text content visible in each scene (titles, body text, captions, terminal lines)
   - Narrative arc (opening hook → content → closing)
   - Mood/tone per scene (inferred from components: GlitchText = edgy, BokehBackground = warm, TunnelEffect = intense)

2. **Choose voice profile** — ask the user or infer from composition style:

   | Style | Recommended voice | Engine | Personality |
   |-------|------------------|--------|-------------|
   | Tech product launch | `Sohee` or `Ryan` | qwen | Confident, measured |
   | Warm storytelling | `Vivian` | qwen | Warm, expressive |
   | Energetic demo | `Dylan` | qwen | Upbeat, fast-paced |
   | Cinematic | `Eric` | qwen | Deep, dramatic |
   | Multilingual | any | chatterbox | Adjust per language |

3. **Generate the script** — create `compositions/<name>/vo.md` with:

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

   **Rules:**
   - Each segment must fit within its scene duration (~2.5 words/second for natural pacing)
   - Scene markers in `[brackets]` are stripped by VoiceCLI — they're for human reference only
   - Use `<!-- directives -->` for per-segment emotion/speed shifts
   - Use paralinguistic tags (`[laugh]`, `[sigh]`) sparingly for naturalness
   - Leave 0.5–1s breathing room at scene boundaries for transitions

4. **Render the voice-over:**
   ```bash
   cd ~/projects/voiceCLI && uv run voicecli generate \
     /path/to/compositions/<name>/vo.md \
     -o /path/to/compositions/<name>/vo.wav \
     --mp3
   ```

5. **Verify timing** — check the generated WAV duration matches the composition duration:
   ```bash
   ffprobe -v error -show_entries format=duration -of csv=p=0 compositions/<name>/vo.wav
   ```
   If the VO is too long, suggest trimming text. If too short, suggest adding pauses via `segment_gap` or expanding narration.

6. **Report result** — show:
   - Output path (`compositions/<name>/vo.wav`)
   - Duration vs composition duration
   - Ready-to-use render flag: `--audio compositions/<name>/vo.wav`

## Pacing reference

| Content type | Words/second | Words for 6s scene |
|-------------|-------------|-------------------|
| Dramatic/slow | 2.0 | ~12 words |
| Conversational | 2.5 | ~15 words |
| Energetic/fast | 3.5 | ~21 words |

## Engine selection guide

| Need | Engine | Why |
|------|--------|-----|
| Emotion control | `qwen` | Structured instruct (accent, personality, speed, emotion) |
| Speed | `qwen-fast` | CUDA graph acceleration, 5-9x faster |
| Non-English | `chatterbox` | 23 languages with natural accent |
| Paralinguistic tags | `chatterbox-turbo` | Native `[laugh]`, `[sigh]` support (English only) |
