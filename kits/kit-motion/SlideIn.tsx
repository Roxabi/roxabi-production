import React from 'react'
import { interpolate, spring, useCurrentFrame, useVideoConfig } from '../../core'

export const SlideIn: React.FC<{
  delay?: number
  from?: 'left' | 'right' | 'bottom' | 'top'
  distance?: number
  children: React.ReactNode
  style?: React.CSSProperties
}> = ({ delay = 0, from = 'left', distance = 200, children, style }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = spring({
    frame: frame - delay,
    fps,
    config: { damping: 16, stiffness: 70 },
  })

  const transforms: Record<string, string> = {
    left: `translateX(${interpolate(s, [0, 1], [-distance, 0])}px)`,
    right: `translateX(${interpolate(s, [0, 1], [distance, 0])}px)`,
    top: `translateY(${interpolate(s, [0, 1], [-distance, 0])}px)`,
    bottom: `translateY(${interpolate(s, [0, 1], [distance, 0])}px)`,
  }

  return (
    <div style={{ opacity: s, transform: transforms[from], ...style }}>
      {children}
    </div>
  )
}
