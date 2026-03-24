---
name: compose
description: 'Scaffold a new video composition using Roxabi kit components. Triggers: "compose" | "new composition" | "build a video" | "create a scene" | "new video".'
version: 1.0.0
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# Compose

**Goal:** Scaffold a new named composition with scenes, kit components, and register it in `dev/main.tsx`.

## Steps

1. **Gather intent** — ask the user: What is the composition about? How long (seconds)? Which kits/components to feature? 1920×1080 or custom dimensions?

2. **Plan scenes** — propose a scene structure (opening, content scenes, closing) with timing.

3. **Scaffold the file** — create `compositions/<name>/<Name>.tsx` with:
   - Correct imports from `../core` and `../kits/`
   - `AbsoluteFill` + `Sequence` structure
   - A scene per major beat, each wrapped in `SceneTransition`
   - `KitLabel` helper at the bottom-right of each scene
   - `Chrome` watermark on opening and closing scenes

4. **Register in `dev/main.tsx`** — add entry to `compositions` array:
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

5. **Typecheck** — run `bun run typecheck` and fix any errors before finishing.

6. **Generate VO draft** — after the composition is scaffolded, create a matching voice-over script at `compositions/<name>/vo.md`:
   - Extract text content from each scene (titles, body, captions)
   - Map scene timing to narration segments
   - Add VoiceCLI frontmatter (voice, engine, emotion, segment_gap)
   - Use `<!-- directives -->` for per-scene emotion shifts
   - Target ~2.5 words/second for natural pacing
   - Tell the user: "VO draft saved — run `/voice-over` to refine and render it."

## Kit quick-reference

Backgrounds: `GradientBackground`, `ParticleField`, `GridPattern`, `BokehBackground`, `Glow`
Cinema: `ChromaticAberration`, `FilmGrain`, `FloatingOrbs`, `FogLayer`, `LightSweep`, `TunnelEffect`, `Vignette`
Text: `GlitchText`, `Typewriter`, `StaggeredWords`
Motion: `FadeIn`, `ScalePop`, `PulseGlow`
UI: `ChatInterface`, `GitHubCard`, `PhoneFrame`, `BrandBadge`
DataViz: `AnimatedCounter`, `ProgressRing`, `AnimatedBar`, `NeuralNetworkGraph`
Overlays: `ImpactText`, `LowerThird`
