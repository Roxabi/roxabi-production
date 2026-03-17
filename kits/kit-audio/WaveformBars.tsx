import React from 'react'
import { useCurrentFrame, random } from '../../core'

export interface WaveformBarsProps {
  /** Number of bars */
  bars?: number
  barWidth?: number
  maxHeight?: number
  gap?: number
  color?: string
  /** "audio" uses random per-frame simulation, "sine" is smooth wave */
  mode?: 'audio' | 'sine'
  style?: React.CSSProperties
}

export const WaveformBars: React.FC<WaveformBarsProps> = ({
  bars = 32,
  barWidth = 8,
  maxHeight = 200,
  gap = 4,
  color = '#3a86ff',
  mode = 'sine',
  style,
}) => {
  const frame = useCurrentFrame()

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap,
        ...style,
      }}
    >
      {Array.from({ length: bars }, (_, i) => {
        let height: number
        if (mode === 'audio') {
          // Simulated audio spectrum with deterministic random
          const base = random(`bar-${i}-${Math.floor(frame / 2)}`) * 0.7
          const smoothing = random(`smooth-${i}-${Math.floor(frame / 3)}`) * 0.3
          height = (base + smoothing) * maxHeight
        } else {
          // Sine wave
          const phase = (i / bars) * Math.PI * 2
          const wave = Math.sin(phase + frame * 0.08)
          const secondary = Math.sin(phase * 2 + frame * 0.12) * 0.3
          height = ((wave + secondary + 1.3) / 2.6) * maxHeight
        }

        return (
          <div
            key={i}
            style={{
              width: barWidth,
              height: Math.max(4, height),
              backgroundColor: color,
              borderRadius: barWidth / 2,
              opacity: 0.6 + (height / maxHeight) * 0.4,
            }}
          />
        )
      })}
    </div>
  )
}
