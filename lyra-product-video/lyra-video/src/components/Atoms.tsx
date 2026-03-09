import React from 'react'
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import { COLORS, ACCENT, type AccentColor } from '../theme'

/* === Animated text that fades + slides in === */
export const FadeIn: React.FC<{
  delay?: number
  children: React.ReactNode
  direction?: 'up' | 'left' | 'right'
  style?: React.CSSProperties
}> = ({ delay = 0, children, direction = 'up', style }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 80 } })

  const translateMap = {
    up: `translateY(${interpolate(s, [0, 1], [40, 0])}px)`,
    left: `translateX(${interpolate(s, [0, 1], [-60, 0])}px)`,
    right: `translateX(${interpolate(s, [0, 1], [60, 0])}px)`,
  }

  return (
    <div style={{ opacity: s, transform: translateMap[direction], ...style }}>
      {children}
    </div>
  )
}

/* === Animated counter that counts up === */
export const Counter: React.FC<{
  value: number
  delay?: number
  color?: string
  size?: number
}> = ({ value, delay = 0, color = COLORS.amber, size = 90 }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = spring({ frame: frame - delay, fps, config: { damping: 30, stiffness: 60 } })
  const current = Math.round(value * s)

  return (
    <span
      style={{
        fontFamily: 'Cormorant, serif',
        fontWeight: 700,
        fontSize: size,
        color,
        lineHeight: 1,
      }}
    >
      {current}
    </span>
  )
}

/* === Glowing background orb === */
export const Glow: React.FC<{
  accent: AccentColor
  x?: string
  y?: string
  size?: string
  drift?: number
}> = ({ accent, x = '50%', y = '50%', size = '50vw', drift = 20 }) => {
  const frame = useCurrentFrame()
  const wobble = Math.sin(frame / 90) * drift

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: '50%',
        background: ACCENT[accent].glow,
        filter: 'blur(120px)',
        transform: `translate(-50%, -50%) translateY(${wobble}px)`,
        pointerEvents: 'none',
      }}
    />
  )
}

/* === Badge === */
export const Badge: React.FC<{
  accent: AccentColor
  children: React.ReactNode
}> = ({ accent, children }) => (
  <span
    style={{
      display: 'inline-block',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 13,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: ACCENT[accent].color,
      border: `1px solid ${ACCENT[accent].border}`,
      background: ACCENT[accent].glow,
      padding: '4px 14px',
      borderRadius: 3,
    }}
  >
    {children}
  </span>
)

/* === Quote with left bar === */
export const Quote: React.FC<{
  accent: AccentColor
  children: React.ReactNode
  size?: number
}> = ({ accent, children, size = 26 }) => (
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

/* === Section chrome (phase label + day) === */
export const Chrome: React.FC<{
  phase: string
  day: string
  accent: AccentColor
}> = ({ phase, day, accent }) => (
  <div
    style={{
      position: 'absolute',
      top: 48,
      left: 56,
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      zIndex: 3,
    }}
  >
    <span
      style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 12,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: ACCENT[accent].color,
        opacity: 0.6,
      }}
    >
      {phase}
    </span>
    <span
      style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 12,
        color: COLORS.textMuted,
      }}
    >
      {day}
    </span>
  </div>
)

/* === Terminal box === */
export const TerminalBox: React.FC<{
  accent: AccentColor
  children: React.ReactNode
}> = ({ accent, children }) => (
  <div
    style={{
      border: `1px solid ${ACCENT[accent].border}`,
      borderRadius: 6,
      padding: '20px 24px',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 15,
      lineHeight: 1.9,
      background: ACCENT[accent].glow,
      maxWidth: 550,
    }}
  >
    {children}
  </div>
)

/* === Slide wrapper with background + padding === */
export const SlideBase: React.FC<{
  bg?: string
  children: React.ReactNode
}> = ({ bg = COLORS.bg, children }) => (
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

/* === Body text === */
export const Body: React.FC<{ children: React.ReactNode; max?: number }> = ({
  children,
  max = 620,
}) => (
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

/* === Title === */
export const Title: React.FC<{
  color?: string
  children: React.ReactNode
  size?: number
}> = ({ color = COLORS.text, children, size = 64 }) => (
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
