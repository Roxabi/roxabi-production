import React from 'react'
import { useCurrentFrame, useVideoConfig } from '../../core'
import { sprng } from '../../lib'

export interface AnimatedLineProps {
  /** Array of Y values (0-1 normalized) */
  data: number[]
  width?: number
  height?: number
  color?: string
  strokeWidth?: number
  showDots?: boolean
  fillGradient?: boolean
  style?: React.CSSProperties
}

export const AnimatedLine: React.FC<AnimatedLineProps> = ({
  data,
  width = 800,
  height = 300,
  color = '#3a86ff',
  strokeWidth = 3,
  showDots = true,
  fillGradient = true,
  style,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const progress = sprng(frame, fps, { damping: 20, stiffness: 50 })

  const padding = 20
  const w = width - padding * 2
  const h = height - padding * 2
  const visiblePoints = Math.ceil(data.length * progress)

  const points = data.slice(0, visiblePoints).map((v, i) => ({
    x: padding + (i / (data.length - 1)) * w,
    y: padding + (1 - v) * h,
  }))

  if (points.length < 2) return null

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ')

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`

  return (
    <svg width={width} height={height} style={style}>
      <defs>
        <linearGradient id="line-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      {fillGradient && <path d={areaD} fill="url(#line-fill)" />}
      <path d={pathD} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      {showDots &&
        points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={4} fill={color} stroke="white" strokeWidth={2} />
        ))}
    </svg>
  )
}
