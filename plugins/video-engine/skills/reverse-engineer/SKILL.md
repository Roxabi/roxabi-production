---
name: reverse-engineer
description: 'Analyze existing videos to extract visual patterns and generate new TSX components or composition templates. Triggers: "reverse-engineer" | "extract style" | "recreate this" | "video to components" | "analyze video style".'
version: 1.0.0
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, WebFetch, WebSearch, Agent
---

# Reverse-Engineer

**Goal:** Analyze an existing video (YouTube URL or local file) to extract visual patterns, then generate new TSX components or composition templates that reproduce the style.

## Entry points

```
/reverse-engineer https://youtube.com/watch?v=...          # YouTube video
/reverse-engineer path/to/video.mp4                         # Local file
/reverse-engineer https://youtube.com/watch?v=... --kit     # Generate a full kit
/reverse-engineer https://youtube.com/watch?v=... --comp    # Generate a composition template
```

## Steps

### Phase 1 — Capture & Analyze

1. **Source the video:**

   **YouTube URL:**
   - Use web-intel scrape skill to get metadata (title, duration, description)
   - If content-lab is available, run `/video-recipe` for VAKOG + narrative analysis
   - Download or screenshot keyframes using `yt-dlp`:
     ```bash
     # Extract keyframes (1 per 2 seconds)
     yt-dlp -o "tmp/reverse/%(title)s.%(ext)s" --write-thumbnail "$URL"
     ffmpeg -i tmp/reverse/*.mp4 -vf "fps=0.5" -q:v 2 tmp/reverse/frames/frame_%04d.jpg
     ```

   **Local file:**
   - Extract keyframes directly:
     ```bash
     mkdir -p tmp/reverse/frames
     ffmpeg -i "$FILE" -vf "fps=0.5" -q:v 2 tmp/reverse/frames/frame_%04d.jpg
     ```

2. **Analyze the frames** — for each keyframe, identify:
   - **Color palette:** dominant colors, gradients, accent colors
   - **Typography:** font style (serif/sans/mono), weight, size hierarchy, animation type
   - **Layout:** composition grid, element positioning, whitespace usage
   - **Backgrounds:** solid, gradient, particle, bokeh, grid, video, image
   - **Transitions:** cut, fade, wipe, zoom, slide, morph
   - **Motion patterns:** entrance direction, easing curves, stagger timing
   - **Effects:** grain, vignette, chromatic aberration, glow, glitch, blur
   - **UI elements:** device frames, browser chrome, terminals, cards, badges

3. **Build style profile** — document findings as a structured spec:

   ```markdown
   ## Style Profile: <video-title>

   ### Color Palette
   - Background: #0a0a0f (near-black)
   - Primary: #e85d04 (warm orange)
   - Accent: #3b82f6 (blue)
   - Text: #fafafa (white)
   - Muted: #6b7280 (gray)

   ### Typography
   - Headings: Sans-serif, 800 weight, uppercase
   - Body: Sans-serif, 400 weight
   - Code: Monospace (JetBrains Mono style)
   - Animation: Word-by-word stagger, 0.1s delay

   ### Transitions
   - Primary: Fade (0.5s) with slight zoom (1.0 → 1.02)
   - Secondary: Wipe-left between content scenes
   - Timing: 0.3s overlap

   ### Effects
   - Film grain: subtle, opacity 0.05
   - Vignette: soft, radius 0.8
   - Glow: on accent elements, blur 20px

   ### Scene Pattern
   - Hook (5s) → Problem (10s) → Solution (10s) → Features (10s) → CTA (5s)
   ```

### Phase 2 — Map to Existing Kits

4. **Match existing components** — for each identified pattern, check if a Roxabi kit component already covers it:

   | Detected pattern | Existing component | Gap? |
   |-----------------|-------------------|------|
   | Gradient bg | `GradientBackground` | No |
   | Particle field | `ParticleField` | No |
   | Glitch text | `GlitchText` | No |
   | Morphing shapes | — | **Yes** |
   | Split-screen layout | — | **Yes** |

5. **List gaps** — components that need to be created to reproduce the style.

### Phase 3 — Generate

6. **Generate new components** (for gaps identified in step 5):

   For each new component, create a TSX file following Roxabi conventions:
   - Place in the appropriate kit directory (`kits/kit-<category>/`)
   - Export from the kit's `index.ts`
   - Use `useCurrentFrame()` and `useVideoConfig()` from the core
   - Support `delay` and `duration` props for timing
   - Use `interpolate()` and `spring()` for animations
   - Follow existing component patterns (read 2-3 similar components first)

   ```tsx
   // kits/kit-motion/MorphShape.tsx
   import { useCurrentFrame, useVideoConfig, interpolate } from '../../core';

   interface MorphShapeProps {
     delay?: number;
     duration?: number;
     color?: string;
   }

   export const MorphShape: React.FC<MorphShapeProps> = ({
     delay = 0,
     duration = 60,
     color = '#e85d04',
   }) => {
     const frame = useCurrentFrame();
     const { fps } = useVideoConfig();
     // ... animation logic
   };
   ```

7. **Generate composition template** (if `--comp` flag):

   Create a full composition that reproduces the source video's structure:
   - Scene breakdown matching the source timing
   - Components selected/created to match each scene
   - Color palette applied via props
   - Transitions matched to source

   Place in `compositions/<source-slug>/<SourceSlug>.tsx`.

8. **Generate kit** (if `--kit` flag):

   Bundle all new components into a dedicated kit:
   - Create `kits/kit-<style-name>/` directory
   - One component per file
   - `index.ts` barrel export
   - Each component documented with JSDoc

### Phase 4 — Validate

9. **Typecheck:**
   ```bash
   bun run typecheck
   ```

10. **Register composition** (if generated) in `dev/main.tsx`.

11. **Report:**
    - Style profile summary
    - Components reused from existing kits
    - New components created (with file paths)
    - Composition template (if generated)
    - Suggest previewing in Studio

## Tips

- Start by finding 2-3 similar existing components and reading their implementation before generating new ones
- Prefer extending existing components with new props over creating duplicates
- Color palettes should be passed as props, not hardcoded
- All timing should use frame-based math (`delay + duration` pattern)
- Test with `bun dev` and visual inspection before committing
