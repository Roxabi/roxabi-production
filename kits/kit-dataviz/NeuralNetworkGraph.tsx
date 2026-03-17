import React, { useMemo } from 'react'
import { useCurrentFrame } from '../../core'
import { random } from '../../core'
import { ACCENT } from '../../themes'
import type { AccentColor } from '../../themes'

export interface NeuralNetworkGraphProps {
  /** Number of nodes (used only for layout="random") */
  nodeCount?: number
  /** Accent color for active nodes/edges */
  color?: string
  accent?: AccentColor
  /** Background color */
  background?: string
  /** Node radius in px */
  nodeRadius?: number
  /** How fast pulses travel along edges (frames per pulse) */
  pulseDuration?: number
  /** Show node glow effect */
  glow?: boolean
  /** Layout: "random" | "layered" (columns like a real neural net) */
  layout?: 'random' | 'layered'
  /** For layered layout: array of node counts per layer, e.g. [3, 5, 4, 2] */
  layers?: number[]
  width?: number
  height?: number
  style?: React.CSSProperties
}

interface Node {
  id: number
  x: number
  y: number
  phase: number
}

interface Edge {
  from: number
  to: number
  /** Length of this edge in px, used to sync dash offset */
  length: number
  /** Per-edge phase offset so pulses don't all fire simultaneously */
  offset: number
}

function edgeLength(a: Node, b: Node): number {
  return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2)
}

/** Derive a muted (lower-opacity) hex colour by appending an alpha byte */
function mutedColor(hex: string, alpha = 0.35): string {
  // Accepts any CSS colour string — use rgba for opacity
  return `color-mix(in srgb, ${hex} ${Math.round(alpha * 100)}%, transparent)`
}

export const NeuralNetworkGraph: React.FC<NeuralNetworkGraphProps> = ({
  nodeCount = 14,
  color,
  accent,
  background = 'transparent',
  nodeRadius = 6,
  pulseDuration = 40,
  glow = true,
  layout = 'random',
  layers = [3, 5, 4, 2],
  width = 800,
  height = 500,
  style,
}) => {
  const frame = useCurrentFrame()

  // Resolve color: explicit prop wins, then accent, then default
  const resolvedColor = color ?? (accent ? ACCENT[accent].color : '#3a86ff')

  const padding = nodeRadius * 3

  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = []
    const edges: Edge[] = []

    if (layout === 'layered') {
      // Build layered neural-net layout
      const totalLayers = layers.length
      const colStep = (width - padding * 2) / (totalLayers - 1)

      let idCounter = 0
      const layerNodes: Node[][] = layers.map((count, li) => {
        const x = padding + li * colStep
        const rowStep = (height - padding * 2) / (count + 1)
        return Array.from({ length: count }, (_, ni) => {
          const node: Node = {
            id: idCounter++,
            x,
            y: padding + rowStep * (ni + 1),
            phase: random(`phase-${li}-${ni}`) * Math.PI * 2,
          }
          nodes.push(node)
          return node
        })
      })

      // Connect every node in layer N to every node in layer N+1
      for (let li = 0; li < layerNodes.length - 1; li++) {
        for (const from of layerNodes[li]) {
          for (const to of layerNodes[li + 1]) {
            edges.push({
              from: from.id,
              to: to.id,
              length: edgeLength(from, to),
              offset: random(`offset-${from.id}-${to.id}`),
            })
          }
        }
      }
    } else {
      // Random scatter layout
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          id: i,
          x: padding + random(`nx-${i}`) * (width - padding * 2),
          y: padding + random(`ny-${i}`) * (height - padding * 2),
          phase: random(`phase-${i}`) * Math.PI * 2,
        })
      }

      // Connect ~30 % of possible pairs (undirected, skip self-loops)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          if (random(`edge-${i}-${j}`) < 0.3) {
            edges.push({
              from: i,
              to: j,
              length: edgeLength(nodes[i], nodes[j]),
              offset: random(`offset-${i}-${j}`),
            })
          }
        }
      }
    }

    return { nodes, edges }
  }, [layout, layers, nodeCount, width, height, padding])

  const nodeMap = useMemo(
    () => new Map(nodes.map((n) => [n.id, n])),
    [nodes],
  )

  const filterId = `nn-glow-${resolvedColor.replace(/[^a-z0-9]/gi, '')}`
  const dotRadius = Math.max(2, nodeRadius * 0.55)

  return (
    <svg
      width={width}
      height={height}
      style={{ background, overflow: 'visible', ...style }}
    >
      <defs>
        {glow && (
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>

      {/* Edges */}
      {edges.map((edge, i) => {
        const from = nodeMap.get(edge.from)!
        const to = nodeMap.get(edge.to)!

        // Traveling dot position: 0 → 1 along the edge
        const cycleFrame = (frame + edge.offset * pulseDuration) % pulseDuration
        const t = cycleFrame / pulseDuration

        const dotX = from.x + (to.x - from.x) * t
        const dotY = from.y + (to.y - from.y) * t

        return (
          <g key={i}>
            {/* Static edge line */}
            <line
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={resolvedColor}
              strokeOpacity={0.25}
              strokeWidth={1}
            />
            {/* Traveling pulse dot */}
            <circle
              cx={dotX}
              cy={dotY}
              r={dotRadius}
              fill="white"
              opacity={0.85}
            />
          </g>
        )
      })}

      {/* Nodes */}
      {nodes.map((node) => {
        const pulse = 0.6 + 0.4 * Math.sin(frame * 0.05 + node.phase)
        return (
          <circle
            key={node.id}
            cx={node.x}
            cy={node.y}
            r={nodeRadius}
            fill={resolvedColor}
            opacity={pulse}
            filter={glow ? `url(#${filterId})` : undefined}
          />
        )
      })}
    </svg>
  )
}
