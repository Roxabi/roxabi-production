import React from 'react'
import { useCurrentFrame } from '../../core'
import { COLORS } from '../../themes'

export const Typewriter: React.FC<{
  text: string
  delay?: number
  speed?: number
  cursor?: boolean
  cursorChar?: string
  cursorColor?: string
  style?: React.CSSProperties
}> = ({ text, delay = 0, speed = 1.5, cursor = true, cursorChar = '|', cursorColor, style }) => {
  const frame = useCurrentFrame()
  const elapsed = Math.max(0, frame - delay)
  const chars = Math.min(text.length, Math.floor(elapsed * speed))
  const showCursor = cursor && chars < text.length && elapsed > 0
  const cursorBlink = Math.floor(frame / 8) % 2 === 0

  return (
    <span style={{ fontFamily: 'JetBrains Mono, monospace', ...style }}>
      {text.slice(0, chars)}
      {showCursor && (
        <span style={{ opacity: cursorBlink ? 1 : 0, color: cursorColor ?? COLORS.amber }}>
          {cursorChar}
        </span>
      )}
    </span>
  )
}
