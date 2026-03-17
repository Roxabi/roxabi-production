---
name: generate
description: 'Generate a complete video composition from a brief or script using the Roxabi video engine. Triggers: "generate video" | "create video" | "make a video" | "video from brief" | "compose video".'
version: 0.1.0
argument-hint: '<brief or script describing the video to generate>'
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, AskUserQuestion
---

# Generate Video Composition

Generate a complete, renderable video composition from a user brief using the Roxabi video engine.

## Context

The Roxabi video engine is a React-based programmatic video framework. Compositions are React components that use frame-based animation. The engine lives at the project root with this structure:

- `core/` — primitives: `useCurrentFrame`, `useVideoConfig`, `AbsoluteFill`, `Sequence`, `Series`, `Audio`, `interpolate`, `spring`, `Easing`, `clamp`, `random`
- `lib/` — shortcuts: `fadeIn`, `fadeOut`, `fadeInOut`, `slideFrom`, `stagger`, `sprng`, `cInterpolate`
- `themes/` — `COLORS`, `ACCENTS`, `PALETTES` (neon, mono, sunset, ocean, forest, candy, cyber)
- `kits/` — 13 component kits (55 components total)
- `player/` — `Player`, `Studio`
- `renderer/` — headless Puppeteer + FFmpeg pipeline

### Available Kits

| Kit | Components | Purpose |
|-----|-----------|---------|
| `kit-text` | Typewriter, FadeText, StaggeredWords, CountUp, GlitchText, WordByWord, StaggerLines | Text animation & typography |
| `kit-motion` | FadeIn, SlideIn, ScalePop, CameraShake, FlickerReveal, PulseGlow, NumberReveal | Motion & entrance animations |
| `kit-backgrounds` | GradientBackground, ParticleField, GridPattern, Glow | Backgrounds & patterns |
| `kit-cinema` | KenBurns, FilmGrain, Vignette, LightSweep, FloatingOrbs | Cinematic effects |
| `kit-dataviz` | AnimatedBar, ProgressRing, ProgressBar, AnimatedLine, AnimatedCounter | Data visualization |
| `kit-overlays` | SyncedCaptions, ImpactText, IconBadge, FloatingCards | Overlay elements |
| `kit-layout` | SlideBase, Chrome, Title, Body, Quote, TerminalBox, AccentBadge | Layout & structure |
| `kit-social` | LowerThird, SocialCard, CaptionOverlay | Social & broadcast |
| `kit-ui` | ChatInterface, PhoneFrame, LaptopFrame, BrowserTabs, EmailInbox, NotificationToast, Timer, BrandBadge, FlowDiagram | UI mockups |
| `kit-transitions` | SceneTransition (fade, wipe-*, circle-reveal, zoom-*, slide-*) | Scene transitions |
| `kit-audio` | WaveformBars | Audio visualization |
| `kit-shapes` | AnimatedShape | Geometric animations |
| `kit-3d` | FloatingObject | 3D elements |

## Phases

**1 — Understand the brief.** Read the user's brief. If critical details are missing (topic, audience, approximate duration, tone), ask with `AskUserQuestion`. Infer reasonable defaults for anything non-critical.

**2 — Discover the engine.** Read `core/index.ts`, `lib/index.ts`, `themes/index.ts`, and the `index.ts` of each kit you plan to use. Read existing compositions in `dev/main.tsx` for the registration pattern. If the brief references a specific component, read its source file for exact props.

**3 — Plan the composition.** Design a scene-by-scene breakdown:
- Scene count, duration per scene (in frames at 30fps), total duration
- Which kits/components per scene
- Transition strategy between scenes
- Color palette and accent choices from `themes/`
- Audio sync points if narration is provided

Present the plan to the user before writing code.

**4 — Write the composition.** Create a new `.tsx` file in the project. Follow these patterns:

```tsx
// Imports — always from relative paths to project root
import { useCurrentFrame, useVideoConfig, AbsoluteFill, Sequence } from '../core'
import { interpolate, spring, Easing } from '../core'
import { fadeIn, slideFrom, stagger } from '../lib'
import { COLORS, ACCENTS, PALETTES } from '../themes'
import { FadeText, Typewriter } from '../kits/kit-text'
import { FadeIn, SlideIn } from '../kits/kit-motion'
import { SlideBase, Title } from '../kits/kit-layout'
// ... more kits as needed

// Scene components
const Scene1: React.FC = () => {
  const frame = useCurrentFrame()
  // ... use interpolate, spring, kit components
  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      {/* scene content */}
    </AbsoluteFill>
  )
}

// Main composition
export const MyVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={150}>
        <Scene1 />
      </Sequence>
      <Sequence from={150} durationInFrames={120}>
        <Scene2 />
      </Sequence>
      {/* ... more scenes */}
    </AbsoluteFill>
  )
}
```

Rules:
- Always use `Sequence` with explicit `from` and `durationInFrames` for scene timing
- Use `AbsoluteFill` as the root container for each scene
- Default to 30fps, 1920x1080 unless the brief specifies otherwise
- Use `SlideBase` for consistent padding on content scenes
- Apply transitions between scenes with `SceneTransition` or manual fade logic
- Use `spring()` for natural motion, `interpolate()` for linear/eased values
- Use `random(seed)` for any procedural/random elements (deterministic renders)
- Keep scene components small and focused — one visual idea per scene

**5 — Register the composition.** Update `dev/main.tsx` to import the composition and add it to the `compositions` array:

```tsx
import { MyVideo } from '../path/to/composition'

const compositions: CompositionConfig[] = [
  {
    id: 'my-video',
    component: MyVideo,
    durationInFrames: totalFrames,
    fps: 30,
    width: 1920,
    height: 1080,
  },
]
```

**6 — Validate.** Run `bun run typecheck` to verify the composition compiles. Fix any type errors.

## Edge Cases

| Scenario | Behavior |
|----------|----------|
| Brief mentions audio/narration | Include `<Audio src={...} />` component, suggest SyncedCaptions if transcript available |
| No duration specified | Default to 30s (900 frames at 30fps) |
| Brief is vague | Ask for clarification on 1-2 key points, then proceed with reasonable defaults |
| User wants to edit existing composition | Read it first, then modify — never rewrite from scratch |
| Brief mentions data/stats | Use kit-dataviz components (AnimatedBar, ProgressRing, CountUp) |
| Brief mentions device mockups | Use kit-ui (PhoneFrame, LaptopFrame, BrowserTabs) |

$ARGUMENTS
