import React from 'react'
import { useCurrentFrame, useVideoConfig, spring, interpolate } from '../../core'

const FORGE_ORANGE = '#e85d04'
const FORGE_GRAY = '#6b7280'

interface NodeDef {
  id: string
  label: string
  icon: string
  /** Degrees from North (top), clockwise */
  angle: number
  /** Distance from center as fraction of Math.min(w,h)/2 */
  radius: number
  delay: number
}

// Pentagon-ish layout: Telegram TL, Discord TR, LLM R, Memory B, Agents BL
const NODES: NodeDef[] = [
  { id: 'telegram', label: 'Telegram', icon: '✈', angle: 315, radius: 0.32, delay: 15 },
  { id: 'discord',  label: 'Discord',  icon: '⬡', angle: 45,  radius: 0.32, delay: 25 },
  { id: 'llm',      label: 'LLM',      icon: '◆', angle: 90,  radius: 0.32, delay: 35 },
  { id: 'memory',   label: 'Memory',   icon: '◉', angle: 180, radius: 0.32, delay: 45 },
  { id: 'agents',   label: 'Agents',   icon: '◎', angle: 225, radius: 0.32, delay: 55 },
]

function polarToXY(cx: number, cy: number, angle: number, radius: number, size: number) {
  const rad = ((angle - 90) * Math.PI) / 180
  const dist = (Math.min(size, size) / 2) * radius * 2
  return {
    x: cx + Math.cos(rad) * dist,
    y: cy + Math.sin(rad) * dist,
  }
}

export interface ForgeArchDiagramProps {
  width?: number
  height?: number
}

export const ForgeArchDiagram: React.FC<ForgeArchDiagramProps> = ({
  width = 900,
  height = 520,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const cx = width / 2
  const cy = height / 2
  const size = Math.min(width, height)

  const hubPop = spring({ frame, fps, delay: 0, config: { damping: 10, stiffness: 120 } })
  const hubPulse = 0.7 + Math.sin(frame * 0.08) * 0.3

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <pattern id="archgrid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="1"
          />
        </pattern>
        <filter id="hubglow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="nodeglow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background grid */}
      <rect width={width} height={height} fill="url(#archgrid)" />

      {/* Hub outer pulse ring */}
      <circle
        cx={cx}
        cy={cy}
        r={interpolate(hubPop, [0, 1], [0, 52 * hubPulse])}
        fill="none"
        stroke={`${FORGE_ORANGE}18`}
        strokeWidth={24}
      />

      {/* Connection lines — drawn progressively */}
      {NODES.map((node) => {
        const { x: nx, y: ny } = polarToXY(cx, cy, node.angle, node.radius, size)
        const lineP = spring({
          frame,
          fps,
          delay: node.delay + 5,
          config: { damping: 20, stiffness: 55 },
        })
        const mx = cx + (nx - cx) * lineP
        const my = cy + (ny - cy) * lineP
        const sparkOpacity = lineP > 0.96 ? 0.6 + Math.sin(frame * 0.18 + node.delay) * 0.4 : 0

        return (
          <g key={`line-${node.id}`}>
            {/* Soft glow behind */}
            <line
              x1={cx} y1={cy} x2={mx} y2={my}
              stroke={`${FORGE_ORANGE}18`}
              strokeWidth={7}
            />
            {/* Dashed main line */}
            <line
              x1={cx} y1={cy} x2={mx} y2={my}
              stroke={`${FORGE_ORANGE}55`}
              strokeWidth={1.5}
              strokeDasharray="5 4"
            />
            {/* Spark at endpoint */}
            <circle cx={mx} cy={my} r={3} fill={FORGE_ORANGE} opacity={sparkOpacity} />
          </g>
        )
      })}

      {/* Satellite nodes */}
      {NODES.map((node) => {
        const { x: nx, y: ny } = polarToXY(cx, cy, node.angle, node.radius, size)
        const p = spring({ frame, fps, delay: node.delay, config: { damping: 12, stiffness: 100 } })
        const r = interpolate(p, [0, 1], [0, 24])

        return (
          <g key={node.id} transform={`translate(${nx}, ${ny})`} opacity={p} filter="url(#nodeglow)">
            <circle r={r} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.12)" strokeWidth={1.5} />
            <text
              textAnchor="middle"
              dominantBaseline="central"
              fill="#e2e8f0"
              fontSize={13}
              fontFamily="system-ui, sans-serif"
            >
              {node.icon}
            </text>
            <text
              y={r + 16}
              textAnchor="middle"
              fill={FORGE_GRAY}
              fontSize={9}
              fontFamily="JetBrains Mono, monospace"
              letterSpacing="1.5"
            >
              {node.label.toUpperCase()}
            </text>
          </g>
        )
      })}

      {/* Hub node — rendered on top */}
      <g transform={`translate(${cx}, ${cy})`} filter="url(#hubglow)">
        {/* Inner fill */}
        <circle
          r={interpolate(hubPop, [0, 1], [0, 36])}
          fill="rgba(232,93,4,0.14)"
          stroke={FORGE_ORANGE}
          strokeWidth={2}
        />
        {/* Icon */}
        <text
          textAnchor="middle"
          dominantBaseline="central"
          fill={FORGE_ORANGE}
          fontSize={20}
          fontWeight={700}
          fontFamily="JetBrains Mono, monospace"
          opacity={hubPop}
        >
          ◈
        </text>
        {/* Label below */}
        <text
          y={50}
          textAnchor="middle"
          fill={FORGE_ORANGE}
          fontSize={9}
          fontFamily="JetBrains Mono, monospace"
          opacity={hubPop}
          letterSpacing="3"
        >
          LYRA HUB
        </text>
      </g>
    </svg>
  )
}
