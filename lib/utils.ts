import { interpolate, spring } from '../core'
import type { SpringConfig } from '../core'

/** Clamp interpolate shorthand */
export const cInterpolate = (
  frame: number,
  inputRange: readonly number[],
  outputRange: readonly number[],
) =>
  interpolate(frame, inputRange, outputRange, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

/** Fade in over N frames, starting at `delay` */
export const fadeIn = (frame: number, duration = 20, delay = 0) =>
  cInterpolate(frame, [delay, delay + duration], [0, 1])

/** Fade out over N frames, starting at `delay` */
export const fadeOut = (frame: number, duration = 20, delay = 0) =>
  cInterpolate(frame, [delay, delay + duration], [1, 0])

/** Fade in then out */
export const fadeInOut = (
  frame: number,
  totalDuration: number,
  fadeDuration = 15,
) =>
  Math.min(
    fadeIn(frame, fadeDuration),
    fadeOut(frame, fadeDuration, totalDuration - fadeDuration),
  )

/** Spring shorthand */
export const sprng = (
  frame: number,
  fps: number,
  config?: Partial<SpringConfig>,
  delay = 0,
) =>
  spring({
    frame,
    fps,
    delay,
    config: { damping: 12, stiffness: 100, mass: 0.8, ...config },
  })

/** Slide from a direction */
export const slideFrom = (
  frame: number,
  fps: number,
  direction: 'left' | 'right' | 'top' | 'bottom' = 'bottom',
  distance = 80,
  delay = 0,
) => {
  const progress = sprng(frame, fps, { damping: 15 }, delay)
  const map: Record<string, string> = {
    left: `translateX(${interpolate(progress, [0, 1], [-distance, 0])}px)`,
    right: `translateX(${interpolate(progress, [0, 1], [distance, 0])}px)`,
    top: `translateY(${interpolate(progress, [0, 1], [-distance, 0])}px)`,
    bottom: `translateY(${interpolate(progress, [0, 1], [distance, 0])}px)`,
  }
  return { transform: map[direction], opacity: progress }
}

/** Stagger delay calculator */
export const stagger = (index: number, delayPerItem = 5) =>
  index * delayPerItem
