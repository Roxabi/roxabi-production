import React from 'react'
import { useCurrentFrame, useVideoConfig } from '../../core'
import { sprng, cInterpolate } from '../../lib'

export interface BarItem {
  label: string
  value: number
  color?: string
}

export interface AnimatedBarProps {
  data: BarItem[]
  /** Max bar width in pixels */
  maxWidth?: number
  barHeight?: number
  gap?: number
  delayPerBar?: number
  showValues?: boolean
  style?: React.CSSProperties
}

export const AnimatedBar: React.FC<AnimatedBarProps> = ({
  data,
  maxWidth = 800,
  barHeight = 40,
  gap = 12,
  delayPerBar = 6,
  showValues = true,
  style,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const maxValue = Math.max(...data.map((d) => d.value))
  const defaultColors = ['#3a86ff', '#ff006e', '#ffbe0b', '#06d6a0', '#8338ec']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap, ...style }}>
      {data.map((item, i) => {
        const progress = sprng(frame, fps, { damping: 15 }, i * delayPerBar)
        const width = (item.value / maxValue) * maxWidth * progress
        const color = item.color || defaultColors[i % defaultColors.length]

        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span
              style={{
                width: 120,
                textAlign: 'right',
                color: 'white',
                fontSize: 18,
                fontWeight: 600,
                opacity: progress,
              }}
            >
              {item.label}
            </span>
            <div
              style={{
                height: barHeight,
                width,
                backgroundColor: color,
                borderRadius: barHeight / 4,
                position: 'relative',
              }}
            >
              {showValues && progress > 0.5 && (
                <span
                  style={{
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'white',
                    fontSize: 16,
                    fontWeight: 700,
                    opacity: cInterpolate(progress, [0.5, 0.8], [0, 1]),
                  }}
                >
                  {item.value}
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
