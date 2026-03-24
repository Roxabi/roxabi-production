# video-engine

Custom React video engine for the Roxabi ecosystem — 65 animated components, 12 kits, React → Puppeteer → FFmpeg pipeline with integrated voice-over and sound design.

## Install

```bash
claude plugin marketplace add Roxabi/roxabi-production
claude plugin install video-engine
```

## Skills

### Core

| Skill | Trigger | Description |
|-------|---------|-------------|
| `/compose` | "compose", "new composition", "build a video" | Scaffold a new video composition using kit components + VO draft |
| `/render` | "render", "export video" | Render a composition to MP4 with auto-detected audio layers |
| `/showcase` | "showcase", "demo video" | Preview or render the component showcase |

### Audio

| Skill | Trigger | Description |
|-------|---------|-------------|
| `/voice-over` | "voice-over", "generate vo", "add voice" | Generate a VO script from scene structure and render to WAV via VoiceCLI |
| `/soundtrack` | "soundtrack", "audio mix", "add sfx" | Build a complete audio mix (VO + BGM + SFX) with render-ready flags |

### Production

| Skill | Trigger | Description |
|-------|---------|-------------|
| `/storyboard` | "storyboard", "plan a video", "scene breakdown" | Plan scenes, timing, narrative arc, VO draft, and visual direction |
| `/produce` | "produce", "make a video", "full production" | End-to-end pipeline: storyboard → compose → voice-over → soundtrack → render |

### Analysis

| Skill | Trigger | Description |
|-------|---------|-------------|
| `/reverse-engineer` | "reverse-engineer", "extract style", "recreate this" | Analyze existing videos to extract visual patterns and generate new TSX components |

## Kit Reference

| Kit | Components | Highlights |
|-----|-----------|------------|
| `kit-backgrounds` | 5 | GradientBackground, ParticleField, GridPattern, Glow, BokehBackground |
| `kit-cinema` | 10 | ChromaticAberration, FilmGrain, FloatingOrbs, FogLayer, GlitchOverlay, KenBurns, LightSweep, TunnelEffect, Vignette, ImageFrame |
| `kit-text` | 7 | GlitchText, Typewriter, StaggeredWords, WordByWord, FadeText, StaggerLines, CountUp |
| `kit-layout` | 8 | SlideBase, Title, Body, Quote, AccentBadge, Chrome, TerminalBox, TextCard |
| `kit-motion` | 7 | FadeIn, SlideIn, ScalePop, FlickerReveal, CameraShake, PulseGlow, NumberReveal |
| `kit-ui` | 10 | ChatInterface, BrowserTabs, LaptopFrame, PhoneFrame, EmailInbox, FlowDiagram, BrandBadge, NotificationToast, Timer, GitHubCard |
| `kit-dataviz` | 6 | AnimatedBar, AnimatedLine, AnimatedCounter, NeuralNetworkGraph, ProgressBar, ProgressRing |
| `kit-overlays` | 4 | SyncedCaptions, ImpactText, FloatingCards, IconBadge |
| `kit-social` | 3 | SocialCard, LowerThird, CaptionOverlay |
| `kit-shapes` | 2 | AnimatedShape, PixelArtScene |
| `kit-3d` | 1 | FloatingObject |
| `kit-transitions` | 1 | SceneTransition (9 types) |
| `kit-audio` | 1 | WaveformBars |

## Audio Pipeline

The renderer supports multi-track audio mixing:

```bash
bun render --composition <id> \
  --audio vo.wav \                          # Voice-over track
  --bgm=music.mp3:vol=0.2 \                # Background music with volume
  --sfx=t=2.5:file=whoosh.mp3:vol=0.8 \    # SFX cue at 2.5s
  --sfx=t=8.0:file=impact.mp3:vol=0.6      # SFX cue at 8.0s
```

Voice-over scripts use VoiceCLI's markdown format with per-segment emotion control:

```markdown
---
voice: Sohee
engine: qwen
emotion: "Confident narrator"
segment_gap: 500
---

Opening hook line.

<!-- emotion: "Building intensity" -->
Second scene narration.
```
