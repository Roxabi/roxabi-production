import React from 'react'
import { ACCENT, type AccentColor } from '../../themes'

export interface AccentBadgeProps {
  accent: AccentColor
  children: React.ReactNode
}

export const AccentBadge: React.FC<AccentBadgeProps> = ({ accent, children }) => (
  <span
    style={{
      display: 'inline-block',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 13,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: ACCENT[accent].color,
      border: `1px solid ${ACCENT[accent].border}`,
      background: ACCENT[accent].glow,
      padding: '4px 14px',
      borderRadius: 3,
    }}
  >
    {children}
  </span>
)
