/**
 * LyraLogo — frame-based SVG lyre mark
 *
 * Paths extracted from the official lyra-logo-brief.json.
 * ViewBox: 0 0 400 400 (mark lives in ~x120–280, y60–340)
 *
 * Colors: teal #00c8e0 (top/channels) → amber #f0a030 (hub/bottom)
 */
import React from 'react'
import { useCurrentFrame, useVideoConfig, spring, interpolate } from '../../core'
import { cInterpolate } from '../../lib'

const TEAL = '#00c8e0'
const AMBER = '#f0a030'
const HIGHLIGHT = '#eef4ff'

export interface LyraLogoProps {
  size?: number
  delay?: number
  /** Show surrounding hex frame */
  showFrame?: boolean
  /** Override computed opacity */
  opacity?: number
}

export const LyraLogo: React.FC<LyraLogoProps> = ({
  size = 120,
  delay = 0,
  showFrame = false,
  opacity: opacityProp,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Overall entrance
  const entrance = spring({ frame, fps, delay, config: { damping: 14, stiffness: 80 } })

  // Hub pulse (amber ring)
  const hubPulse = 0.6 + Math.sin(frame * 0.09) * 0.4

  // Arms & crossbar appear together after entrance
  const armsP = spring({ frame, fps, delay: delay + 4, config: { damping: 18, stiffness: 70 } })

  // Strings stagger in
  const stringDelays = [0, 4, 8, 12, 16] // relative to armsP complete
  const stringsP = stringDelays.map((d) =>
    spring({ frame, fps, delay: delay + 18 + d, config: { damping: 18, stiffness: 90 } })
  )

  // Nodes pop in
  const nodesP = spring({ frame, fps, delay: delay + 24, config: { damping: 10, stiffness: 120 } })

  // Hub appears last
  const hubP = spring({ frame, fps, delay: delay + 28, config: { damping: 12, stiffness: 100 } })

  const opacity = opacityProp !== undefined ? opacityProp : entrance
  const scale = interpolate(entrance, [0, 1], [0.85, 1])

  const uid = `lyra-${size}-${delay}`

  return (
    <svg
      width={size}
      height={size}
      viewBox="110 55 180 295"
      style={{
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: 'center',
        overflow: 'visible',
      }}
    >
      <defs>
        {/* Arm gradient: teal at top → amber at hub */}
        <linearGradient id={`armGrad-${uid}`} x1="200" y1="80" x2="200" y2="310" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={TEAL} />
          <stop offset="100%" stopColor={AMBER} />
        </linearGradient>

        {/* String gradient */}
        <linearGradient id={`strGrad-${uid}`} x1="200" y1="145" x2="200" y2="310" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={TEAL} stopOpacity={0.8} />
          <stop offset="100%" stopColor={AMBER} stopOpacity={0.7} />
        </linearGradient>

        {/* Hub glow */}
        <radialGradient id={`hubGlow-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={AMBER} stopOpacity={0.4} />
          <stop offset="100%" stopColor={AMBER} stopOpacity={0} />
        </radialGradient>

        {/* Soft glow filter */}
        <filter id={`glow-${uid}`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Arms ─────────────────────────────────────────────────── */}
      <path
        d="M 200,310 C 180,280 130,220 125,155 C 120,110 140,80 165,80"
        stroke={`url(#armGrad-${uid})`}
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
        opacity={armsP}
        filter={`url(#glow-${uid})`}
      />
      <path
        d="M 200,310 C 220,280 270,220 275,155 C 280,110 260,80 235,80"
        stroke={`url(#armGrad-${uid})`}
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
        opacity={armsP}
        filter={`url(#glow-${uid})`}
      />

      {/* ── Crossbar ─────────────────────────────────────────────── */}
      <line
        x1="165" y1="80" x2="235" y2="80"
        stroke={TEAL}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={armsP}
      />

      {/* ── Yoke (mid horizontal bar) ─────────────────────────────── */}
      <line
        x1="139" y1="145" x2="261" y2="145"
        stroke={TEAL}
        strokeWidth={1.5}
        strokeLinecap="round"
        opacity={armsP * 0.5}
      />

      {/* ── Strings (from yoke → hub, staggered) ──────────────────── */}
      {/* String left */}
      <line
        x1="172" y1="145" x2="192" y2="300"
        stroke={`url(#strGrad-${uid})`}
        strokeWidth={1.2}
        strokeLinecap="round"
        opacity={stringsP[0] * 0.7}
      />
      {/* String center-left */}
      <line
        x1="186" y1="145" x2="196" y2="300"
        stroke={`url(#strGrad-${uid})`}
        strokeWidth={1.2}
        strokeLinecap="round"
        opacity={stringsP[1] * 0.7}
      />
      {/* String center */}
      <line
        x1="200" y1="145" x2="200" y2="300"
        stroke={`url(#strGrad-${uid})`}
        strokeWidth={1.5}
        strokeLinecap="round"
        opacity={stringsP[2] * 0.9}
      />
      {/* String center-right */}
      <line
        x1="214" y1="145" x2="204" y2="300"
        stroke={`url(#strGrad-${uid})`}
        strokeWidth={1.2}
        strokeLinecap="round"
        opacity={stringsP[3] * 0.7}
      />
      {/* String right */}
      <line
        x1="228" y1="145" x2="208" y2="300"
        stroke={`url(#strGrad-${uid})`}
        strokeWidth={1.2}
        strokeLinecap="round"
        opacity={stringsP[4] * 0.7}
      />

      {/* ── Nodes ─────────────────────────────────────────────────── */}
      {/* Horn left */}
      <circle cx="165" cy="80" r={interpolate(nodesP, [0, 1], [0, 4])} fill={TEAL} />
      {/* Horn right */}
      <circle cx="235" cy="80" r={interpolate(nodesP, [0, 1], [0, 4])} fill={TEAL} />
      {/* Yoke left */}
      <circle cx="130" cy="145" r={interpolate(nodesP, [0, 1], [0, 3.5])} fill={`url(#strGrad-${uid})`} />
      {/* Yoke right */}
      <circle cx="270" cy="145" r={interpolate(nodesP, [0, 1], [0, 3.5])} fill={`url(#strGrad-${uid})`} />
      {/* Lower left */}
      <circle cx="148" cy="215" r={interpolate(nodesP, [0, 1], [0, 3])} fill={AMBER} opacity={0.85} />
      {/* Lower right */}
      <circle cx="252" cy="215" r={interpolate(nodesP, [0, 1], [0, 3])} fill={AMBER} opacity={0.85} />

      {/* ── Hub ───────────────────────────────────────────────────── */}
      {/* Glow disc */}
      <circle
        cx="200" cy="310"
        r={interpolate(hubP, [0, 1], [0, 28 * hubPulse])}
        fill={`url(#hubGlow-${uid})`}
      />
      {/* Main disc */}
      <circle
        cx="200" cy="310"
        r={interpolate(hubP, [0, 1], [0, 7])}
        fill={AMBER}
        filter={`url(#glow-${uid})`}
      />
      {/* Center highlight */}
      <circle
        cx="200" cy="310"
        r={interpolate(hubP, [0, 1], [0, 2.5])}
        fill={HIGHLIGHT}
      />

      {/* ── Shockwave rings (one-time on hub reveal) ─────────────── */}
      {hubP > 0.5 && (
        <>
          <circle
            cx="200" cy="310"
            r={interpolate(hubP, [0.5, 1], [7, 45])}
            fill="none"
            stroke={AMBER}
            strokeWidth={1.2}
            opacity={interpolate(hubP, [0.5, 1], [0.6, 0])}
          />
          <circle
            cx="200" cy="310"
            r={interpolate(hubP, [0.6, 1], [7, 63])}
            fill="none"
            stroke={TEAL}
            strokeWidth={0.8}
            opacity={interpolate(hubP, [0.6, 1], [0.4, 0])}
          />
        </>
      )}
    </svg>
  )
}
