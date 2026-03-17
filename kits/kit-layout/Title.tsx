import React from 'react'
import { COLORS } from '../../themes'

export interface TitleProps {
  color?: string
  children: React.ReactNode
  size?: number
}

export const Title: React.FC<TitleProps> = ({ color = COLORS.text, children, size = 64 }) => (
  <h2
    style={{
      fontFamily: 'Cormorant, serif',
      fontWeight: 600,
      fontSize: size,
      lineHeight: 1.1,
      color,
    }}
  >
    {children}
  </h2>
)
