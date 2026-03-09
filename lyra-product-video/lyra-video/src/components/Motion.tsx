import React from 'react'
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from 'remotion'
import { COLORS, ACCENT, type AccentColor } from '../theme'

/* ── Typewriter: reveals text character by character ── */
export const Typewriter: React.FC<{
  text: string
  delay?: number
  speed?: number
  cursor?: boolean
  style?: React.CSSProperties
}> = ({ text, delay = 0, speed = 1.5, cursor = true, style }) => {
  const frame = useCurrentFrame()
  const elapsed = Math.max(0, frame - delay)
  const chars = Math.min(text.length, Math.floor(elapsed * speed))
  const showCursor = cursor && chars < text.length && elapsed > 0
  const cursorBlink = Math.floor(frame / 8) % 2 === 0

  return (
    <span style={{ fontFamily: 'JetBrains Mono, monospace', ...style }}>
      {text.slice(0, chars)}
      {showCursor && (
        <span style={{ opacity: cursorBlink ? 1 : 0, color: COLORS.amber }}>|</span>
      )}
    </span>
  )
}

/* ── StaggerLines: terminal lines appearing one by one with typing ── */
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
          <div key={i} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 15, lineHeight: 1.8 }}>
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

/* ── ScalePop: element that pops in with overshoot ── */
export const ScalePop: React.FC<{
  delay?: number
  children: React.ReactNode
  style?: React.CSSProperties
}> = ({ delay = 0, children, style }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = spring({
    frame: frame - delay,
    fps,
    config: { damping: 8, stiffness: 120, mass: 0.6 },
  })

  return (
    <div
      style={{
        transform: `scale(${interpolate(s, [0, 1], [0.3, 1])})`,
        opacity: Math.min(1, s * 2),
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/* ── WordByWord: reveals words one at a time with spring ── */
export const WordByWord: React.FC<{
  text: string
  delay?: number
  wordGap?: number
  highlight?: string[]
  highlightColor?: string
  style?: React.CSSProperties
}> = ({ text, delay = 0, wordGap = 4, highlight = [], highlightColor = COLORS.amber, style }) => {
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

/* ── AnimatedCounter: counts up with easing ── */
export const AnimatedCounter: React.FC<{
  value: number
  delay?: number
  duration?: number
  suffix?: string
  prefix?: string
  color?: string
  size?: number
}> = ({ value, delay = 0, duration = 40, suffix = '', prefix = '', color = COLORS.amber, size = 72 }) => {
  const frame = useCurrentFrame()
  const elapsed = Math.max(0, frame - delay)
  const progress = interpolate(elapsed, [0, duration], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })
  const current = Math.round(value * progress)

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
      {prefix}{current}{suffix}
    </span>
  )
}

/* ── ProgressBar: animated fill bar ── */
export const ProgressBar: React.FC<{
  delay?: number
  duration?: number
  accent?: AccentColor
  label?: string
  width?: number
}> = ({ delay = 0, duration = 30, accent = 'amber', label, width = 400 }) => {
  const frame = useCurrentFrame()
  const progress = interpolate(Math.max(0, frame - delay), [0, duration], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width }}>
      {label && (
        <span style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 11,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: COLORS.textMuted,
        }}>
          {label}
        </span>
      )}
      <div style={{
        height: 6,
        borderRadius: 3,
        background: 'rgba(255,255,255,0.06)',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${progress * 100}%`,
          borderRadius: 3,
          background: `linear-gradient(90deg, ${ACCENT[accent].color}, ${ACCENT[accent].color}cc)`,
          boxShadow: `0 0 20px ${ACCENT[accent].color}66`,
        }} />
      </div>
    </div>
  )
}

/* ── ParticleField: floating dots in background ── */
export const ParticleField: React.FC<{
  count?: number
  accent?: AccentColor
  speed?: number
}> = ({ count = 30, accent = 'amber', speed = 1 }) => {
  const frame = useCurrentFrame()
  const particles = React.useMemo(() => {
    const rng = (seed: number) => {
      let x = Math.sin(seed * 127.1) * 43758.5453
      return x - Math.floor(x)
    }
    return Array.from({ length: count }, (_, i) => ({
      x: rng(i * 3 + 1) * 100,
      y: rng(i * 3 + 2) * 100,
      size: 1 + rng(i * 3 + 3) * 3,
      phase: rng(i * 7) * Math.PI * 2,
      speedMul: 0.5 + rng(i * 11) * 1,
    }))
  }, [count])

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1, overflow: 'hidden' }}>
      {particles.map((p, i) => {
        const drift = Math.sin((frame * speed * p.speedMul) / 60 + p.phase) * 15
        const driftY = Math.cos((frame * speed * p.speedMul) / 80 + p.phase) * 10
        const pulse = 0.3 + Math.sin(frame / 30 + p.phase) * 0.3

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              background: ACCENT[accent].color,
              opacity: pulse,
              transform: `translate(${drift}px, ${driftY}px)`,
            }}
          />
        )
      })}
    </div>
  )
}

/* ── CameraShake: subtle motion on wrapper ── */
export const CameraShake: React.FC<{
  intensity?: number
  children: React.ReactNode
}> = ({ intensity = 2, children }) => {
  const frame = useCurrentFrame()
  const x = Math.sin(frame / 23) * intensity
  const y = Math.cos(frame / 31) * intensity * 0.7
  const r = Math.sin(frame / 47) * intensity * 0.1

  return (
    <div style={{ transform: `translate(${x}px, ${y}px) rotate(${r}deg)` }}>
      {children}
    </div>
  )
}

/* ── PulseGlow: element that pulses its glow ── */
export const PulseGlow: React.FC<{
  accent: AccentColor
  children: React.ReactNode
  speed?: number
}> = ({ accent, children, speed = 40 }) => {
  const frame = useCurrentFrame()
  const pulse = 0.6 + Math.sin(frame / speed) * 0.4

  return (
    <div style={{
      filter: `drop-shadow(0 0 ${20 * pulse}px ${ACCENT[accent].color}66)`,
    }}>
      {children}
    </div>
  )
}

/* ── SlideIn: element that slides from edge ── */
export const SlideIn: React.FC<{
  delay?: number
  from?: 'left' | 'right' | 'bottom' | 'top'
  distance?: number
  children: React.ReactNode
  style?: React.CSSProperties
}> = ({ delay = 0, from = 'left', distance = 200, children, style }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = spring({
    frame: frame - delay,
    fps,
    config: { damping: 16, stiffness: 70 },
  })

  const transforms: Record<string, string> = {
    left: `translateX(${interpolate(s, [0, 1], [-distance, 0])}px)`,
    right: `translateX(${interpolate(s, [0, 1], [distance, 0])}px)`,
    top: `translateY(${interpolate(s, [0, 1], [-distance, 0])}px)`,
    bottom: `translateY(${interpolate(s, [0, 1], [distance, 0])}px)`,
  }

  return (
    <div style={{ opacity: s, transform: transforms[from], ...style }}>
      {children}
    </div>
  )
}

/* ── FlickerReveal: text that flickers then stabilizes ── */
export const FlickerReveal: React.FC<{
  delay?: number
  duration?: number
  children: React.ReactNode
}> = ({ delay = 0, duration = 15, children }) => {
  const frame = useCurrentFrame()
  const elapsed = frame - delay
  if (elapsed < 0) return null

  const flickerPhase = elapsed < duration
  const opacity = flickerPhase
    ? (Math.sin(elapsed * 8) > 0 ? 0.9 : 0.15)
    : 1

  return <div style={{ opacity }}>{children}</div>
}

/* ── NumberReveal: big number that flies in with blur ── */
export const NumberReveal: React.FC<{
  value: string
  delay?: number
  color?: string
  size?: number
}> = ({ value, delay = 0, color = COLORS.amber, size = 120 }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = spring({
    frame: frame - delay,
    fps,
    config: { damping: 10, stiffness: 100, mass: 0.8 },
  })

  return (
    <span style={{
      fontFamily: 'Cormorant, serif',
      fontWeight: 700,
      fontSize: size,
      color,
      lineHeight: 1,
      display: 'inline-block',
      transform: `scale(${interpolate(s, [0, 1], [2.5, 1])})`,
      opacity: s,
      filter: `blur(${interpolate(s, [0, 1], [12, 0])}px)`,
    }}>
      {value}
    </span>
  )
}
