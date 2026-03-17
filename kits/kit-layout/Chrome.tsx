import React from 'react'
import { COLORS, ACCENT, type AccentColor } from '../../themes'

export interface ChromeProps {
  phase: string
  day: string
  accent: AccentColor
}

export const Chrome: React.FC<ChromeProps> = ({ phase, day, accent }) => (
  <div
    style={{
      position: 'absolute',
      top: 48,
      left: 56,
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      zIndex: 3,
    }}
  >
    <span
      style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 12,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: ACCENT[accent].color,
        opacity: 0.6,
      }}
    >
      {phase}
    </span>
    <span
      style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 12,
        color: COLORS.textMuted,
      }}
    >
      {day}
    </span>
  </div>
)
