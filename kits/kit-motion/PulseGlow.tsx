import React from 'react'
import { useCurrentFrame } from '../../core'
import { ACCENT, type AccentColor } from '../../themes'

export const PulseGlow: React.FC<{
  accent: AccentColor
  children: React.ReactNode
  speed?: number
}> = ({ accent, children, speed = 40 }) => {
  const frame = useCurrentFrame()
  const pulse = 0.6 + Math.sin(frame / speed) * 0.4

  return (
    <div
      style={{
        filter: `drop-shadow(0 0 ${20 * pulse}px ${ACCENT[accent].color}66)`,
      }}
    >
      {children}
    </div>
  )
}
