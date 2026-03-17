import React from 'react'
import { AbsoluteFill, useCurrentFrame } from '../../core'
import { cInterpolate } from '../../lib'

export interface GradientBackgroundProps {
  colors?: string[]
  /** Animate the gradient angle */
  animate?: boolean
  /** Degrees per full rotation */
  rotationSpeed?: number
  type?: 'linear' | 'radial' | 'conic'
  style?: React.CSSProperties
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  colors = ['#0f0c29', '#302b63', '#24243e'],
  animate = true,
  rotationSpeed = 360,
  type = 'linear',
  style,
}) => {
  const frame = useCurrentFrame()
  const colorStr = colors.join(', ')

  let bg: string
  if (type === 'radial') {
    bg = `radial-gradient(circle, ${colorStr})`
  } else if (type === 'conic') {
    const angle = animate ? (frame * 2) % 360 : 0
    bg = `conic-gradient(from ${angle}deg, ${colorStr})`
  } else {
    const angle = animate
      ? cInterpolate(frame, [0, rotationSpeed], [0, 360]) % 360
      : 135
    bg = `linear-gradient(${angle}deg, ${colorStr})`
  }

  return <AbsoluteFill style={{ background: bg, ...style }} />
}
