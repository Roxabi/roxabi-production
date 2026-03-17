import React from 'react'
import { useCurrentFrame, interpolate, Easing } from '../../core'
import { COLORS, ACCENT, type AccentColor } from '../../themes'

export interface ProgressBarProps {
  delay?: number
  duration?: number
  accent?: AccentColor
  label?: string
  width?: number
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  delay = 0,
  duration = 30,
  accent = 'amber',
  label,
  width = 400,
}) => {
  const frame = useCurrentFrame()
  const progress = interpolate(Math.max(0, frame - delay), [0, duration], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width }}>
      {label && (
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 11,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: COLORS.textMuted,
          }}
        >
          {label}
        </span>
      )}
      <div
        style={{
          height: 6,
          borderRadius: 3,
          background: 'rgba(255,255,255,0.06)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress * 100}%`,
            borderRadius: 3,
            background: `linear-gradient(90deg, ${ACCENT[accent].color}, ${ACCENT[accent].color}cc)`,
            boxShadow: `0 0 20px ${ACCENT[accent].color}66`,
          }}
        />
      </div>
    </div>
  )
}
