import React from 'react'
import { useCurrentFrame, useVideoConfig } from '../../core'
import { sprng } from '../../lib'

export interface ProgressRingProps {
  /** 0-100 */
  value: number
  size?: number
  strokeWidth?: number
  color?: string
  trackColor?: string
  label?: string
  style?: React.CSSProperties
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  size = 200,
  strokeWidth = 12,
  color = '#3a86ff',
  trackColor = 'rgba(255,255,255,0.1)',
  label,
  style,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const progress = sprng(frame, fps, { damping: 18, stiffness: 60 })
  const animatedValue = progress * value

  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - animatedValue / 100)

  return (
    <div
      style={{
        width: size,
        height: size,
        position: 'relative',
        ...style,
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: progress,
        }}
      >
        <span style={{ fontSize: size * 0.22, fontWeight: 800, color: 'white' }}>
          {Math.round(animatedValue)}%
        </span>
        {label && (
          <span style={{ fontSize: size * 0.09, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
            {label}
          </span>
        )}
      </div>
    </div>
  )
}
