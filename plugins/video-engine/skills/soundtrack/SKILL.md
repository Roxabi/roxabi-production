---
name: soundtrack
description: 'Build a complete audio mix (VO + BGM + SFX) for a composition and output the render command. Triggers: "soundtrack" | "audio mix" | "add music" | "add sfx" | "sound design".'
version: 1.0.0
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# Soundtrack

**Goal:** Orchestrate voice-over, background music, and sound effects for a composition, then output the complete render command with all audio flags.

## Prerequisites

- VoiceCLI for VO generation
- `FREESOUND_API_KEY` in `.env` for CC0 SFX search/download
- FFmpeg for audio inspection

## Steps

1. **Identify composition** — read `dev/main.tsx` for the target composition. Read the TSX to understand scene structure and timing.

2. **Inventory existing audio** — check what's already available:
   ```bash
   # VO
   ls compositions/<name>/vo.wav 2>/dev/null
   # SFX
   ls assets/sfx/*.mp3 2>/dev/null
   # BGM
   ls assets/bgm/*.mp3 2>/dev/null
   ```

3. **Voice-over** — if no VO exists, generate one using the `/voice-over` workflow:
   - Analyze scenes → write `vo.md` → render with VoiceCLI
   - If VO already exists, confirm with user whether to regenerate

4. **SFX cue list** — analyze the composition for moments that need sound effects:

   | Trigger | SFX type | Example |
   |---------|----------|---------|
   | `GlitchText` entrance | glitch/digital | `glitch-digital.mp3` |
   | `SceneTransition` | whoosh/swoosh | `whoosh-trans.mp3` |
   | Title reveal | impact/boom | `impact-boom.mp3` |
   | `Typewriter` start | keyboard typing | `keyboard-typing.mp3` |
   | `NotificationToast` | notification ding | `ding-notify.mp3` |
   | Counter/number reveal | data processing | `data-process.mp3` |
   | Final tagline | success/resolution | `success-end.mp3` |

   For each cue, determine:
   - **Timestamp** (scene start frame / fps = seconds)
   - **SFX file** (check `assets/sfx/` first)
   - **Volume** (0.0–1.0, default 0.8; lower if VO is speaking)

5. **Search missing SFX** — for any cue without a matching file:
   ```bash
   npx tsx dev/freesound.ts search "whoosh" --max=5
   npx tsx dev/freesound.ts download <id> <name>
   ```
   Downloaded to `assets/sfx/<name>.mp3`.

6. **BGM selection** — if the user wants background music:
   - Check `assets/bgm/` for existing tracks
   - Suggest searching Freesound for ambient/loop tracks
   - Recommend volume 0.15–0.25 (lower when VO is present)
   - Default fade in/out: 2s

7. **Build the soundtrack spec** — create `compositions/<name>/soundtrack.md` documenting the full audio plan:

   ```markdown
   # Soundtrack: <composition-name>

   ## Voice-Over
   - File: `compositions/<name>/vo.wav`
   - Duration: Xs
   - Voice: Sohee (qwen)

   ## BGM
   - File: `assets/bgm/ambient-loop.mp3`
   - Volume: 0.2
   - Fade in: 2s, Fade out: 2s

   ## SFX Cues
   | Time | File | Volume | Scene |
   |------|------|--------|-------|
   | 0.5s | assets/sfx/glitch-digital.mp3 | 0.8 | Opening |
   | 7.0s | assets/sfx/whoosh-trans.mp3 | 0.7 | Transition 1→2 |
   | 13.0s | assets/sfx/impact-boom.mp3 | 0.9 | Reveal |
   ```

8. **Assemble render command:**
   ```bash
   bun render --composition <id> \
     --fps 30 \
     --output dist/<id>.mp4 \
     --audio compositions/<name>/vo.wav \
     --bgm=assets/bgm/track.mp3:vol=0.2 \
     --sfx=t=0.5:file=assets/sfx/glitch-digital.mp3:vol=0.8 \
     --sfx=t=7.0:file=assets/sfx/whoosh-trans.mp3:vol=0.7 \
     --sfx=t=13.0:file=assets/sfx/impact-boom.mp3:vol=0.9
   ```

9. **Report** — present the full command and the soundtrack spec. Ask if the user wants to render now or adjust cues first.

## Volume guidelines

| Layer | Default | With VO | Notes |
|-------|---------|---------|-------|
| VO | 1.0 | 1.0 | Always full volume |
| BGM | 0.2 | 0.15 | Duck under speech |
| SFX | 0.8 | 0.5–0.7 | Reduce if overlapping VO |

## SFX timing tips

- Place SFX 0.1–0.3s **before** the visual beat for perceived sync (audio leads visual)
- Transition whooshes: align with `SceneTransition` start frame
- Impact sounds: align with text entrance frame
- Ambient SFX: loop or extend to fill scene duration
