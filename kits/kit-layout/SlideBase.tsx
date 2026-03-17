import React from 'react'
import { COLORS } from '../../themes'

export interface SlideBaseProps {
  bg?: string
  children: React.ReactNode
}

export const SlideBase: React.FC<SlideBaseProps> = ({ bg = COLORS.bg, children }) => (
  <div
    style={{
      width: 1920,
      height: 1080,
      background: bg,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '60px 80px',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'IBM Plex Sans, sans-serif',
      color: COLORS.text,
    }}
  >
    {children}
  </div>
)
