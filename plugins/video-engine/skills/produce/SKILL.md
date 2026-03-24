---
name: produce
description: 'End-to-end video production — storyboard, compose, voice-over, soundtrack, render in one workflow. Triggers: "produce" | "make a video" | "full production" | "video from scratch" | "produce a video".'
version: 1.0.0
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# Produce

**Goal:** End-to-end video production pipeline — from a brief to a rendered MP4 with full audio.

## Pipeline

```
Brief → Storyboard → Compose → Voice-Over → Soundtrack → Render
```

Each stage uses the corresponding skill. This skill orchestrates the full flow.

## Steps

### Phase 1 — Brief

1. **Gather the brief** — ask the user:
   - **Subject:** What is the video about?
   - **Audience:** Who is watching? (developers, investors, users, general)
   - **Duration:** Target length in seconds (default: 30–60s)
   - **Tone:** Cinematic, energetic, professional, playful, dramatic?
   - **Format:** 1920x1080 (landscape), 1080x1920 (vertical/social), 1080x1080 (square)?
   - **Voice:** Should it have narration? What voice/language?
   - **Music:** BGM preference? (ambient, electronic, orchestral, none)
   - **Reference:** Any existing video or composition to draw from?

### Phase 2 — Storyboard

2. **Run `/storyboard` workflow** — from the brief, produce:
   - Scene breakdown with timing
   - Visual direction per scene (which kits/components)
   - Narrative arc and VO draft
   - Mood board (colors, transitions, atmosphere)

3. **Present storyboard for approval** — show the plan before building. User can adjust scenes, timing, or direction.

### Phase 3 — Compose

4. **Run `/compose` workflow** — scaffold the TSX composition:
   - Create `compositions/<name>/<Name>.tsx`
   - Register in `dev/main.tsx`
   - Typecheck

5. **Preview check** — suggest opening Studio to preview:
   ```bash
   bun dev
   # → http://localhost:3001?composition=<id>
   ```

### Phase 4 — Voice-Over

6. **Run `/voice-over` workflow** — if narration is requested:
   - Generate `compositions/<name>/vo.md` from scene structure
   - Render to `compositions/<name>/vo.wav` via VoiceCLI
   - Verify timing alignment

### Phase 5 — Soundtrack

7. **Run `/soundtrack` workflow** — build full audio mix:
   - VO (from phase 4)
   - SFX cues (matched to visual beats)
   - BGM (if requested)
   - Assemble all audio flags

### Phase 6 — Render

8. **Run `/render` workflow** — execute the full render:
   ```bash
   bun render --composition <id> \
     --fps 30 \
     --output dist/<id>.mp4 \
     --audio compositions/<name>/vo.wav \
     --bgm=assets/bgm/track.mp3:vol=0.2 \
     --sfx=t=...:file=...:vol=... \
     [additional sfx cues]
   ```

9. **Final report:**
   - Output file path and size
   - Duration
   - Audio layers used
   - Composition file locations
   - Suggest next steps (social cuts, vertical version, iterate)

## Quick mode

If the user says "make a video about X" without details, use sensible defaults:
- **Duration:** 30s
- **Format:** 1920x1080
- **Tone:** Professional
- **Voice:** Sohee (qwen), English
- **BGM:** ambient, vol 0.2
- **SFX:** auto-matched from `assets/sfx/`

Skip the approval step only if the user explicitly asks for speed ("just do it", "quick", "skip approval").

## Iteration

After the first render, the user may want to:
- **Adjust VO:** Edit `vo.md` → re-render audio → re-render video
- **Change timing:** Edit TSX scenes → re-render
- **Swap components:** Edit TSX → typecheck → re-render
- **Add/remove SFX:** Update soundtrack spec → rebuild command → re-render

Guide them to the right file and re-run only the necessary pipeline stages.
