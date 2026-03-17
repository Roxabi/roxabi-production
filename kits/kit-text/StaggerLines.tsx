import React from 'react'
import { useCurrentFrame } from '../../core'
import { COLORS } from '../../themes'

export const StaggerLines: React.FC<{
  lines: Array<{ text: string; color?: string; prefix?: string }>
  delay?: number
  lineGap?: number
  typeSpeed?: number
}> = ({ lines, delay = 0, lineGap = 18, typeSpeed = 2 }) => {
  const frame = useCurrentFrame()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {lines.map((line, i) => {
        const lineStart = delay + i * lineGap
        const elapsed = Math.max(0, frame - lineStart)
        if (elapsed <= 0) return null

        const chars = Math.min(line.text.length, Math.floor(elapsed * typeSpeed))
        const showCursor = chars < line.text.length
        const cursorBlink = Math.floor(frame / 8) % 2 === 0

        return (
          <div
            key={i}
            style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 15, lineHeight: 1.8 }}
          >
            {line.prefix && (
              <span style={{ color: COLORS.textMuted }}>{line.prefix} </span>
            )}
            <span style={{ color: line.color || COLORS.text }}>
              {line.text.slice(0, chars)}
            </span>
            {showCursor && (
              <span style={{ opacity: cursorBlink ? 1 : 0, color: COLORS.amber }}>_</span>
            )}
          </div>
        )
      })}
    </div>
  )
}
