import React from 'react'
import { interpolate, spring, useCurrentFrame, useVideoConfig } from '../../core'

export interface ScalePopProps {
  delay?: number
  children: React.ReactNode
  style?: React.CSSProperties
}

export const ScalePop: React.FC<ScalePopProps> = ({ delay = 0, children, style }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = spring({
    frame: frame - delay,
    fps,
    config: { damping: 8, stiffness: 120, mass: 0.6 },
  })

  return (
    <div
      style={{
        transform: `scale(${interpolate(s, [0, 1], [0.3, 1])})`,
        opacity: Math.min(1, s * 2),
        ...style,
      }}
    >
      {children}
    </div>
  )
}
