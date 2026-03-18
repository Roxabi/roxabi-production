/**
 * LyraLogo — Forge diamond mark
 *
 * Geometry extracted from lyra-logo-forge.html
 * ViewBox: 0 0 240 260
 * Diamond vertices: 120,14  182,82  156,142  120,158  84,142  58,82
 * Hub center: cx=120, cy=95
 *
 * Colors: forge orange #e85d04, ember #f97316, spark #fafafa
 */
import React from 'react'
import { useCurrentFrame, useVideoConfig, spring, interpolate } from '../../core'
import { cInterpolate } from '../../lib'

const FORGE = '#e85d04'
const EMBER = '#f97316'
const SPARK = '#fafafa'

export interface LyraLogoProps {
  size?: number
  delay?: number
  /** Override computed opacity */
  opacity?: number
}

export const LyraLogo: React.FC<LyraLogoProps> = ({
  size = 120,
  delay = 0,
  opacity: opacityProp,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Overall entrance
  const entrance = spring({ frame, fps, delay, config: { damping: 14, stiffness: 80 } })

  // Crystal facets pop in (staggered)
  const baseP = spring({ frame, fps, delay: delay + 2, config: { damping: 18, stiffness: 90 } })
  const facetTopP = spring({ frame, fps, delay: delay + 4, config: { damping: 16, stiffness: 85 } })
  const facetLUP = spring({ frame, fps, delay: delay + 8, config: { damping: 16, stiffness: 85 } })
  const facetRUP = spring({ frame, fps, delay: delay + 11, config: { damping: 16, stiffness: 85 } })
  const facetLLP = spring({ frame, fps, delay: delay + 14, config: { damping: 16, stiffness: 85 } })
  const facetRLP = spring({ frame, fps, delay: delay + 17, config: { damping: 16, stiffness: 85 } })

  // Edges trace in
  const edgesP = spring({ frame, fps, delay: delay + 6, config: { damping: 20, stiffness: 75 } })

  // Hub-and-spoke flash (briefly visible then fades)
  const spokeAppear = spring({ frame, fps, delay: delay + 22, config: { damping: 14, stiffness: 110 } })
  const spokeFade = cInterpolate(frame, [delay + 38, delay + 52], [1, 0])
  const spokeOpacity = spokeAppear * spokeFade

  // Hub core appears and stays
  const hubP = spring({ frame, fps, delay: delay + 24, config: { damping: 12, stiffness: 100 } })

  // Hub idle pulse
  const hubPulse = 0.75 + Math.sin(frame * 0.1) * 0.25

  // Core glow grows
  const coreGlowP = spring({ frame, fps, delay: delay + 20, config: { damping: 18, stiffness: 60 } })

  const opacity = opacityProp !== undefined ? opacityProp : entrance
  const scale = interpolate(entrance, [0, 1], [0.75, 1])

  const uid = `forge-${size}-${delay}`

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 240 210"
      style={{
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: 'center',
        overflow: 'visible',
      }}
    >
      <defs>
        {/* Main diamond fill */}
        <linearGradient id={`diamFill-${uid}`} x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#2a1808" />
          <stop offset="40%" stopColor="#1a0f06" />
          <stop offset="100%" stopColor="#0d0d14" />
        </linearGradient>

        {/* Top face highlight */}
        <linearGradient id={`topFace-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={SPARK} stopOpacity={0.14} />
          <stop offset="100%" stopColor={FORGE} stopOpacity={0.06} />
        </linearGradient>

        {/* Left facet */}
        <linearGradient id={`leftFace-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={FORGE} stopOpacity={0.18} />
          <stop offset="100%" stopColor="#0a0a0f" stopOpacity={0} />
        </linearGradient>

        {/* Right facet */}
        <linearGradient id={`rightFace-${uid}`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={EMBER} stopOpacity={0.1} />
          <stop offset="100%" stopColor="#0a0a0f" stopOpacity={0} />
        </linearGradient>

        {/* Core inner glow */}
        <radialGradient id={`coreGlow-${uid}`} cx="50%" cy="55%" r="50%">
          <stop offset="0%" stopColor={EMBER} stopOpacity={0.75} />
          <stop offset="40%" stopColor={FORGE} stopOpacity={0.35} />
          <stop offset="100%" stopColor={FORGE} stopOpacity={0} />
        </radialGradient>

        {/* Hub radial */}
        <radialGradient id={`hubRadial-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={SPARK} />
          <stop offset="35%" stopColor={EMBER} />
          <stop offset="100%" stopColor={FORGE} stopOpacity={0} />
        </radialGradient>

        {/* Spoke gradient */}
        <linearGradient id={`spokeGrad-${uid}`} x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor={FORGE} stopOpacity={0.7} />
          <stop offset="100%" stopColor={SPARK} stopOpacity={0.3} />
        </linearGradient>

        {/* Soft glow filter */}
        <filter id={`glowSoft-${uid}`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="7" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Strong hub glow */}
        <filter id={`glowHub-${uid}`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Diamond base silhouette ─────────────────────────────── */}
      <polygon
        points="120,14 182,82 156,142 120,158 84,142 58,82"
        fill={`url(#diamFill-${uid})`}
        opacity={baseP}
      />

      {/* ── Facets ─────────────────────────────────────────────── */}
      {/* Top face */}
      <polygon
        points="120,14 58,82 182,82"
        fill={`url(#topFace-${uid})`}
        stroke={SPARK}
        strokeWidth={0.8}
        strokeOpacity={0.35}
        opacity={facetTopP}
      />
      {/* Left upper */}
      <polygon
        points="120,14 58,82 84,142 120,100"
        fill={`url(#leftFace-${uid})`}
        stroke={FORGE}
        strokeWidth={0.7}
        strokeOpacity={0.5}
        opacity={facetLUP}
      />
      {/* Right upper */}
      <polygon
        points="120,14 182,82 156,142 120,100"
        fill={`url(#rightFace-${uid})`}
        stroke={EMBER}
        strokeWidth={0.7}
        strokeOpacity={0.4}
        opacity={facetRUP}
      />
      {/* Left lower */}
      <polygon
        points="58,82 84,142 120,158 120,100"
        fill="#1a0e06"
        fillOpacity={0.7}
        stroke={FORGE}
        strokeWidth={0.7}
        strokeOpacity={0.3}
        opacity={facetLLP}
      />
      {/* Right lower */}
      <polygon
        points="182,82 156,142 120,158 120,100"
        fill="#12100a"
        fillOpacity={0.65}
        stroke={EMBER}
        strokeWidth={0.7}
        strokeOpacity={0.25}
        opacity={facetRLP}
      />

      {/* ── Core inner glow (ellipse) ─────────────────────────── */}
      <ellipse
        cx="120"
        cy="95"
        rx={interpolate(coreGlowP, [0, 1], [0, 52])}
        ry={interpolate(coreGlowP, [0, 1], [0, 50])}
        fill={`url(#coreGlow-${uid})`}
        opacity={coreGlowP}
      />

      {/* ── Outer edges (traced) ──────────────────────────────── */}
      {/* Top-left */}
      <line x1="120" y1="14" x2="58" y2="82"
        stroke={FORGE} strokeWidth={1.5} strokeLinecap="round"
        strokeDasharray="80"
        strokeDashoffset={interpolate(edgesP, [0, 1], [80, 0])}
        opacity={edgesP * 0.9}
      />
      {/* Top-right */}
      <line x1="120" y1="14" x2="182" y2="82"
        stroke={EMBER} strokeWidth={1.5} strokeLinecap="round"
        strokeDasharray="80"
        strokeDashoffset={interpolate(edgesP, [0, 1], [80, 0])}
        opacity={edgesP * 0.85}
      />
      {/* Belt left */}
      <line x1="58" y1="82" x2="84" y2="142"
        stroke={FORGE} strokeWidth={1.2} strokeLinecap="round"
        strokeDasharray="65"
        strokeDashoffset={interpolate(edgesP, [0, 1], [65, 0])}
        opacity={edgesP * 0.7}
      />
      {/* Belt right */}
      <line x1="182" y1="82" x2="156" y2="142"
        stroke={EMBER} strokeWidth={1.2} strokeLinecap="round"
        strokeDasharray="65"
        strokeDashoffset={interpolate(edgesP, [0, 1], [65, 0])}
        opacity={edgesP * 0.65}
      />
      {/* Lower left */}
      <line x1="84" y1="142" x2="120" y2="158"
        stroke={FORGE} strokeWidth={1.2} strokeLinecap="round"
        strokeDasharray="42"
        strokeDashoffset={interpolate(edgesP, [0, 1], [42, 0])}
        opacity={edgesP * 0.6}
      />
      {/* Lower right */}
      <line x1="156" y1="142" x2="120" y2="158"
        stroke={EMBER} strokeWidth={1.2} strokeLinecap="round"
        strokeDasharray="42"
        strokeDashoffset={interpolate(edgesP, [0, 1], [42, 0])}
        opacity={edgesP * 0.55}
      />
      {/* Horizontal belt */}
      <line x1="58" y1="82" x2="182" y2="82"
        stroke={SPARK} strokeWidth={0.7} strokeLinecap="round"
        strokeOpacity={0.2}
        strokeDasharray="124"
        strokeDashoffset={interpolate(edgesP, [0, 1], [124, 0])}
        opacity={edgesP}
      />
      {/* Vertical center axis */}
      <line x1="120" y1="14" x2="120" y2="158"
        stroke={FORGE} strokeWidth={0.6} strokeLinecap="round"
        strokeOpacity={0.25}
        strokeDasharray="144"
        strokeDashoffset={interpolate(edgesP, [0, 1], [144, 0])}
        opacity={edgesP}
      />

      {/* ── Hub-and-spoke flash ────────────────────────────────── */}
      <g opacity={spokeOpacity}>
        {/* Spokes from hub (120,95) */}
        <line x1="120" y1="95" x2="120" y2="28" stroke={`url(#spokeGrad-${uid})`} strokeWidth={0.8} strokeLinecap="round" />
        <line x1="120" y1="95" x2="73" y2="82" stroke={`url(#spokeGrad-${uid})`} strokeWidth={0.8} strokeLinecap="round" />
        <line x1="120" y1="95" x2="167" y2="82" stroke={`url(#spokeGrad-${uid})`} strokeWidth={0.8} strokeLinecap="round" />
        <line x1="120" y1="95" x2="88" y2="140" stroke={`url(#spokeGrad-${uid})`} strokeWidth={0.8} strokeLinecap="round" />
        <line x1="120" y1="95" x2="152" y2="140" stroke={`url(#spokeGrad-${uid})`} strokeWidth={0.8} strokeLinecap="round" />
        <line x1="120" y1="95" x2="120" y2="155" stroke={`url(#spokeGrad-${uid})`} strokeWidth={0.8} strokeLinecap="round" />
        {/* Spoke node dots */}
        <circle cx="120" cy="57" r="2.2" fill={FORGE} opacity={0.8} />
        <circle cx="96" cy="89" r="1.8" fill={SPARK} opacity={0.7} />
        <circle cx="144" cy="89" r="1.8" fill={SPARK} opacity={0.7} />
        <circle cx="104" cy="117" r="1.8" fill={FORGE} opacity={0.6} />
        <circle cx="136" cy="117" r="1.8" fill={FORGE} opacity={0.6} />
        <circle cx="120" cy="128" r="2.0" fill={EMBER} opacity={0.7} />
      </g>

      {/* ── Hub glow ring (shockwave on reveal) ───────────────── */}
      {hubP > 0.3 && (
        <circle
          cx="120" cy="95"
          r={interpolate(hubP, [0.3, 1], [6, 45])}
          fill="none"
          stroke={FORGE}
          strokeWidth={1.5}
          opacity={interpolate(hubP, [0.3, 1], [0.6, 0])}
        />
      )}

      {/* ── Hub core (permanent) ──────────────────────────────── */}
      <circle
        cx="120" cy="95"
        r={interpolate(hubP, [0, 1], [0, 5.5 * hubPulse])}
        fill={`url(#hubRadial-${uid})`}
        filter={`url(#glowHub-${uid})`}
        opacity={hubP}
      />
      <circle
        cx="120" cy="95"
        r={interpolate(hubP, [0, 1], [0, 2.2])}
        fill={SPARK}
        opacity={hubP}
      />
    </svg>
  )
}
