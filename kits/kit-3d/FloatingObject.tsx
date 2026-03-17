import React from 'react'
import { useCurrentFrame, useVideoConfig } from '../../core'
import { sprng } from '../../lib'

export interface FloatingObjectProps {
  children: React.ReactNode
  /** Floating amplitude in px */
  amplitude?: number
  /** Rotation amplitude in degrees */
  rotateAmplitude?: number
  /** Speed factor */
  speed?: number
  /** Entrance animation delay */
  delay?: number
  style?: React.CSSProperties
}

/**
 * Wraps any content in a floating/bobbing 3D-like animation.
 * Uses CSS transforms with perspective for a pseudo-3D effect.
 */
export const FloatingObject: React.FC<FloatingObjectProps> = ({
  children,
  amplitude = 15,
  rotateAmplitude = 5,
  speed = 1,
  delay = 0,
  style,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const entrance = sprng(frame, fps, { damping: 12 }, delay)

  const t = frame * 0.02 * speed
  const y = Math.sin(t) * amplitude
  const rotateX = Math.sin(t * 0.7) * rotateAmplitude
  const rotateY = Math.cos(t * 0.5) * rotateAmplitude

  return (
    <div
      style={{
        perspective: 800,
        display: 'inline-block',
        ...style,
      }}
    >
      <div
        style={{
          transform: `translateY(${y}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${entrance})`,
          opacity: entrance,
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </div>
    </div>
  )
}
