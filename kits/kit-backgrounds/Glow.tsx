import React from 'react'
import { useCurrentFrame } from '../../core'
import { ACCENT, type AccentColor } from '../../themes'

export interface GlowProps {
  accent: AccentColor
  x?: string
  y?: string
  size?: string
  drift?: number
}

export const Glow: React.FC<GlowProps> = ({
  accent,
  x = '50%',
  y = '50%',
  size = '50vw',
  drift = 20,
}) => {
  const frame = useCurrentFrame()
  const wobble = Math.sin(frame / 90) * drift

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: '50%',
        background: ACCENT[accent].glow,
        filter: 'blur(120px)',
        transform: `translate(-50%, -50%) translateY(${wobble}px)`,
        pointerEvents: 'none',
      }}
    />
  )
}
