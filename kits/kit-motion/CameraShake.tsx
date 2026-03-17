import React from 'react'
import { useCurrentFrame } from '../../core'

export const CameraShake: React.FC<{
  intensity?: number
  children: React.ReactNode
}> = ({ intensity = 2, children }) => {
  const frame = useCurrentFrame()
  const x = Math.sin(frame / 23) * intensity
  const y = Math.cos(frame / 31) * intensity * 0.7
  const r = Math.sin(frame / 47) * intensity * 0.1

  return (
    <div style={{ transform: `translate(${x}px, ${y}px) rotate(${r}deg)` }}>
      {children}
    </div>
  )
}
