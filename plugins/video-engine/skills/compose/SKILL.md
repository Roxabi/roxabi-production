---
name: compose
description: 'Scaffold a new video composition using Roxabi kit components. Triggers: "compose" | "new composition" | "build a video" | "create a scene" | "new video".'
version: 1.0.0
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# Compose

**Goal:** Scaffold a new named composition with scenes, kit components, registered in `dev/main.tsx`.

Let: P = `compositions/<name>`, N = `<Name>`

## Steps

1. **Gather intent** — ask: subject, duration (seconds), kits/components to feature, dimensions (1920×1080 or custom).

2. **Plan scenes** — propose opening, content, closing structure with timing.

3. **Scaffold `P/N.tsx`** — correct imports from `../core` and `../kits/` | `AbsoluteFill` + `Sequence` structure | ∀ major beat: scene wrapped in `SceneTransition` | `KitLabel` bottom-right ∀ scene | `Chrome` watermark on opening + closing.

4. **Register in `dev/main.tsx`:**
   ```ts
   {
     id: '<name>',
     component: <Name>,
     durationInFrames: <fps × seconds>,
     fps: 30,
     width: 1920,
     height: 1080,
   }
   ```

5. **Typecheck** — `bun run typecheck`, fix errors before finishing.

6. **Generate VO draft** — create `P/vo.md`: extract text ∀ scene (titles/body/captions), map timing → narration segments, add VoiceCLI frontmatter (voice/engine/emotion/segment_gap), `<!-- directives -->` for per-scene shifts, target ~2.5w/s. Tell user: "VO draft saved — run `/voice-over` to refine and render."

## Kit quick-reference

| Kit | Components |
|-----|-----------|
| Backgrounds | `GradientBackground`, `ParticleField`, `GridPattern`, `BokehBackground`, `Glow` |
| Cinema | `ChromaticAberration`, `FilmGrain`, `FloatingOrbs`, `FogLayer`, `LightSweep`, `TunnelEffect`, `Vignette` |
| Text | `GlitchText`, `Typewriter`, `StaggeredWords` |
| Motion | `FadeIn`, `ScalePop`, `PulseGlow` |
| UI | `ChatInterface`, `GitHubCard`, `PhoneFrame`, `BrandBadge` |
| DataViz | `AnimatedCounter`, `ProgressRing`, `AnimatedBar`, `NeuralNetworkGraph` |
| Overlays | `ImpactText`, `LowerThird` |
