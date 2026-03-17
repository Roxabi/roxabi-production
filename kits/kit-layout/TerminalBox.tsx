import React from 'react'
import { ACCENT, type AccentColor } from '../../themes'

export interface TerminalBoxProps {
  accent: AccentColor
  children: React.ReactNode
}

export const TerminalBox: React.FC<TerminalBoxProps> = ({ accent, children }) => (
  <div
    style={{
      border: `1px solid ${ACCENT[accent].border}`,
      borderRadius: 6,
      padding: '20px 24px',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 15,
      lineHeight: 1.9,
      background: ACCENT[accent].glow,
      maxWidth: 550,
    }}
  >
    {children}
  </div>
)
