# video-engine

Custom React video engine for the Roxabi ecosystem — 65 animated components, 12 kits, React → Puppeteer → FFmpeg pipeline.

## Install

```bash
claude plugin marketplace add Roxabi/roxabi-production
claude plugin install video-engine
```

## Skills

| Skill | Trigger | Description |
|-------|---------|-------------|
| `/render` | "render", "export video" | Render a composition to MP4 via CLI |
| `/compose` | "compose", "new composition", "build a video" | Scaffold a new video composition using kit components |
| `/showcase` | "showcase", "demo video" | Generate a showcase of available components |

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
