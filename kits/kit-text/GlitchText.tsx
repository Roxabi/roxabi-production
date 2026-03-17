import React, { useMemo } from 'react'
import { random, useCurrentFrame } from '../../core'
import { cInterpolate } from '../../lib'

export interface GlitchTextProps {
  text: string
  /** How intense the glitch is (0-1) */
  intensity?: number
  /** Frame when glitch starts settling */
  settleAt?: number
  color?: string
  style?: React.CSSProperties
}

const GLITCH_CHARS = "!@#$%^&*()_+-=[]{}|;:',.<>?/~`0123456789"

export const GlitchText: React.FC<GlitchTextProps> = ({
  text,
  intensity = 0.8,
  settleAt = 30,
  color = '#00ff41',
  style,
}) => {
  const frame = useCurrentFrame()

  const displayText = useMemo(() => {
    const settled = cInterpolate(frame, [0, settleAt], [0, 1])
    return text
      .split('')
      .map((char, i) => {
        if (char === ' ') return ' '
        const charProgress = cInterpolate(
          settled,
          [i / text.length, Math.min((i + 3) / text.length, 1)],
          [0, 1],
        )
        if (charProgress >= 1) return char
        if (random(`glitch-${frame}-${i}`) < intensity * (1 - charProgress)) {
          const idx = Math.floor(random(`char-${frame}-${i}`) * GLITCH_CHARS.length)
          return GLITCH_CHARS[idx]
        }
        return char
      })
      .join('')
  }, [frame, text, intensity, settleAt])

  const offsetX = frame < settleAt ? (random(`ox-${frame}`) - 0.5) * 4 * intensity : 0
  const offsetY = frame < settleAt ? (random(`oy-${frame}`) - 0.5) * 2 * intensity : 0

  return (
    <div
      style={{
        fontFamily: 'monospace',
        fontSize: 56,
        fontWeight: 700,
        color,
        textShadow: `${offsetX}px ${offsetY}px 0 ${color}80, ${-offsetX}px ${-offsetY}px 0 #ff006e80`,
        whiteSpace: 'pre',
        ...style,
      }}
    >
      {displayText}
    </div>
  )
}
