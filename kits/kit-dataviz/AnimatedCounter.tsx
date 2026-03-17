import React from 'react'
import { useCurrentFrame, interpolate, Easing } from '../../core'
import { COLORS } from '../../themes'

export interface AnimatedCounterProps {
  value: number
  delay?: number
  duration?: number
  suffix?: string
  prefix?: string
  color?: string
  size?: number
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  delay = 0,
  duration = 40,
  suffix = '',
  prefix = '',
  color = COLORS.amber,
  size = 72,
}) => {
  const frame = useCurrentFrame()
  const elapsed = Math.max(0, frame - delay)
  const progress = interpolate(elapsed, [0, duration], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })
  const current = Math.round(value * progress)

  return (
    <span
      style={{
        fontFamily: 'Cormorant, serif',
        fontWeight: 700,
        fontSize: size,
        color,
        lineHeight: 1,
      }}
    >
      {prefix}{current}{suffix}
    </span>
  )
}
