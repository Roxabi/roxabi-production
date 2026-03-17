export interface VideoConfig {
  fps: number
  width: number
  height: number
  durationInFrames: number
}

export interface SpringConfig {
  damping?: number
  stiffness?: number
  mass?: number
}

export interface InterpolateOptions {
  extrapolateLeft?: 'clamp' | 'extend'
  extrapolateRight?: 'clamp' | 'extend'
  easing?: (t: number) => number
}

export interface CompositionConfig {
  id: string
  component: React.ComponentType
  durationInFrames: number
  fps: number
  width: number
  height: number
}
