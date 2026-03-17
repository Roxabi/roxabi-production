import React from 'react'
import { interpolate, spring, useCurrentFrame, useVideoConfig } from '../../core'
import { COLORS } from '../../themes'

export const NumberReveal: React.FC<{
  value: string
  delay?: number
  color?: string
  size?: number
}> = ({ value, delay = 0, color = COLORS.amber, size = 120 }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = spring({
    frame: frame - delay,
    fps,
    config: { damping: 10, stiffness: 100, mass: 0.8 },
  })

  return (
    <span
      style={{
        fontFamily: 'Cormorant, serif',
        fontWeight: 700,
        fontSize: size,
        color,
        lineHeight: 1,
        display: 'inline-block',
        transform: `scale(${interpolate(s, [0, 1], [2.5, 1])})`,
        opacity: s,
        filter: `blur(${interpolate(s, [0, 1], [12, 0])}px)`,
      }}
    >
      {value}
    </span>
  )
}
