import React from 'react'
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from '../../core'
import { cInterpolate, sprng } from '../../lib'

export type TransitionType =
  | 'fade'
  | 'wipe-left'
  | 'wipe-right'
  | 'wipe-up'
  | 'wipe-down'
  | 'circle-reveal'
  | 'zoom-in'
  | 'zoom-out'
  | 'slide-left'
  | 'slide-right'

export interface SceneTransitionProps {
  type?: TransitionType
  /** Duration in frames */
  duration?: number
  children: React.ReactNode
}

export const SceneTransition: React.FC<SceneTransitionProps> = ({
  type = 'fade',
  duration = 20,
  children,
}) => {
  const frame = useCurrentFrame()
  const { fps, width, height } = useVideoConfig()
  const progress = sprng(frame, fps, { damping: 20, stiffness: 80 })

  const getStyle = (): React.CSSProperties => {
    switch (type) {
      case 'fade':
        return { opacity: progress }

      case 'wipe-left':
        return {
          clipPath: `inset(0 ${(1 - progress) * 100}% 0 0)`,
        }
      case 'wipe-right':
        return {
          clipPath: `inset(0 0 0 ${(1 - progress) * 100}%)`,
        }
      case 'wipe-up':
        return {
          clipPath: `inset(0 0 ${(1 - progress) * 100}% 0)`,
        }
      case 'wipe-down':
        return {
          clipPath: `inset(${(1 - progress) * 100}% 0 0 0)`,
        }

      case 'circle-reveal': {
        const maxRadius = Math.sqrt(width * width + height * height) / 2
        const r = progress * maxRadius
        return {
          clipPath: `circle(${r}px at 50% 50%)`,
        }
      }

      case 'zoom-in':
        return {
          opacity: progress,
          transform: `scale(${cInterpolate(progress, [0, 1], [0.5, 1])})`,
        }
      case 'zoom-out':
        return {
          opacity: progress,
          transform: `scale(${cInterpolate(progress, [0, 1], [1.5, 1])})`,
        }

      case 'slide-left':
        return {
          transform: `translateX(${cInterpolate(progress, [0, 1], [100, 0])}%)`,
        }
      case 'slide-right':
        return {
          transform: `translateX(${cInterpolate(progress, [0, 1], [-100, 0])}%)`,
        }

      default:
        return { opacity: progress }
    }
  }

  return <AbsoluteFill style={getStyle()}>{children}</AbsoluteFill>
}
