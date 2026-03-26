# Component Inventory

**Source:** AGGREGATION.md / AGGREGATION.json — 12 videos, 1946 frames analysed.

---

## Already Built

| Component | File path | What it does | Coverage |
|-----------|-----------|-------------|----------|
| `GradientBackground` | `kits/kit-backgrounds/GradientBackground.tsx` | Animated linear / radial / conic gradient fill for the whole frame | Universal base for dark-themed video backgrounds |
| `GridPattern` | `kits/kit-backgrounds/GridPattern.tsx` | SVG grid (lines or dots) with slow pan animation | Covers the "grid/dot grid" background texture seen across tech videos |
| `Glow` | `kits/kit-backgrounds/Glow.tsx` | Single animated ambient glow blob (accent-coloured, blurred radial) | Covers the dominant `glow` effect (4 385 occurrences) as a background element |
| `ParticleField` | `kits/kit-backgrounds/ParticleField.tsx` | Animated particles that float, rain, or drift; supports accent colours | Covers `particles` effect (225 occurrences); float / drift modes |
| `FilmGrain` | `kits/kit-cinema/FilmGrain.tsx` | SVG feTurbulence noise overlay, changes seed each frame | Covers `grain` (159 occurrences); overlay on any scene |
| `Vignette` | `kits/kit-cinema/Vignette.tsx` | Radial-gradient dark vignette overlay | Covers `vignette` (81 occurrences) |
| `LightSweep` | `kits/kit-cinema/LightSweep.tsx` | One-shot diagonal light-sweep across the frame | Covers cinematic sheen / reveal transitions |
| `KenBurns` | `kits/kit-cinema/KenBurns.tsx` | Slow zoom + pan wrapper; wraps any child | Covers the animated-illustration / photo pan seen in documentary-style videos |
| `FloatingOrbs` | `kits/kit-cinema/FloatingOrbs.tsx` | Multiple large blurred colour orbs drifting in the background | Covers `NeonGlowScene`, `AbstractGradient`, `FloatingOrbs` candidates |
| `SceneTransition` | `kits/kit-transitions/SceneTransition.tsx` | 9 transition types: fade, wipes, circle-reveal, zoom, slides | Universal scene-cut wrapper |
| `SlideBase` | `kits/kit-layout/SlideBase.tsx` | Full-frame dark container with padding, font family, overflow hidden | Used in all `text_card` scene types (1 148 occurrences) |
| `Title` | `kits/kit-layout/Title.tsx` | Large title text with accent | Core component for title cards |
| `Body` | `kits/kit-layout/Body.tsx` | Body/paragraph text | Core component for text-card body |
| `Quote` | `kits/kit-layout/Quote.tsx` | Styled pull-quote | Covers `QuoteCard` / `TextCard` pattern |
| `AccentBadge` | `kits/kit-layout/AccentBadge.tsx` | Small labelled badge with accent colour | Status / section label overlay |
| `Chrome` | `kits/kit-layout/Chrome.tsx` | Corner watermark with phase + day metadata | Per-video branding chrome |
| `TerminalBox` | `kits/kit-layout/TerminalBox.tsx` | Monospace bordered box for code output / terminal | Covers `CodeTerminal` / `CodeSnippetViewer` candidates |
| `GlitchText` | `kits/kit-text/GlitchText.tsx` | Character-level scramble-reveal with RGB offset | Covers `glitch` effect on text (160 occurrences), `DigitalGlitch` candidate |
| `Typewriter` | `kits/kit-text/Typewriter.tsx` | Char-by-char reveal with blinking cursor | Covers `TypewriterAnimation`, `KeyboardTyping` candidates |
| `StaggerLines` | `kits/kit-text/StaggerLines.tsx` | Multiple lines typed one after another with prefix | Terminal / code output scenes |
| `StaggeredWords` | `kits/kit-text/StaggeredWords.tsx` | Word-level spring entrance | Animated title / headline sequences |
| `WordByWord` | `kits/kit-text/WordByWord.tsx` | Word-by-word reveal with configurable gap | Caption-style animated text |
| `FadeText` | `kits/kit-text/FadeText.tsx` | Simple fade + translate entrance for text | Generic text reveal |
| `CountUp` | `kits/kit-text/CountUp.tsx` | Numeric count-up animation (text format) | Stat / metric reveals |
| `FadeIn` | `kits/kit-motion/FadeIn.tsx` | Fade + directional slide-in wrapper | Most common entrance animation; wraps any child |
| `SlideIn` | `kits/kit-motion/SlideIn.tsx` | Pure slide entrance | Alternative to FadeIn |
| `ScalePop` | `kits/kit-motion/ScalePop.tsx` | Spring scale-pop entrance | Impact reveals |
| `FlickerReveal` | `kits/kit-motion/FlickerReveal.tsx` | Flicker / static-noise reveal | Covers glitch / screen-on scenes |
| `CameraShake` | `kits/kit-motion/CameraShake.tsx` | Sinusoidal translate+rotate wrapper | Action / impact moments |
| `PulseGlow` | `kits/kit-motion/PulseGlow.tsx` | Pulsing drop-shadow glow wrapper | Covers `PulseGlow` / glow-on-element pattern |
| `NumberReveal` | `kits/kit-motion/NumberReveal.tsx` | Scale-in + blur-clear number reveal | Large stat moments |
| `AnimatedShape` | `kits/kit-shapes/AnimatedShape.tsx` | Circle / square / triangle / hexagon / star with grow/rotate/pulse/morph | Abstract geometric animations |
| `FloatingObject` | `kits/kit-3d/FloatingObject.tsx` | Floating bob + 3-axis rotation wrapper with spring entrance | Covers `FloatingObject` / product mockup floating scenes |
| `AnimatedBar` | `kits/kit-dataviz/AnimatedBar.tsx` | Horizontal bar chart with spring-animated bars | Data visualisation scenes |
| `AnimatedLine` | `kits/kit-dataviz/AnimatedLine.tsx` | SVG line chart that draws progressively | Trend / metric charts |
| `AnimatedCounter` | `kits/kit-dataviz/AnimatedCounter.tsx` | Animated numeric counter with prefix/suffix | Covers large-number stat reveals |
| `ProgressBar` | `kits/kit-dataviz/ProgressBar.tsx` | Single progress bar | Progress / loading indicators |
| `ProgressRing` | `kits/kit-dataviz/ProgressRing.tsx` | SVG circular progress ring | Radial stat display |
| `ChatInterface` | `kits/kit-ui/ChatInterface.tsx` | Full chat UI with header, messages, typing indicator, spring entrances | Covers `ChatInterface` (3+ occurrences), AI assistant demos |
| `BrowserTabs` | `kits/kit-ui/BrowserTabs.tsx` | Browser tab bar with animated tab appearance | Browser / productivity chaos scenes |
| `LaptopFrame` | `kits/kit-ui/LaptopFrame.tsx` | Laptop bezel + screen wrapper with float animation and 3D angle | `MacBook` / `LaptopGlowEffect` candidates |
| `PhoneFrame` | `kits/kit-ui/PhoneFrame.tsx` | Phone bezel + status bar wrapper with float | Mobile screen demos |
| `EmailInbox` | `kits/kit-ui/EmailInbox.tsx` | Email list with unread dots, search bar, highlight row | Productivity / inbox-chaos scenes |
| `FlowDiagram` | `kits/kit-ui/FlowDiagram.tsx` | Animated node-edge diagram, nodes + drawn lines | Architecture / workflow diagrams |
| `BrandBadge` | `kits/kit-ui/BrandBadge.tsx` | Animated brand/product badge (solid / outline / glass) | Tool / sponsor callouts |
| `NotificationToast` | `kits/kit-ui/NotificationToast.tsx` | Slide-in notification toast | Notification / alert scenes |
| `Timer` | `kits/kit-ui/Timer.tsx` | Countdown / elapsed timer display | Deadline / timer sequences |
| `SyncedCaptions` | `kits/kit-overlays/SyncedCaptions.tsx` | Word-timed captions with active-word highlight and chunking | Subtitles synced to transcription |
| `CaptionOverlay` | `kits/kit-social/CaptionOverlay.tsx` | Karaoke / pop / subtitle word overlay variants | Social-format captions |
| `ImpactText` | `kits/kit-overlays/ImpactText.tsx` | Big centred headline with perspective tilt entrance | Title card reveals |
| `FloatingCards` | `kits/kit-overlays/FloatingCards.tsx` | 3D-positioned floating notification cards | Productivity chaos overlay |
| `IconBadge` | `kits/kit-overlays/IconBadge.tsx` | Small icon + text badge with spring entrance | Feature / bullet point callouts |
| `SocialCard` | `kits/kit-social/SocialCard.tsx` | Full-frame social card with headline + accent line | Short-form content cards |
| `LowerThird` | `kits/kit-social/LowerThird.tsx` | Animated lower-third name/title bar | Interview / explainer overlays |
| `WaveformBars` | `kits/kit-audio/WaveformBars.tsx` | Audio waveform bars (simulated or sine) | Voice / audio visualisation |

---

## Needs to be Built — HIGH PRIORITY

> Threshold: >500 frame occurrences across the corpus globally, or pattern present in 5+ videos.

| Component | Why | Est. frequency | Complexity | Notes |
|-----------|-----|---------------|------------|-------|
| `TextCard` | `text_card` is the 4th most common scene type (1 148 total occurrences) and directly named `TextCard` (27 aggregated mentions). `SlideBase` exists but `TextCard` should be a ready-to-use full-frame dark card with centered or upper-third text, optional subtitle, and entry animations — requiring no assembly. | ~1 148 scene hits | Easy | Thin wrapper that composes `SlideBase` + `Title` + optional `Body` with spring entrances. Naming: `TextCard`. |
| `PixelArtScene` | `PixelArtCharacter` (14), `PixelArtFace` (13), `PixelCharacter` (9), `PixelArtScene` (5), `PixelEyes` (5) — 46+ aggregated mentions. Pixel-art aesthetic recurs across 3+ videos. Distinct rendering pattern (CSS `image-rendering: pixelated`, blocky grid). | ~46 aggregated mentions across 3+ videos | Medium | SVG or canvas grid renderer. Accepts a 2D colour-map array and renders each cell as a flat square. Supports animation frames. `PixelArtScene` or `PixelRenderer`. |
| `TunnelEffect` | `TunnelEffect` (5), `TunnelTrainScene` (9), `NeonTunnelTrain` (5), `HyperloopTunnel` (5), `TunnelTrainAnimation` (4), `BlueTunnel` (1), `BulletTrainTunnel` (3) — 32+ mentions. Speed tunnel is a visual motif in multiple videos. | ~32 aggregated mentions | Hard | CSS `perspective` + radially expanding rings that zoom toward the viewer, or SVG concentric ellipses with decreasing opacity. Accent colour option. Covers the cinematic travel/speed metaphor. |
| `GlitchOverlay` | `glitch` has 160 total effect occurrences across 9 videos. `GlitchText` exists but there is no full-frame or block-level glitch effect (random horizontal slice offsets, colour-channel shift, scanlines). | 160 effect occurrences | Medium | AbsoluteFill canvas that every N frames renders random horizontal strips offset by ±X px with a red/cyan channel duplication. Opacity prop. Distinct from `GlitchText`. |
| `FogLayer` | `fog` is the 4th most common effect with 1 681 occurrences across all 12 videos. No fog component exists. | 1 681 effect occurrences | Medium | CSS `radial-gradient` white/grey haze at the bottom or edges, animated opacity drift. Alternatively a blurred white overlay that scrolls slowly. `FogLayer` with `position`, `intensity`, `color`. |
| `ChromaticAberration` | 2 083 occurrences across all videos — the 3rd most common effect. No component exists. Pure post-processing overlay. | 2 083 effect occurrences | Medium | AbsoluteFill with a `mix-blend-mode: screen` red channel shifted left and a cyan channel shifted right using `filter: drop-shadow` or a canvas-based RGB-channel-split. Intensity prop (0–1). |
| `NeuralNetworkGraph` | `BrainNeuralNetwork` (2), `NeuralNetworkGlow` (1+), `RadialDotNetwork` (2), `NeuralBrainAnimation` (1) — appears in the AI-focused videos (the dominant category). A reusable animated node graph pattern. | ~8 aggregated mentions, 4+ videos | Hard | SVG with randomly-placed nodes, animated edges that pulse with opacity. Parameterisable: `nodeCount`, `accentColor`, `pulseDuration`. Covers abstract network / brain visualisations. |

---

## Needs to be Built — MEDIUM PRIORITY

> Threshold: 200–500 frame occurrences, or 2–4 videos, or a reusable abstraction unlocking multiple specific patterns.

| Component | Why | Est. frequency | Complexity | Notes |
|-----------|-----|---------------|------------|-------|
| `ImageFrame` | Needed for photo/illustration display: `VintagePortrait` (7), `HistoricalPortrait` (4+), `BlackAndWhitePortrait` (3), `PortraitCard` (2), `IllustrationFrame` (4). The engine has no component for displaying a static or Ken-Burns-animated image/photo with optional film-grain and vignette overlays. | ~30 aggregated mentions | Easy | `<img>` or CSS background-image wrapped in a styled container with optional greyscale filter, border, vignette, and KenBurns wrapping. Props: `src`, `grayscale`, `vintage`, `caption`. |
| `CodeBlock` | `CodeTerminal` (4), `CodeSnippetViewer` (1), `CodeReviewPanel` (1), `GitHubRepoCard` (4). The `TerminalBox` exists for terminal-style output but no syntax-highlighted code display with line numbers and a fake editor chrome (tab bar, file name). | ~10 aggregated mentions across tech videos | Medium | A dark panel with a fake VS Code / editor header, line numbers, and monospaced code text coloured with minimal syntax rules. `CodeBlock` with `code`, `language`, `filename` props. |
| `GitHubCard` | `GitHub` (134 in one video), `GitHubRepoCard` (4). Recurring in tech videos: repository card with stars, forks, commit activity strip. | ~138 aggregated mentions | Medium | Mock GitHub repo card: owner/repo name, language badge, star/fork counts, animated commit-activity mini-bars. All props are text/numbers — no image needed. |
| `SpeedLines` | `SpeedLineEffect` (1), `SpeedTunnelEffect` (1), `LightStreaks` (3), `DynamicEnergyStreaks` (2), `GlowingLightStreaks` (1). Radial speed/energy lines emanating from a center point. Seen in action / impact moments. | ~8 aggregated mentions | Medium | SVG lines from a configurable origin, each with random length and opacity that animate outward. Used as an overlay wrapper. `SpeedLines` with `origin`, `count`, `color`, `duration`. |
| `BokehBackground` | `bokeh` has 96 effect occurrences across 6 videos. `ColorfulBokehParticles` (2), `ParticleBokehEffect` (2). Currently `ParticleField` provides round particles but without the characteristic large blurred soft circles of bokeh. | 96 effect occurrences | Easy | Large (40–120 px) soft blurred circles with very low opacity, slow drift. Different from `ParticleField`'s small sharp particles. `BokehBackground` with `count`, `colors`. |
| `PixelCounter` | `PixelNumberDisplay` (3), `SimplePixelLetter` (4), `CountdownNumber` (1), `SimpleNumberDisplay` (1). A large retro pixel/LCD number display, different from the smooth serif `NumberReveal`. | ~9 aggregated mentions | Easy | Renders a number using a segmented-display font (or SVG segments) with optional flicker. Good for countdown clocks, stat reveals in tech contexts. |
| `PatreonCard` | `PatreonPromotionCard` (6), `SponsoredContentCard` (3), `SponsoredContentIllustration` (4). Recurs across the French essay-style videos as a mid-video sponsor / Patreon break. | ~13 aggregated mentions | Easy | Branded sponsor/Patreon card with logo placeholder, headline, CTA text, and animated accent line. `SponsorCard` generalised. |
| `StrategicDecisionCard` | `StrategicDecisionFrame` (16), `StrategicDecisionFramework` (4). High count in the Anthropic video — a data card with decision scenario text and numbered options. | 20 aggregated mentions | Medium | Card with a title, a numbered list, and optional probability bars. Generalise as `DecisionCard` or `OptionListCard`. |
| `OpenCodePanel` | `OpenCode` (32) — the second-highest unique word in the aggregation. Tech-demo video about Opencode. A mock IDE/terminal panel showing AI-assisted coding output. | 32 aggregated mentions | Hard | Composed from `TerminalBox` / `CodeBlock` + `ChatInterface`. A two-panel layout: left = file tree or code editor, right = AI chat. `DeveloperWorkspace` or `OpenCodePanel`. |

---

## Needs to be Built — LOW PRIORITY / SKIP

> Threshold: <200 frames, highly specific to one video, or pure content that can't be abstracted.

| Component | Why | Est. frequency | Complexity | Notes |
|-----------|-----|---------------|------------|-------|
| `TunnelTrain` | `TunnelTrainScene` (9), `NeonTunnelTrain` (5), `HyperloopTunnel` (5) — all one video. Highly specific to a single cinematic metaphor. | ~19 mentions, 1 video | Hard | Overlaps with `TunnelEffect` (HIGH). Build the generic `TunnelEffect` first; specific train assets are image-dependent. |
| `SamouraiScene` | `SamouraiDansLa/Le/ant` etc. — 200+ mentions but all in a single video with specific copyrighted imagery. Not reusable. | Many, 1 video | n/a | Skip. The `KenBurns` + `ImageFrame` + effects covers the pattern without the specific content. |
| `DeLoreanScene` | `DeLorean` (7) — specific to Ready Player One video. | 7 mentions, 1 video | Hard | Skip. Covered by `ImageFrame` + `GlitchOverlay` + `ChromaticAberration`. |
| `PyramidScene` | `PyramidSunsetScene` (3), `DesertSilhouetteScene` (3), `GizaPyramidsAerialView` (2). Stock photo compositions from one video. | ~8 mentions, 1 video | n/a | Skip. Requires actual images; `ImageFrame` + `KenBurns` is sufficient. |
| `LacrimosophiaArt` | `LacrimosophiaIllustration` (20), `LacrimosophiaTextCard` (13) — brand-specific artwork for one channel's show. | ~60+ mentions, 1 video | n/a | Skip. Channel-specific asset, not a reusable component. |
| `ClassicPortrait` | `VintagePortrait` (7), `HistoricalEngraving` (3), `MedievalPortrait` (2) — various historical illustration styles. | ~15 mentions | Easy | Low value: `ImageFrame` with `grayscale + vintage` filter covers this. |
| `SpeechBubbleIcon` | `SpeechBubbleIcon` (5), `SpeechBubbleIcons` (2), `ComicSpeechBubbles` (1). | ~8 mentions | Easy | SVG speech bubble shape — useful but not a priority. Covers a very narrow use case. |
| `ConcentricClock` | `ConcentricClock` (2). Specific to the philosophy video. | 2 mentions, 1 video | Hard | Skip. One-off art direction. |
| `FilmStripAnimation` | `FilmReelEffect` (2), `FilmStripAnimation` (1), `FilmStripGlow` (1). | ~4 mentions | Medium | Skip for now. Could be built as a `FilmStrip` overlay later. |
| `MazeIllustration` | `MazeIllustration` (1), `SimpleMaze` (1) | 2 mentions, 1 video | Medium | Skip. Highly specific. |

---

## Visual Effects (Post-processing)

These are full-frame overlays that stack on top of any scene component. They do not own content.

| Effect | Exists? | How to implement | Notes |
|--------|---------|-----------------|-------|
| **Glow** | Partial — `Glow.tsx` (single blob) and `FloatingOrbs.tsx` (multi-blob). Does not cover glow applied to the whole scene as a post-process. | `mix-blend-mode: screen` on a blurred radial gradient layer. For a global bloom effect: duplicate the scene into a canvas, apply `filter: blur(X)`, overlay at reduced opacity. CSS `filter: brightness(1.1) saturate(1.2)` on the scene wrapper approximates it without canvas. | Add a `SceneGlow` or `BloomOverlay` component: AbsoluteFill with blurred, screen-blended glow at configurable intensity. |
| **Blur** | No standalone component. | CSS `filter: blur(Xpx)` on a wrapper div, or `backdrop-filter: blur` for UI surfaces. For motion blur: CSS `filter: blur` applied only in the direction of motion with `transform-origin`. | Add `BlurOverlay` or accept `blur` as a prop on `SceneTransition`. For depth-of-field (bokeh) use `BokehBackground` (see MEDIUM). |
| **Chromatic Aberration** | No component (2 083 occurrences — most-needed missing effect). | Canvas: split image into R/G/B channels, offset R left by N px and B right by N px, composite. CSS approximation: three absolutely-positioned copies of the content at `opacity: 0.33` with `color` CSS filter for each channel, offset by ±3 px. More practical: use an SVG `feColorMatrix` filter with channel displacement. | `ChromaticAberration` — AbsoluteFill wrapper, intensity prop (0–1). At 0 it renders children normally. Best done with a CSS SVG filter applied to a wrapper element. |
| **Fog** | No component (1 681 occurrences — second-most-needed missing effect). | CSS `radial-gradient` or `linear-gradient` white/grey semi-transparent layer at the bottom (ground fog) or edges. Add slow drift via `translateY` oscillation. For volumetric look: two overlapping layers at different opacities and speeds. | `FogLayer` — position (`bottom`, `edges`, `full`), color, intensity, animated drift. Easy to implement. |
| **Vignette** | Yes — `Vignette.tsx`. Radial-gradient dark edges. | Already implemented. | No action needed. |
| **Grain** | Yes — `FilmGrain.tsx`. SVG feTurbulence, frame-by-frame seed. | Already implemented. | No action needed. |
| **Glitch** | Partial — `GlitchText.tsx` (text only). No full-frame glitch. | Canvas-based: slice the rendered frame into 10–20 horizontal strips, offset random strips by ±20 px horizontally each frame, add RGB split on some strips. CSS approximation: `clip-path` horizontal slices on duplicate AbsoluteFill layers, animated with random offset. | `GlitchOverlay` (see HIGH PRIORITY). Intensity prop, frequency (how many frames out of 30 trigger an event). |
| **Bokeh** | No standalone component. `ParticleField` provides small sharp dots. | Large soft blurred circles (CSS `filter: blur`, `border-radius: 50%`, low opacity, various sizes 40–120 px). Drift slowly. | `BokehBackground` (see MEDIUM PRIORITY). |

---

## Recommended Build Order

This sequence maximises coverage of the video patterns identified, building foundational pieces before specialised ones.

1. **`FogLayer`** — 1 681 effect occurrences, easy, fills the single biggest gap in the overlay toolkit. Single-file, no dependencies.

2. **`ChromaticAberration`** — 2 083 effect occurrences, the most-absent effect globally. SVG filter wrapper, no canvas required for a serviceable approximation. Single-file.

3. **`TextCard`** — 1 148 scene type hits, named directly 27 times. Composes existing primitives (`SlideBase`, `Title`, `FadeIn`). Near-zero effort; unblocks all text-card scene generation immediately.

4. **`GlitchOverlay`** — 160 effect occurrences, 9 of 12 videos. Fills the gap between `GlitchText` (exists) and full-frame visual glitch. Medium complexity, single canvas layer.

5. **`BokehBackground`** — 96 effect occurrences, 6 videos. Easy — large blurred circles, slow drift. Completes the particle/atmosphere background toolkit.

6. **`ImageFrame`** — unblocks all illustration / portrait / photo scenes without requiring custom components per image. `KenBurns` is already built; this adds the frame/filter wrapper.

7. **`TunnelEffect`** — 32+ aggregated component-name mentions, 2 videos. Hard but high aesthetic payoff. Unlocks the speed/travel metaphor category.

8. **`PixelArtScene`** — 46+ mentions, 3+ videos. Medium. The pixel-art aesthetic is a distinct visual language used consistently.

9. **`GitHubCard`** — 134 + 4 mentions in tech-content videos. Medium. Highly reusable for coding / developer channels.

10. **`NeuralNetworkGraph`** — appears in AI-content videos (the majority of the corpus). Hard. High reuse value for the target channel type.

11. **`GlitchOverlay` (full-frame)** — already listed at #4; this is a reminder it should precede the items below.

12. **`CodeBlock`** — 10+ mentions, tech videos. Medium. Fills the gap between raw `TerminalBox` and a real editor-style code display.

13. **`OpenCodePanel`** / **`DeveloperWorkspace`** — 32 mentions, one dedicated video. Hard but high visual richness. Composed from `CodeBlock` + `ChatInterface`.

14. **`PatreonCard` / `SponsorCard`** — 13 mentions, French essay videos. Easy. One component unlocks all sponsorship-break scenes.

15. **`PixelCounter`** — 9 mentions, easy. Rounds out the number-display palette alongside `NumberReveal` and `AnimatedCounter`.

16. **`SpeedLines`** — 8 mentions, medium. Useful action/energy overlay.

17. **`StrategicDecisionCard`** / **`OptionListCard`** — 20 mentions in business-analysis videos. Medium.

18. **`NeuralNetworkGraph`** — already at #10; reinforces priority.
