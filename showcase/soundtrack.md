# Soundtrack: Showcase

> Video: 56 seconds (1680 frames @ 30fps) | Style: Product Launch

## BGM

**Status: MISSING**

No BGM track found in `assets/` or `assets/audio/`. Required for product launch style.

**Recommended:**
- Track: `bgm-tech.mp3` (minimal synth + piano) per audio-design-rules.md
- Duration: 56s minimum (loop if shorter)
- Alternative: Check `~/.roxabi/production/lyra-product/` for existing pitch tracks that could serve as BGM

**When obtained, apply:**
```
Volume: 0.45
Fade in: 0.3s
Fade out: 1.5s (starting at 54.5s)
Lowpass: 4000Hz
```

---

## SFX Assets Inventory

| File | Available | Notes |
|------|-----------|-------|
| `assets/impact-boom.mp3` | Yes | Logo reveal, major impact |
| `assets/whoosh-intro.mp3` | Yes | Fast whoosh for intro elements |
| `assets/whoosh-trans.mp3` | Yes | Scene transitions |
| `assets/keyboard-typing.mp3` | Yes | Terminal typewriter |
| `assets/success-end.mp3` | Yes | Completion feedback |
| `assets/glitch-digital.mp3` | Yes | Glitch text effects |
| `assets/ding-notify.mp3` | Yes | Notifications, chat messages |
| `assets/data-process.mp3` | Yes | Data viz, neural net |
| `impact-soft.mp3` | **NO** | User requested - missing |
| `bgm/*.mp3` | **NO** | No BGM directory exists |

---

## Visual Beat Analysis

Based on `ShowcaseVideo.tsx` scene structure:

| Time | Frame | Scene | Visual Event | Priority |
|------|-------|-------|--------------|----------|
| 0.3s | 9 | Opening | ROXABI glitch reveal | P0 |
| 2.0s | 60 | Opening | AccentBadge spring | P1 |
| 7.0s | 210 | Transition | SceneText fade in | P1 |
| 9.0s | 270 | Text | Typewriter starts | P0 |
| 12.5s | 375 | Text | Terminal completes | P1 |
| 13.0s | 390 | Transition | SceneCinema wipe-left | P1 |
| 15.0s | 450 | Cinema | Bokeh/FogLayer appear | P2 |
| 16.5s | 495 | Cinema | LightSweep | P2 |
| 19.0s | 570 | Transition | SceneUI slide-left | P1 |
| 19.0s | 570 | UI | PhoneFrame appears | P1 |
| 20.5s | 615 | UI | ChatInterface first message | P1 |
| 22.0s | 660 | UI | ChatInterface response | P2 |
| 23.5s | 705 | UI | GitHub card ScalePop | P1 |
| 25.0s | 750 | Transition | SceneDataViz wipe-right | P1 |
| 25.5s | 765 | DataViz | NeuralNetworkGraph | P2 |
| 26.5s | 795 | DataViz | AnimatedCounter start | P2 |
| 31.0s | 930 | Transition | SceneMotion circle-reveal | P1 |
| 31.5s | 945 | Motion | AnimatedShapes appear | P1 |
| 37.0s | 1110 | Transition | SceneLayout wipe-up | P1 |
| 38.0s | 1140 | Layout | LowerThird appears | P1 |
| 43.0s | 1290 | Transition | SceneEngine zoom-out | P1 |
| 43.0s | 1290 | Engine | TunnelEffect starts | P2 |
| 44.5s | 1335 | Engine | Typewriter starts | P0 |
| 49.0s | 1470 | Transition | SceneClosing fade | P1 |
| 52.0s | 1560 | Closing | BUILD ANYTHING ImpactText | P0 |
| 53.5s | 1605 | Closing | Kits badge row springs | P1 |
| 55.5s | 1665 | Closing | Chrome v1.0 settles | P2 |

---

## SFX Cues

Applying ~6 cues/10s density for product launch style, prioritized per audio-design-rules.md:

| Time | File | Volume | Visual Sync | Notes |
|------|------|--------|-------------|-------|
| 0.3 | assets/impact-boom.mp3 | 1.0 | ROXABI reveal | Logo - P0 must have |
| 2.0 | assets/whoosh-intro.mp3 | 1.0 | Badge spring | Element entry |
| 7.0 | assets/whoosh-trans.mp3 | 1.0 | Scene transition | Fade to Text |
| 9.0 | assets/keyboard-typing.mp3 | 1.0 | Typewriter starts | P0 must have |
| 12.5 | assets/success-end.mp3 | 1.0 | Terminal complete | Completion feedback |
| 13.0 | assets/whoosh-trans.mp3 | 1.0 | Scene transition | Wipe to Cinema |
| 19.0 | assets/whoosh-trans.mp3 | 1.0 | PhoneFrame + transition | Slide to UI |
| 20.5 | assets/ding-notify.mp3 | 1.0 | Chat first message | Notification |
| 23.5 | assets/glitch-digital.mp3 | 1.0 | GitHub card reveal | Glitch effect |
| 25.0 | assets/whoosh-trans.mp3 | 1.0 | Scene transition | Wipe to DataViz |
| 25.5 | assets/data-process.mp3 | 1.0 | Neural net | Ambient (low priority) |
| 31.0 | assets/whoosh-trans.mp3 | 1.0 | Scene transition | Circle reveal |
| 37.0 | assets/whoosh-trans.mp3 | 1.0 | Scene transition | Wipe to Layout |
| 38.0 | assets/ding-notify.mp3 | 1.0 | LowerThird | Name card |
| 43.0 | assets/whoosh-trans.mp3 | 1.0 | Scene transition | Zoom to Engine |
| 44.5 | assets/keyboard-typing.mp3 | 1.0 | Terminal typewriter | P0 must have |
| 49.0 | assets/whoosh-trans.mp3 | 1.0 | Scene transition | Fade to Closing |
| 52.0 | assets/impact-boom.mp3 | 1.0 | BUILD ANYTHING | P0 must have |
| 53.5 | assets/success-end.mp3 | 1.0 | Badge row complete | Final success |

**Cue count: 19 | Density: ~3.4/10s** (conservative, leaves room for BGM)

---

## Render Command

**Two-step process:**

### Step 1: Build SFX track

```bash
ffmpeg -y \
  -i assets/impact-boom.mp3 \
  -i assets/whoosh-intro.mp3 \
  -i assets/whoosh-trans.mp3 \
  -i assets/keyboard-typing.mp3 \
  -i assets/success-end.mp3 \
  -i assets/ding-notify.mp3 \
  -i assets/glitch-digital.mp3 \
  -i assets/data-process.mp3 \
  -filter_complex "\
[0:a]adelay=300|300,volume=1.0[a0];\
[1:a]adelay=2000|2000,volume=1.0[a1];\
[2:a]adelay=7000|7000,volume=1.0[a2];\
[3:a]adelay=9000|9000,volume=1.0[a3];\
[4:a]adelay=12500|12500,volume=1.0[a4];\
[2:a]adelay=13000|13000,volume=1.0[a5];\
[2:a]adelay=19000|19000,volume=1.0[a6];\
[5:a]adelay=20500|20500,volume=1.0[a7];\
[6:a]adelay=23500|23500,volume=1.0[a8];\
[2:a]adelay=25000|25000,volume=1.0[a9];\
[7:a]adelay=25500|25500,volume=1.0[a10];\
[2:a]adelay=31000|31000,volume=1.0[a11];\
[2:a]adelay=37000|37000,volume=1.0[a12];\
[5:a]adelay=38000|38000,volume=1.0[a13];\
[2:a]adelay=43000|43000,volume=1.0[a14];\
[3:a]adelay=44500|44500,volume=1.0[a15];\
[2:a]adelay=49000|49000,volume=1.0[a16];\
[0:a]adelay=52000|52000,volume=1.0[a17];\
[4:a]adelay=53500|53500,volume=1.0[a18];\
[a0][a1][a2][a3][a4][a5][a6][a7][a8][a9][a10][a11][a12][a13][a14][a15][a16][a17][a18]amix=inputs=19:duration=longest:normalize=0[sfx]" \
  -map "[sfx]" -t 56 -c:a aac -b:a 192k out/sfx-track.m4a
```

### Step 2: Composite video + SFX + BGM (when available)

```bash
ffmpeg -y -i out/showcase.mp4 -i out/sfx-track.m4a -i assets/bgm-tech.mp3 \
  -filter_complex "\
[2:a]atrim=0:56,afade=in:st=0:d=0.3,afade=out:st=54.5:d=1.5,\
     lowpass=f=4000,volume=0.45[bgm];\
[1:a]highpass=f=800,volume=1.0[sfx];\
[bgm][sfx]amix=inputs=2:duration=first:normalize=0[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k out/showcase-final.mp4
```

**Note:** Replace `assets/bgm-tech.mp3` with actual BGM path when available.

---

## Missing Assets

| Asset | Required For | Suggested Source |
|-------|--------------|------------------|
| `assets/bgm-tech.mp3` | BGM layer | huashu-design or royalty-free minimal synth |
| `impact-soft.mp3` | User requested | Generate or source softer impact variant |

---

## Quality Checklist (pre-publish)

- [ ] BGM obtained and applied with lowpass 4000Hz
- [ ] SFX track has highpass 800Hz applied
- [ ] Volume: BGM 0.45, SFX 1.0, normalize=0
- [ ] BGM fade-in 0.3s, fade-out 1.5s
- [ ] All cues aligned to visual beats (frame-accurate)
- [ ] Listen with BGM muted: SFX alone has rhythm
- [ ] Listen with SFX muted: BGM alone has flow
