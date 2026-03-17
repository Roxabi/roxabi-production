/**
 * Video Analyzer Pipeline
 *
 * Methodology for extracting reusable components from reference videos:
 *
 * STEP 1: ACQUIRE
 *   yt-dlp -f "bestvideo[height<=1080]+bestaudio" --download-sections "*0:00-1:30" -o "/tmp/ref.%(ext)s" <URL>
 *
 * STEP 2: SCENE DETECT
 *   ffmpeg -i ref.webm -filter:v "select='gt(scene,0.15)',showinfo" -vsync vfr frames/f_%04d.jpg 2>&1 | grep pts_time
 *   → gives timestamps of every visual change
 *
 * STEP 3: EXTRACT KEY FRAMES (at scene changes + midpoints)
 *   For each detected timestamp: ffmpeg -ss <t> -i ref.webm -frames:v 1 frame_<t>.jpg
 *   Also extract at midpoints between cuts for "stable" frames
 *
 * STEP 4: ANALYZE (visual — done by the LLM reading the images)
 *   For each frame, identify:
 *   - Layout pattern (centered, split, grid, overlay, fullbleed)
 *   - Background type (solid, gradient, stock footage, blurred photo)
 *   - Foreground elements (text, UI mockup, diagram, logo, icon, person)
 *   - Typography (size, weight, position, animation implied)
 *   - Color palette (extract dominant colors)
 *   - Overlay effects (grain, vignette, glow, light leak)
 *   - Motion implied (Ken Burns, float, parallax, slide-in)
 *
 * STEP 5: MAP TO KIT CATALOG
 *   For each identified element, check if we have a matching kit component:
 *   - kit-text: Typewriter, FadeText, StaggeredWords, CountUp, GlitchText
 *   - kit-ui: BrowserTabs, EmailInbox, ChatInterface, NotificationToast, Timer,
 *             PhoneFrame, LaptopFrame, BrandBadge, FlowDiagram
 *   - kit-cinema: FilmGrain, Vignette, LightSweep, KenBurns, FloatingOrbs
 *   - kit-overlays: SyncedCaptions, ImpactText, Badge, FloatingCards
 *   - kit-backgrounds: GradientBackground, ParticleField, GridPattern
 *   - kit-dataviz: AnimatedBar, ProgressRing, AnimatedLine
 *   - kit-shapes: AnimatedShape
 *   - kit-audio: WaveformBars
 *   - kit-3d: FloatingObject
 *   - kit-transitions: SceneTransition
 *   - kit-social: LowerThird, SocialCard, CaptionOverlay
 *
 * STEP 6: GAP ANALYSIS
 *   List elements that DON'T match any existing component → these are new kit candidates
 *
 * STEP 7: BUILD
 *   Create new components in the appropriate kit-* folder
 *   Test with a demo composition
 */

/** Component identification checklist */
export interface VisualElement {
  /** What type of element is this */
  type:
    | 'background'
    | 'text'
    | 'ui-mockup'
    | 'diagram'
    | 'logo'
    | 'icon'
    | 'person-photo'
    | 'stock-footage'
    | 'overlay-effect'
    | 'data-viz'
    | 'device-frame'
    | 'badge'
    | 'transition'
  /** Description of what it looks like */
  description: string
  /** Matching kit component, or null if none exists */
  kitMatch: string | null
  /** If no match, what component should be built */
  proposedComponent?: string
  /** Priority: how reusable would this component be */
  priority: 'high' | 'medium' | 'low'
}

export interface SceneAnalysis {
  /** Timestamp in seconds */
  timestamp: number
  /** Layout pattern */
  layout: 'centered' | 'split' | 'grid' | 'overlay' | 'fullbleed' | 'asymmetric'
  /** All visual elements identified */
  elements: VisualElement[]
  /** Dominant colors extracted */
  colors: string[]
  /** Overall mood/style */
  mood: string
}

export interface VideoAnalysis {
  /** Source URL */
  sourceUrl: string
  /** Video title */
  title: string
  /** Duration analyzed (seconds) */
  duration: number
  /** Scene-by-scene analysis */
  scenes: SceneAnalysis[]
  /** Components that exist in our kit */
  coveredByKit: string[]
  /** Components we need to build */
  gaps: string[]
}
