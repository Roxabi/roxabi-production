---
name: soundtrack
description: 'Build a complete audio mix (VO + BGM + SFX) for a composition and output the render command. Triggers: "soundtrack" | "audio mix" | "add music" | "add sfx" | "sound design".'
version: 1.0.0
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# Soundtrack

**Goal:** Orchestrate VO + BGM + SFX for a composition; output the complete render command with all audio flags.

Let: P = `compositions/<name>`, A = `assets/`

## Prerequisites

- VoiceCLI for VO generation
- `FREESOUND_API_KEY` in `.env` for CC0 SFX search/download
- FFmpeg for audio inspection

## Steps

1. **Identify composition** — read `dev/main.tsx` for target. Read TSX for scene structure + timing.

2. **Inventory existing audio:**
   ```bash
   ls P/vo.wav 2>/dev/null
   ls A/sfx/*.mp3 2>/dev/null
   ls A/bgm/*.mp3 2>/dev/null
   ```

3. **Voice-over** — ∄ VO → run `/voice-over` workflow (scenes → `vo.md` → VoiceCLI render). ∃ VO → confirm with user before regenerating.

4. **SFX cue list** — analyze composition for moments needing SFX:

   | Trigger | SFX type | Example file |
   |---------|----------|-------------|
   | `GlitchText` entrance | glitch/digital | `glitch-digital.mp3` |
   | `SceneTransition` | whoosh/swoosh | `whoosh-trans.mp3` |
   | Title reveal | impact/boom | `impact-boom.mp3` |
   | `Typewriter` start | keyboard typing | `keyboard-typing.mp3` |
   | `NotificationToast` | notification ding | `ding-notify.mp3` |
   | Counter/number reveal | data processing | `data-process.mp3` |
   | Final tagline | success/resolution | `success-end.mp3` |

   ∀ cue: timestamp (frame/fps=seconds) | SFX file (check `A/sfx/` first) | volume (0–1, default 0.8; lower when VO speaking).

5. **Search missing SFX** — ∀ cue ∄ matching file:
   ```bash
   npx tsx dev/freesound.ts search "whoosh" --max=5
   npx tsx dev/freesound.ts download <id> <name>
   ```
   Downloaded to `A/sfx/<name>.mp3`.

6. **BGM selection** — check `A/bgm/` first. Volume 0.15–0.25 (lower when VO present). Default 2s fade in/out.

7. **Build soundtrack spec** — create `P/soundtrack.md`:

   ```markdown
   # Soundtrack: <composition-name>

   ## Voice-Over
   - File: `P/vo.wav`
   - Duration: Xs
   - Voice: Sohee (qwen)

   ## BGM
   - File: `A/bgm/ambient-loop.mp3`
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
     --audio P/vo.wav \
     --bgm=A/bgm/track.mp3:vol=0.2 \
     --sfx=t=0.5:file=A/sfx/glitch-digital.mp3:vol=0.8 \
     --sfx=t=7.0:file=A/sfx/whoosh-trans.mp3:vol=0.7 \
     --sfx=t=13.0:file=A/sfx/impact-boom.mp3:vol=0.9
   ```

9. **Report** — present full command + spec. Ask: render now or adjust cues first.

## Volume guidelines

| Layer | Default | With VO | Notes |
|-------|---------|---------|-------|
| VO | 1.0 | 1.0 | Always full |
| BGM | 0.2 | 0.15 | Duck under speech |
| SFX | 0.8 | 0.5–0.7 | Reduce if overlapping VO |

## SFX timing tips

SFX 0.1–0.3s before visual beat → perceived sync (audio leads visual). Transition whooshes → align with `SceneTransition` start. Impact sounds → align with text entrance frame. Ambient SFX → loop or extend to fill scene.
