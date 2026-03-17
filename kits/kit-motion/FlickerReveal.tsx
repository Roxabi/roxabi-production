import React from 'react'
import { useCurrentFrame } from '../../core'

export const FlickerReveal: React.FC<{
  delay?: number
  duration?: number
  children: React.ReactNode
}> = ({ delay = 0, duration = 15, children }) => {
  const frame = useCurrentFrame()
  const elapsed = frame - delay
  if (elapsed < 0) return null

  const flickerPhase = elapsed < duration
  const opacity = flickerPhase ? (Math.sin(elapsed * 8) > 0 ? 0.9 : 0.15) : 1

  return <div style={{ opacity }}>{children}</div>
}
