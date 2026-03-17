import React from 'react'
import { useCurrentFrame, useVideoConfig } from '../../core'
import { fadeIn, slideFrom } from '../../lib'

export type FadeTextVariant = 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right'

export interface FadeTextProps {
  text: string
  variant?: FadeTextVariant
  delay?: number
  duration?: number
  style?: React.CSSProperties
}

export const FadeText: React.FC<FadeTextProps> = ({
  text,
  variant = 'fade',
  delay = 0,
  duration = 20,
  style,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const directionMap: Record<string, 'top' | 'bottom' | 'left' | 'right'> = {
    'slide-up': 'bottom',
    'slide-down': 'top',
    'slide-left': 'right',
    'slide-right': 'left',
  }

  const animStyle: React.CSSProperties =
    variant === 'fade'
      ? { opacity: fadeIn(frame, duration, delay) }
      : slideFrom(frame, fps, directionMap[variant], 60, delay)

  return (
    <div
      style={{
        fontSize: 64,
        fontWeight: 700,
        color: 'white',
        ...animStyle,
        ...style,
      }}
    >
      {text}
    </div>
  )
}
