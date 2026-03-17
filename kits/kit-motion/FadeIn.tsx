import React from 'react'
import { interpolate, spring, useCurrentFrame, useVideoConfig } from '../../core'

export interface FadeInProps {
  delay?: number
  children: React.ReactNode
  direction?: 'up' | 'left' | 'right'
  style?: React.CSSProperties
}

export const FadeIn: React.FC<FadeInProps> = ({ delay = 0, children, direction = 'up', style }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 80 } })

  const translateMap = {
    up: `translateY(${interpolate(s, [0, 1], [40, 0])}px)`,
    left: `translateX(${interpolate(s, [0, 1], [-60, 0])}px)`,
    right: `translateX(${interpolate(s, [0, 1], [60, 0])}px)`,
  }

  return (
    <div style={{ opacity: s, transform: translateMap[direction], ...style }}>
      {children}
    </div>
  )
}
