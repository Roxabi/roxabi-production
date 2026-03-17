import React from 'react'
import { COLORS } from '../../themes'

export interface BodyProps {
  children: React.ReactNode
  max?: number
}

export const Body: React.FC<BodyProps> = ({ children, max = 620 }) => (
  <p
    style={{
      fontSize: 20,
      lineHeight: 1.65,
      color: COLORS.textSecondary,
      maxWidth: max,
    }}
  >
    {children}
  </p>
)
