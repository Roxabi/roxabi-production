---
name: produce
description: 'End-to-end video production — storyboard, compose, voice-over, soundtrack, render in one workflow. Triggers: "produce" | "make a video" | "full production" | "video from scratch" | "produce a video".'
version: 1.0.0
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# Produce

**Goal:** End-to-end video production pipeline — brief to rendered MP4 with full audio.

## Pipeline

```
Brief → Storyboard → Compose → Voice-Over → Soundtrack → Render
```

## Steps

### Phase 1 — Brief

1. **Gather brief** — ask: Subject | Audience (developers/investors/users/general) | Duration (default 30–60s) | Tone (cinematic/energetic/professional/playful/dramatic) | Format (1920×1080/1080×1920/1080×1080) | Voice (narration? language?) | Music (ambient/electronic/orchestral/none) | Reference composition/video.

### Phase 2 — Storyboard

2. **Run `/storyboard`** — produce: scene breakdown + timing, visual direction per scene, narrative arc + VO draft, mood board.

3. **Present for approval** — user adjusts before build. ∀ scene: timing, direction, or content changes accepted.

### Phase 3 — Compose

4. **Run `/compose`** — scaffold TSX: `compositions/<name>/<Name>.tsx`, register in `dev/main.tsx`, typecheck.

5. **Preview check** — suggest:
   ```bash
   bun dev
   # → http://localhost:3001?composition=<id>
   ```

### Phase 4 — Voice-Over

6. **Run `/voice-over`** if narration requested — generate `compositions/<name>/vo.md`, render to `compositions/<name>/vo.wav`, verify timing.

### Phase 5 — Soundtrack

7. **Run `/soundtrack`** — assemble VO + SFX + BGM flags.

### Phase 6 — Render

8. **Run `/render`:**
   ```bash
   bun render --composition <id> \
     --fps 30 \
     --output dist/<id>.mp4 \
     --audio compositions/<name>/vo.wav \
     --bgm=assets/bgm/track.mp3:vol=0.2 \
     --sfx=t=...:file=...:vol=... \
     [additional sfx cues]
   ```

9. **Final report:** output path + size | duration | audio layers | composition file locations | suggest next steps (social cuts, vertical, iterate).

## Quick mode defaults

Subject "X" with no details → Duration: 30s | Format: 1920×1080 | Tone: Professional | Voice: Sohee (qwen), English | BGM: ambient vol 0.2 | SFX: auto-matched from `assets/sfx/`.

Skip approval only if user explicitly requests ("just do it" / "quick" / "skip approval").

## Iteration

Adjust VO → edit `vo.md` → re-render audio → re-render video. Change timing/components → edit TSX → typecheck → re-render. Add/remove SFX → update soundtrack spec → rebuild command → re-render. Guide user to the right file; re-run only necessary stages.
