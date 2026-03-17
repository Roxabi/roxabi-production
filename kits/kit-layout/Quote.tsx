import React from 'react'
import { COLORS, ACCENT, type AccentColor } from '../../themes'

export interface QuoteProps {
  accent: AccentColor
  children: React.ReactNode
  size?: number
}

export const Quote: React.FC<QuoteProps> = ({ accent, children, size = 26 }) => (
  <div
    style={{
      fontFamily: 'Cormorant, serif',
      fontStyle: 'italic',
      fontSize: size,
      lineHeight: 1.5,
      color: COLORS.text,
      maxWidth: 700,
      paddingLeft: 20,
      borderLeft: `3px solid ${ACCENT[accent].color}`,
    }}
  >
    {children}
  </div>
)
