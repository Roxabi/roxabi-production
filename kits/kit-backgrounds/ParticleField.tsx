import React, { useMemo } from 'react'
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from '../../core'
import { ACCENT, type AccentColor } from '../../themes'

export interface ParticleFieldProps {
  count?: number
  color?: string
  /** If provided, overrides color with the accent's theme color */
  accent?: AccentColor
  maxSize?: number
  speed?: number
  /** "float" drifts upward, "rain" falls down, "drift" moves sideways */
  direction?: 'float' | 'rain' | 'drift'
}

interface Particle {
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  phase: number
}

export const ParticleField: React.FC<ParticleFieldProps> = ({
  count = 60,
  color = '#ffffff',
  accent,
  maxSize = 6,
  speed = 1,
  direction = 'float',
}) => {
  const frame = useCurrentFrame()
  const { width, height } = useVideoConfig()

  const resolvedColor = accent ? ACCENT[accent].color : color

  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: random(`px-${i}`) * width,
        y: random(`py-${i}`) * height,
        size: 1 + random(`ps-${i}`) * maxSize,
        speed: 0.3 + random(`pv-${i}`) * speed * 2,
        opacity: 0.2 + random(`po-${i}`) * 0.6,
        phase: random(`pp-${i}`) * Math.PI * 2,
      })),
    [count, width, height, maxSize, speed],
  )

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {particles.map((p, i) => {
        let x = p.x
        let y = p.y
        const wobble = Math.sin(frame * 0.03 + p.phase) * 20

        if (direction === 'float') {
          y = ((p.y - frame * p.speed + height) % (height + 20)) - 10
          x = p.x + wobble
        } else if (direction === 'rain') {
          y = ((p.y + frame * p.speed * 2) % (height + 20)) - 10
          x = p.x + wobble * 0.3
        } else {
          x = ((p.x + frame * p.speed) % (width + 20)) - 10
          y = p.y + wobble
        }

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              backgroundColor: resolvedColor,
              opacity: p.opacity,
            }}
          />
        )
      })}
    </AbsoluteFill>
  )
}
