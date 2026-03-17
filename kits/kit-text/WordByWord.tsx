import React from 'react'
import { interpolate, spring, useCurrentFrame, useVideoConfig } from '../../core'
import { COLORS } from '../../themes'

export const WordByWord: React.FC<{
  text: string
  delay?: number
  wordGap?: number
  highlight?: string[]
  highlightColor?: string
  style?: React.CSSProperties
}> = ({
  text,
  delay = 0,
  wordGap = 4,
  highlight = [],
  highlightColor = COLORS.amber,
  style,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const words = text.split(' ')

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 8px', ...style }}>
      {words.map((word, i) => {
        const wordDelay = delay + i * wordGap
        const s = spring({
          frame: frame - wordDelay,
          fps,
          config: { damping: 14, stiffness: 100 },
        })
        const isHighlighted = highlight.some(h => word.toLowerCase().includes(h.toLowerCase()))

        return (
          <span
            key={i}
            style={{
              opacity: s,
              transform: `translateY(${interpolate(s, [0, 1], [20, 0])}px)`,
              color: isHighlighted ? highlightColor : undefined,
              fontWeight: isHighlighted ? 700 : undefined,
            }}
          >
            {word}
          </span>
        )
      })}
    </div>
  )
}
