import React from 'react'
import { useCurrentFrame } from '../../core'
import { cInterpolate } from '../../lib'

const FORGE_ORANGE = '#e85d04'
const FORGE_GRAY = '#6b7280'
const FORGE_BORDER = '#2a2a35'
const FORGE_BG_TERMINAL = '#0d0d14'

const DOT_COLORS = {
  ok: '#22c55e',
  info: '#3b82f6',
  warn: FORGE_ORANGE,
  dim: '#374151',
} as const

export interface TerminalLine {
  text: string
  type?: keyof typeof DOT_COLORS
  delay: number
}

export interface ForgeTerminalProps {
  command?: string
  prompt?: string
  lines?: TerminalLine[]
  fontSize?: number
  width?: number | string
}

export const ForgeTerminal: React.FC<ForgeTerminalProps> = ({
  command = 'lyra start',
  prompt = '$',
  lines = [],
  fontSize = 16,
  width = '100%',
}) => {
  const frame = useCurrentFrame()
  const cmdChars = Math.min(command.length, Math.floor(frame * 3))
  const cmdDone = cmdChars >= command.length
  const cursorVisible = Math.floor(frame / 8) % 2 === 0

  return (
    <div
      style={{
        width,
        background: FORGE_BG_TERMINAL,
        border: `1px solid ${FORGE_BORDER}`,
        borderRadius: 10,
        padding: '18px 22px',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize,
        lineHeight: 1.8,
        boxShadow: `0 0 40px rgba(232,93,4,0.08), 0 20px 60px rgba(0,0,0,0.5)`,
      }}
    >
      {/* Title bar dots */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        {(['#ff5f56', '#ffbd2e', '#27c93f'] as const).map((c, i) => (
          <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
        ))}
      </div>

      {/* Command line */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
        <span style={{ color: FORGE_ORANGE }}>{prompt}</span>
        <span style={{ color: '#e2e8f0' }}>{command.slice(0, cmdChars)}</span>
        {!cmdDone && (
          <span style={{ opacity: cursorVisible ? 1 : 0, color: FORGE_ORANGE }}>▋</span>
        )}
      </div>

      {/* Status lines */}
      {lines.map((line, i) => {
        const opacity = cInterpolate(frame, [line.delay, line.delay + 10], [0, 1])
        if (opacity <= 0) return null
        const dotColor = DOT_COLORS[line.type ?? 'dim']
        return (
          <div
            key={i}
            style={{
              opacity,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              paddingLeft: 16,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: dotColor,
                boxShadow: `0 0 6px ${dotColor}88`,
                flexShrink: 0,
              }}
            />
            <span style={{ color: '#94a3b8', fontSize: fontSize - 1 }}>{line.text}</span>
          </div>
        )
      })}

      {/* Trailing cursor after all lines appear */}
      {cmdDone && lines.length > 0 && (
        <div style={{ paddingLeft: 16, opacity: cursorVisible ? 0.4 : 0 }}>
          <span style={{ color: FORGE_ORANGE }}>▋</span>
        </div>
      )}
    </div>
  )
}
