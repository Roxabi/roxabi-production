import type { SpringConfig, InterpolateOptions } from './types'

/**
 * Map a value from one range to another, with optional easing and clamping.
 * Drop-in replacement for Remotion interpolate().
 */
export function interpolate(
  value: number,
  inputRange: readonly number[],
  outputRange: readonly number[],
  options?: InterpolateOptions,
): number {
  const { extrapolateLeft = 'extend', extrapolateRight = 'extend', easing } = options ?? {}

  let segIdx = 0
  for (let i = 1; i < inputRange.length; i++) {
    if (value >= inputRange[i - 1]) segIdx = i - 1
  }
  segIdx = Math.min(segIdx, inputRange.length - 2)

  const inMin = inputRange[segIdx]
  const inMax = inputRange[segIdx + 1]
  const outMin = outputRange[segIdx]
  const outMax = outputRange[segIdx + 1]

  let t = inMax === inMin ? 0 : (value - inMin) / (inMax - inMin)

  if (t < 0 && extrapolateLeft === 'clamp') t = 0
  if (t > 1 && extrapolateRight === 'clamp') t = 1

  if (easing && t >= 0 && t <= 1) t = easing(t)

  return outMin + (outMax - outMin) * t
}

/**
 * Physics-based spring animation. Returns 0→~1 with possible overshoot.
 * Drop-in replacement for Remotion spring().
 */
export function spring(params: {
  frame: number
  fps: number
  delay?: number
  config?: Partial<SpringConfig>
}): number {
  const { frame, fps, delay = 0, config = {} } = params
  const { damping = 10, stiffness = 100, mass = 1 } = config

  const adjustedFrame = frame - delay
  if (adjustedFrame <= 0) return 0

  let position = 0
  let velocity = 0
  const target = 1
  const dt = 1 / fps

  for (let i = 0; i < adjustedFrame; i++) {
    const springForce = -stiffness * (position - target)
    const dampingForce = -damping * velocity
    const acceleration = (springForce + dampingForce) / mass
    velocity += acceleration * dt
    position += velocity * dt
  }

  return position
}

export const Easing = {
  linear: (t: number): number => t,
  quad: (t: number): number => t * t,
  cubic: (t: number): number => t * t * t,
  sin: (t: number): number => 1 - Math.cos((t * Math.PI) / 2),
  exp: (t: number): number => (t === 0 ? 0 : Math.pow(2, 10 * (t - 1))),
  out: (easing: (t: number) => number) => (t: number): number => 1 - easing(1 - t),
  inOut: (easing: (t: number) => number) => (t: number): number =>
    t < 0.5 ? easing(t * 2) / 2 : 1 - easing((1 - t) * 2) / 2,
  bezier: (x1: number, y1: number, x2: number, y2: number) => {
    return (t: number): number => {
      let guessT = t
      for (let i = 0; i < 8; i++) {
        const x = cubicBezier(guessT, x1, x2) - t
        if (Math.abs(x) < 1e-6) break
        const dx = cubicBezierDerivative(guessT, x1, x2)
        if (Math.abs(dx) < 1e-6) break
        guessT -= x / dx
      }
      return cubicBezier(guessT, y1, y2)
    }
  },
} as const

function cubicBezier(t: number, p1: number, p2: number): number {
  return 3 * (1 - t) * (1 - t) * t * p1 + 3 * (1 - t) * t * t * p2 + t * t * t
}

function cubicBezierDerivative(t: number, p1: number, p2: number): number {
  return 3 * (1 - t) * (1 - t) * p1 + 6 * (1 - t) * t * (p2 - p1) + 3 * t * t * (1 - p2)
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}
