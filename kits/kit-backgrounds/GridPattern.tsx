import React from 'react'
import { AbsoluteFill, useCurrentFrame } from '../../core'

export interface GridPatternProps {
  cellSize?: number
  color?: string
  lineWidth?: number
  /** Animate with a slow pan */
  animate?: boolean
  /** "dots" renders dots at intersections instead of lines */
  variant?: 'lines' | 'dots'
}

export const GridPattern: React.FC<GridPatternProps> = ({
  cellSize = 40,
  color = 'rgba(255,255,255,0.08)',
  lineWidth = 1,
  animate = true,
  variant = 'lines',
}) => {
  const frame = useCurrentFrame()
  const offset = animate ? (frame * 0.3) % cellSize : 0

  if (variant === 'dots') {
    return (
      <AbsoluteFill>
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id="dotgrid"
              width={cellSize}
              height={cellSize}
              patternUnits="userSpaceOnUse"
              patternTransform={`translate(${offset},${offset})`}
            >
              <circle cx={cellSize / 2} cy={cellSize / 2} r={lineWidth + 1} fill={color} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotgrid)" />
        </svg>
      </AbsoluteFill>
    )
  }

  return (
    <AbsoluteFill>
      <svg width="100%" height="100%">
        <defs>
          <pattern
            id="linegrid"
            width={cellSize}
            height={cellSize}
            patternUnits="userSpaceOnUse"
            patternTransform={`translate(${offset},${offset})`}
          >
            <path
              d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`}
              fill="none"
              stroke={color}
              strokeWidth={lineWidth}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#linegrid)" />
      </svg>
    </AbsoluteFill>
  )
}
