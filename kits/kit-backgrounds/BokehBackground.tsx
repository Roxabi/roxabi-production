import React, { useMemo } from 'react'
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from '../../core'

export interface BokehBackgroundProps {
  count?: number
  /** Array of colors for the orbs */
  colors?: string[]
  /** Min size in px */
  minSize?: number
  /** Max size in px */
  maxSize?: number
  speed?: number
  background?: string
}

interface Orb {
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  phase: number
  colorIndex: number
  driftPhase: number
}

export const BokehBackground: React.FC<BokehBackgroundProps> = ({
  count = 12,
  colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#ffffff'],
  minSize = 80,
  maxSize = 200,
  speed = 1,
  background = '#000000',
}) => {
  const frame = useCurrentFrame()
  const { width, height } = useVideoConfig()

  const orbs = useMemo<Orb[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: random(`bx-${i}`) * width,
        y: random(`by-${i}`) * height,
        size: minSize + random(`bs-${i}`) * (maxSize - minSize),
        speed: 0.2 + random(`bv-${i}`) * speed * 0.6,
        opacity: 0.06 + random(`bo-${i}`) * 0.14,
        phase: random(`bp-${i}`) * Math.PI * 2,
        colorIndex: Math.floor(random(`bc-${i}`) * colors.length),
        driftPhase: random(`bd-${i}`) * Math.PI * 2,
      })),
    [count, width, height, minSize, maxSize, speed, colors.length],
  )

  return (
    <AbsoluteFill style={{ background, overflow: 'hidden' }}>
      {orbs.map((orb, i) => {
        const blurRadius = orb.size / 3

        // Slow sine-wave drift on both axes
        const driftX = Math.sin(frame * 0.008 * orb.speed + orb.phase) * 40
        const driftY = Math.cos(frame * 0.006 * orb.speed + orb.driftPhase) * 30

        const x = orb.x + driftX
        const y = orb.y + driftY

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x - orb.size / 2,
              top: y - orb.size / 2,
              width: orb.size,
              height: orb.size,
              borderRadius: '50%',
              backgroundColor: colors[orb.colorIndex],
              opacity: orb.opacity,
              filter: `blur(${blurRadius}px)`,
            }}
          />
        )
      })}
    </AbsoluteFill>
  )
}
