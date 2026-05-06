import React from 'react'
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from '../core'
import { cInterpolate, sprng, fadeIn } from '../lib'
import { Typewriter } from '../kits/kit-text/Typewriter'
import { FadeText } from '../kits/kit-text/FadeText'
import { StaggeredWords } from '../kits/kit-text/StaggeredWords'
import { GlitchText } from '../kits/kit-text/GlitchText'
import { WordByWord } from '../kits/kit-text/WordByWord'
import { GridPattern } from '../kits/kit-backgrounds/GridPattern'
import { ParticleField } from '../kits/kit-backgrounds/ParticleField'
import { Vignette } from '../kits/kit-cinema/Vignette'
import { LightSweep } from '../kits/kit-cinema/LightSweep'
import { FilmGrain } from '../kits/kit-cinema/FilmGrain'
import audioBands from './audio-bands.json'

// ─── Audio-reactive helpers ───────────────────────────────────────────────────
// Pre-extracted per-frame VO amplitude bands. Indexed by ABSOLUTE frame.
// HyperFrames-style: per-frame sampling, no continuous tween.
const sampleBand = (band: 'low' | 'mid' | 'high' | 'rms', absFrame: number): number => {
  const arr = (audioBands as unknown as Record<string, number[]>)[band]
  if (absFrame < 0 || absFrame >= arr.length) return 0
  return arr[absFrame] ?? 0
}

// ─── Roxabi brand tokens · BRAND-BOOK.md v1.5 (locked) ────────────────────────
const BG = '#0d1117'
const PANEL = '#13191f'
const SURFACE = '#161b22'
const AMBER = '#f0b429'
const TEXT = '#f0ede6'
const TEXT_MUTED = '#9ca3af'
const TEXT_DIM = '#6b7280'
const BORDER = '#21262d'
const BORDER_HI = '#30363d'

// ─── Typography ───────────────────────────────────────────────────────────────
const HEADING_FONT = "'Inter', system-ui, sans-serif"
const HEADING_WEIGHT = 900
const HEADING_TRACKING = '-0.04em'
const MONO = "'JetBrains Mono', ui-monospace, monospace"

// ─── Crossfade wrapper ────────────────────────────────────────────────────────
// Wraps a scene with fade-in / fade-out at the boundaries. Sequences overlap
// by `fadeIn`/`fadeOut` frames so the outgoing scene fades while the incoming
// fades in — a true cross-fade, not a fade-through-black.
const Crossfade: React.FC<{
  durationInFrames: number
  fadeIn?: number
  fadeOut?: number
  children: React.ReactNode
}> = ({ durationInFrames, fadeIn = 0, fadeOut = 0, children }) => {
  const f = useCurrentFrame()
  const points: number[] = [0]
  const values: number[] = [fadeIn > 0 ? 0 : 1]
  if (fadeIn > 0) {
    points.push(fadeIn)
    values.push(1)
  }
  if (fadeOut > 0) {
    points.push(durationInFrames - fadeOut, durationInFrames)
    values.push(1, 0)
  } else {
    points.push(durationInFrames)
    values.push(1)
  }
  const op = cInterpolate(f, points, values)
  return (
    <AbsoluteFill style={{ opacity: op }}>
      {children}
    </AbsoluteFill>
  )
}

// ─── Reusable layer badge ─────────────────────────────────────────────────────
const LayerBadge: React.FC<{
  layer: string
  label: string
  delay?: number
}> = ({ layer, label, delay = 0 }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const p = sprng(frame, fps, { damping: 14, stiffness: 110 }, delay)

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        fontFamily: MONO,
        fontSize: 13,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: TEXT_MUTED,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [12, 0])}px)`,
      }}
    >
      <span style={{ color: AMBER, fontWeight: 600 }}>{layer}</span>
      <span style={{ color: BORDER_HI }}>·</span>
      <span style={{ fontWeight: 500 }}>{label}</span>
    </div>
  )
}

// ─── S01: Hook — Recognition (f 0–300 · 10 s) ─────────────────────────────────
const S01_FRAGMENTS = [
  'routing/',
  'state/',
  'orchestration/',
  'error-handling/',
  'auth/',
  'persistence/',
  'queue/',
  'observability/',
  'rbac/',
  'tenant/',
]

const S01Hook: React.FC = () => {
  const frame = useCurrentFrame()

  return (
    <AbsoluteFill style={{ background: BG }}>
      <GridPattern cellSize={64} color="rgba(240,180,41,0.04)" />

      {/* Path fragments cycling — first 6s */}
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          opacity: cInterpolate(frame, [0, 12, 150, 200], [0, 1, 1, 0]),
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, auto)',
            gap: '14px 60px',
            fontFamily: MONO,
            fontSize: 28,
            color: TEXT_MUTED,
          }}
        >
          {S01_FRAGMENTS.map((f, i) => {
            const appear = i * 12
            const flicker =
              Math.sin(frame * 0.7 + i * 1.3) > 0.6 && frame > appear + 30
            const op = cInterpolate(frame, [appear, appear + 8], [0, 0.85])
            return (
              <span
                key={f}
                style={{
                  opacity: flicker ? op * 0.45 : op,
                  color: i === 2 || i === 6 ? AMBER : TEXT_MUTED,
                  filter: flicker ? 'blur(0.6px)' : 'none',
                }}
              >
                {f}
              </span>
            )
          })}
        </div>
      </AbsoluteFill>

      {/* Settle: line 1 — typewriter */}
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          opacity: cInterpolate(frame, [180, 210], [0, 1]),
        }}
      >
        <div
          style={{
            fontFamily: HEADING_FONT,
            fontWeight: HEADING_WEIGHT,
            fontSize: 56,
            letterSpacing: HEADING_TRACKING,
            color: TEXT,
            textAlign: 'center',
            maxWidth: 1400,
          }}
        >
          <Typewriter
            text="You already know how to build this."
            delay={185}
            speed={1.6}
            cursor={false}
            style={{
              fontFamily: HEADING_FONT,
              fontWeight: HEADING_WEIGHT,
              fontSize: 56,
              letterSpacing: HEADING_TRACKING,
              color: TEXT,
            }}
          />
        </div>
        <div
          style={{
            marginTop: 28,
            opacity: cInterpolate(frame, [255, 285], [0, 1]),
            fontFamily: MONO,
            fontSize: 22,
            color: TEXT_DIM,
            letterSpacing: '0.04em',
          }}
        >
          You&apos;ve already built it. Five times.
        </div>
      </AbsoluteFill>

      <FilmGrain opacity={0.04} />
      <Vignette intensity={0.7} />
    </AbsoluteFill>
  )
}

// ─── S02: The Gap — 50-person org frame (f 300–750 · 15 s) ────────────────────
const TEAM_DOTS = Array.from({ length: 50 }, (_, i) => i)
const TEAM_LABELS: Array<{ idx: number; text: string }> = [
  { idx: 4, text: 'platform' },
  { idx: 12, text: 'orchestration' },
  { idx: 22, text: 'state' },
  { idx: 33, text: 'routing' },
  { idx: 44, text: 'tooling' },
]

const SCAFFOLD_LINES = [
  'auth/',
  'multitenancy/',
  'rbac/',
  'ci-cd/',
  'state/',
  'queue/',
  'orchestration/',
]

const S02Gap: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const localFrame = frame // sequence-local

  return (
    <AbsoluteFill style={{ background: BG }}>
      <GridPattern cellSize={64} color="rgba(255,255,255,0.025)" />

      {/* LEFT: team-of-fifty cluster */}
      <div
        style={{
          position: 'absolute',
          left: '8%',
          top: '50%',
          width: '38%',
          transform: 'translateY(-50%)',
          opacity: cInterpolate(localFrame, [0, 40], [0, 1]),
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: 12,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: TEXT_DIM,
            marginBottom: 22,
          }}
        >
          A team of fifty
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(10, 1fr)',
            gap: 16,
            position: 'relative',
          }}
        >
          {TEAM_DOTS.map((i) => {
            const appearF = 12 + i * 1.5
            const p = sprng(localFrame, fps, { damping: 16, stiffness: 130 }, appearF)
            const labeled = TEAM_LABELS.find((l) => l.idx === i)
            return (
              <div
                key={i}
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: labeled ? AMBER : TEXT_MUTED,
                  opacity: p * (labeled ? 1 : 0.55),
                  transform: `scale(${p})`,
                  boxShadow: labeled ? `0 0 12px ${AMBER}88` : 'none',
                  position: 'relative',
                }}
              >
                {labeled && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 24,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontFamily: MONO,
                      fontSize: 9,
                      color: TEXT_DIM,
                      letterSpacing: '0.1em',
                      whiteSpace: 'nowrap',
                      opacity: cInterpolate(localFrame, [60 + i * 1.5, 90 + i * 1.5], [0, 1]),
                    }}
                  >
                    {labeled.text}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* RIGHT: solo dot + scaffold rebuild */}
      <div
        style={{
          position: 'absolute',
          right: '8%',
          top: '50%',
          width: '38%',
          transform: 'translateY(-50%)',
          opacity: cInterpolate(localFrame, [80, 130], [0, 1]),
          textAlign: 'right',
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: 12,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: TEXT_DIM,
            marginBottom: 22,
          }}
        >
          You
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 28 }}>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: AMBER,
              boxShadow: `0 0 18px ${AMBER}aa`,
            }}
          />
        </div>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 16,
            color: TEXT_MUTED,
            lineHeight: 2.0,
            textAlign: 'right',
          }}
        >
          {SCAFFOLD_LINES.map((line, i) => {
            const appear = 150 + i * 30
            return (
              <div
                key={line}
                style={{
                  opacity: cInterpolate(localFrame, [appear, appear + 12], [0, 0.85]),
                  textDecoration:
                    localFrame > appear + 90 ? 'line-through' : 'none',
                  textDecorationColor: 'rgba(239,68,68,0.5)',
                  color: localFrame > appear + 90 ? TEXT_DIM : TEXT_MUTED,
                  transition: 'all 0.4s',
                }}
              >
                {line}
              </div>
            )
          })}
        </div>
      </div>

      {/* Closing line — heavy amber */}
      <div
        style={{
          position: 'absolute',
          bottom: '8%',
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: cInterpolate(localFrame, [330, 380], [0, 1]),
        }}
      >
        <div
          style={{
            fontFamily: HEADING_FONT,
            fontWeight: HEADING_WEIGHT,
            fontSize: 60,
            letterSpacing: HEADING_TRACKING,
            color: TEXT,
          }}
        >
          The gap isn&apos;t skill.{' '}
          <span
            style={{
              color: AMBER,
              opacity: cInterpolate(localFrame, [360, 410], [0, 1]),
            }}
          >
            It&apos;s foundations.
          </span>
        </div>
      </div>

      <FilmGrain opacity={0.04} />
      <Vignette intensity={0.65} />
    </AbsoluteFill>
  )
}

// ─── S03: Layer 1 — The Smith (f 750–1260 · 17 s) ─────────────────────────────
const S03Smith: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  return (
    <AbsoluteFill style={{ background: BG }}>
      <GridPattern cellSize={80} color="rgba(255,255,255,0.02)" />
      <ParticleField count={24} color={`${AMBER}33`} />

      {/* Layer badge — top */}
      <div
        style={{
          position: 'absolute',
          top: '14%',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <LayerBadge layer="LAYER 01" label="The Smith" delay={20} />
      </div>

      {/* Hero declaration — center */}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            fontFamily: HEADING_FONT,
            fontWeight: HEADING_WEIGHT,
            fontSize: 64,
            letterSpacing: HEADING_TRACKING,
            color: TEXT,
            textAlign: 'center',
            opacity: cInterpolate(frame, [80, 130], [0, 1]),
            transform: `translateY(${interpolate(
              cInterpolate(frame, [80, 130], [0, 1]),
              [0, 1],
              [16, 0],
            )}px)`,
            maxWidth: 1300,
          }}
        >
          Roxabi starts with the smith.
        </div>

        {/* Mono subtitle — biographical fact */}
        <div
          style={{
            marginTop: 56,
            fontFamily: MONO,
            fontSize: 18,
            letterSpacing: '0.16em',
            color: TEXT_MUTED,
            textTransform: 'uppercase',
            opacity: cInterpolate(frame, [200, 250], [0, 1]),
          }}
        >
          <span>14 years</span>
          <span style={{ margin: '0 18px', color: BORDER_HI }}>·</span>
          <span style={{ opacity: cInterpolate(frame, [240, 280], [0, 1]) }}>
            teams
          </span>
          <span style={{ margin: '0 12px', color: AMBER }}>→</span>
          <span style={{ opacity: cInterpolate(frame, [285, 320], [0, 1]) }}>
            agents
          </span>
        </div>

        {/* Closing — same craft / new material */}
        <div
          style={{
            marginTop: 60,
            display: 'flex',
            gap: 44,
            fontFamily: HEADING_FONT,
            fontWeight: 700,
            fontSize: 30,
            letterSpacing: '-0.02em',
            color: TEXT_MUTED,
          }}
        >
          <span style={{ opacity: cInterpolate(frame, [340, 380], [0, 1]) }}>
            Same craft.
          </span>
          <span
            style={{
              opacity: cInterpolate(frame, [385, 425], [0, 1]),
              color: TEXT,
            }}
          >
            New material.
          </span>
        </div>
      </AbsoluteFill>

      <LightSweep delay={60} color={`${AMBER}33`} />
      <FilmGrain opacity={0.04} />
      <Vignette intensity={0.78} />
    </AbsoluteFill>
  )
}

// ─── S04: Layer 2 — The Creed (f 1260–2040 · 26 s) ────────────────────────────
const CREED_LINES: Array<{ text: string; appear: number; weight: number }> = [
  { text: '# the roxabi creed', appear: 130, weight: 0.6 },
  { text: 'open by architecture', appear: 200, weight: 1 },
  { text: 'local by default', appear: 260, weight: 1 },
  { text: 'compounding', appear: 320, weight: 1 },
  { text: 'MIT', appear: 380, weight: 1 },
  { text: 'no telemetry', appear: 440, weight: 1 },
  { text: 'yours the moment you clone', appear: 510, weight: 1.2 },
]

const S04Creed: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  return (
    <AbsoluteFill style={{ background: BG }}>
      <GridPattern cellSize={64} color="rgba(255,255,255,0.025)" />

      {/* Layer badge */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <LayerBadge layer="LAYER 02" label="The Creed" delay={10} />
      </div>

      {/* Terminal frame — center */}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            opacity: cInterpolate(frame, [50, 100], [0, 1]),
            transform: `scale(${interpolate(
              cInterpolate(frame, [50, 110], [0, 1]),
              [0, 1],
              [0.96, 1],
            )})`,
            background: SURFACE,
            border: `1px solid ${BORDER}`,
            borderRadius: 12,
            padding: '40px 56px',
            minWidth: 760,
            boxShadow: `0 24px 80px rgba(0,0,0,0.5)`,
            position: 'relative',
          }}
        >
          {/* Terminal header dots */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              marginBottom: 28,
              opacity: cInterpolate(frame, [70, 110], [0, 0.6]),
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: BORDER_HI,
                }}
              />
            ))}
          </div>

          {/* Creed lines */}
          <div style={{ fontFamily: MONO, fontSize: 26, lineHeight: 1.9 }}>
            {CREED_LINES.map((line, i) => {
              const visible = frame > line.appear
              const localF = Math.max(0, frame - line.appear)
              const isComment = line.text.startsWith('#')
              const charsVisible = Math.min(
                line.text.length,
                Math.floor(localF * 1.2),
              )
              const text = line.text.slice(0, charsVisible)
              const cursorOn = Math.floor(frame / 12) % 2 === 0
              const showCursor =
                visible && charsVisible < line.text.length && cursorOn

              return (
                <div
                  key={i}
                  style={{
                    color: isComment ? TEXT_DIM : TEXT,
                    opacity: visible
                      ? cInterpolate(localF, [0, 8], [0.5, 1])
                      : 0,
                    fontWeight: isComment ? 400 : 500,
                    fontSize: line.weight === 1.2 ? 28 : 26,
                  }}
                >
                  {!isComment && (
                    <span style={{ color: AMBER, marginRight: 14 }}>›</span>
                  )}
                  <span>{text}</span>
                  {showCursor && (
                    <span style={{ color: AMBER, marginLeft: 2 }}>▋</span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Final amber pulse on last line — audio-reactive (voice presence) */}
          <div
            style={{
              position: 'absolute',
              left: 56,
              right: 56,
              bottom: 28,
              height: 1,
              background: AMBER,
              opacity:
                cInterpolate(frame, [510, 600, 760], [0, 0.65, 0]) *
                (0.45 + 0.55 * sampleBand('mid', frame + 1260)),
              boxShadow: `0 0 ${4 + 12 * sampleBand('mid', frame + 1260)}px ${AMBER}88`,
            }}
          />
        </div>
      </AbsoluteFill>

      <FilmGrain opacity={0.04} />
      <Vignette intensity={0.7} />
    </AbsoluteFill>
  )
}

// ─── S05: Primitives — graph compounding (f 2040–2460 · 14 s) ─────────────────
type Node = { id: string; x: number; y: number; appear: number }

const PRIMITIVE_NODES: Node[] = [
  { id: 'Routing', x: 0.22, y: 0.5, appear: 60 },
  { id: 'State', x: 0.39, y: 0.32, appear: 90 },
  { id: 'Orchestration', x: 0.5, y: 0.55, appear: 120 },
  { id: 'Harness', x: 0.61, y: 0.32, appear: 150 },
  { id: 'Tool connectors', x: 0.78, y: 0.5, appear: 180 },
]

const PRIMITIVE_EDGES: Array<[number, number, number]> = [
  // [from, to, appear]
  [0, 1, 240],
  [0, 2, 250],
  [1, 2, 260],
  [1, 3, 270],
  [2, 3, 280],
  [2, 4, 290],
  [3, 4, 300],
]

const S05Primitives: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const W = 1920
  const H = 1080
  const px = (n: Node) => n.x * W
  const py = (n: Node) => n.y * H

  return (
    <AbsoluteFill style={{ background: BG }}>
      <GridPattern cellSize={64} color="rgba(255,255,255,0.025)" />

      {/* Top label */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: cInterpolate(frame, [10, 50], [0, 1]),
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: 13,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: AMBER,
            marginBottom: 18,
          }}
        >
          Not a framework
        </div>
        <div
          style={{
            fontFamily: HEADING_FONT,
            fontWeight: HEADING_WEIGHT,
            fontSize: 56,
            letterSpacing: HEADING_TRACKING,
            color: TEXT,
          }}
        >
          Primitives.
        </div>
      </div>

      {/* SVG graph */}
      <svg
        width={W}
        height={H}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        {/* Edges */}
        {PRIMITIVE_EDGES.map(([fromIdx, toIdx, appear], i) => {
          const from = PRIMITIVE_NODES[fromIdx]
          const to = PRIMITIVE_NODES[toIdx]
          const edgeP = cInterpolate(frame, [appear, appear + 28], [0, 1])
          return (
            <line
              key={i}
              x1={px(from)}
              y1={py(from)}
              x2={px(from) + (px(to) - px(from)) * edgeP}
              y2={py(from) + (py(to) - py(from)) * edgeP}
              stroke={AMBER}
              strokeWidth={2}
              strokeOpacity={0.45}
            />
          )
        })}

        {/* Nodes */}
        {PRIMITIVE_NODES.map((node, i) => {
          const p = sprng(frame, fps, { damping: 14, stiffness: 110 }, node.appear)
          const pulse = Math.sin(frame * 0.12 + i) * 0.15 + 0.85
          const r = 28 * p
          return (
            <g key={node.id}>
              <circle
                cx={px(node)}
                cy={py(node)}
                r={r * 1.6}
                fill={AMBER}
                opacity={p * 0.12 * pulse}
              />
              <circle
                cx={px(node)}
                cy={py(node)}
                r={r}
                fill={SURFACE}
                stroke={AMBER}
                strokeWidth={2.5}
                opacity={p}
              />
              <text
                x={px(node)}
                y={py(node) + 60}
                fontFamily={MONO}
                fontSize={16}
                fontWeight={500}
                fill={TEXT}
                textAnchor="middle"
                opacity={p}
              >
                {node.id}
              </text>
            </g>
          )
        })}
      </svg>

      {/* Bottom line */}
      <div
        style={{
          position: 'absolute',
          bottom: '12%',
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: cInterpolate(frame, [320, 360], [0, 1]),
        }}
      >
        <span
          style={{
            fontFamily: HEADING_FONT,
            fontWeight: 600,
            fontSize: 28,
            color: TEXT_MUTED,
            letterSpacing: '-0.01em',
          }}
        >
          Each one stands alone.
        </span>
        <span
          style={{
            marginLeft: 22,
            fontFamily: HEADING_FONT,
            fontWeight: 800,
            fontSize: 28,
            color: AMBER,
            letterSpacing: '-0.01em',
            opacity: cInterpolate(frame, [355, 395], [0, 1]),
          }}
        >
          Together, they compound.
        </span>
      </div>

      <FilmGrain opacity={0.04} />
      <Vignette intensity={0.72} />
    </AbsoluteFill>
  )
}

// ─── S06: Layer 3 — The Guild (f 2460–2880 · 14 s) ────────────────────────────
type ForkNode = { x: number; y: number; appear: number; size: number }
const FORK_NODES: ForkNode[] = Array.from({ length: 14 }, (_, i) => {
  const angle = (i / 14) * Math.PI * 2
  const radius = 0.32 + (i % 3) * 0.04
  return {
    x: 0.5 + Math.cos(angle) * radius,
    y: 0.55 + Math.sin(angle) * radius * 0.75,
    appear: 60 + i * 12,
    size: 6 + (i % 4) * 2,
  }
})

const S06Guild: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const W = 1920
  const H = 1080

  return (
    <AbsoluteFill style={{ background: BG }}>
      <GridPattern cellSize={64} color="rgba(255,255,255,0.025)" />

      {/* Layer badge */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <LayerBadge layer="LAYER 03" label="The Guild" delay={10} />
      </div>

      {/* Central core (the forge) — small amber */}
      <svg
        width={W}
        height={H}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        {/* core glow */}
        <circle
          cx={W * 0.5}
          cy={H * 0.55}
          r={50}
          fill={AMBER}
          opacity={cInterpolate(frame, [0, 50], [0, 0.18])}
        />
        <circle
          cx={W * 0.5}
          cy={H * 0.55}
          r={22}
          fill={AMBER}
          opacity={cInterpolate(frame, [0, 50], [0, 0.85])}
        />

        {/* Fork nodes — guild members */}
        {FORK_NODES.map((fn, i) => {
          const p = sprng(frame, fps, { damping: 14, stiffness: 110 }, fn.appear)
          const cx = fn.x * W
          const cy = fn.y * H
          // line from core to fork
          const coreX = W * 0.5
          const coreY = H * 0.55
          const lineP = cInterpolate(
            frame,
            [fn.appear - 8, fn.appear + 16],
            [0, 1],
          )
          return (
            <g key={i}>
              <line
                x1={coreX}
                y1={coreY}
                x2={coreX + (cx - coreX) * lineP}
                y2={coreY + (cy - coreY) * lineP}
                stroke={AMBER}
                strokeWidth={1.2}
                strokeOpacity={0.32}
              />
              <circle
                cx={cx}
                cy={cy}
                r={fn.size * p}
                fill={SURFACE}
                stroke={AMBER}
                strokeWidth={1.5}
                opacity={p * 0.9}
              />
            </g>
          )
        })}
      </svg>

      {/* Compounding mirror tagline */}
      <div
        style={{
          position: 'absolute',
          bottom: '14%',
          left: 0,
          right: 0,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: HEADING_FONT,
            fontWeight: 800,
            fontSize: 38,
            letterSpacing: '-0.02em',
            color: TEXT,
            marginBottom: 14,
            opacity: cInterpolate(frame, [240, 290], [0, 1]),
          }}
        >
          Roxabi extends{' '}
          <span style={{ color: AMBER }}>open source.</span>
        </div>
        <div
          style={{
            fontFamily: HEADING_FONT,
            fontWeight: 800,
            fontSize: 38,
            letterSpacing: '-0.02em',
            color: TEXT,
            opacity: cInterpolate(frame, [310, 360], [0, 1]),
          }}
        >
          <span style={{ color: AMBER }}>Open source</span> extends Roxabi.
        </div>
      </div>

      <FilmGrain opacity={0.04} />
      <Vignette intensity={0.72} />
    </AbsoluteFill>
  )
}

// ─── S07: Close — Wordmark + tagline (f 2880–3300 · 14 s) ─────────────────────
const S07Close: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Wordmark builds in two passes: white reveal → amber accent on last char (last)
  const wmAppear = cInterpolate(frame, [40, 110], [0, 1])
  const accentAppear = cInterpolate(frame, [180, 240], [0, 1])

  return (
    <AbsoluteFill style={{ background: BG }}>
      <GridPattern cellSize={80} color="rgba(255,255,255,0.02)" />
      <ParticleField count={18} color={`${AMBER}22`} />

      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        {/* Mono pre-mark */}
        <div
          style={{
            fontFamily: MONO,
            fontSize: 14,
            letterSpacing: '0.32em',
            color: TEXT_DIM,
            marginBottom: 36,
            opacity: cInterpolate(frame, [0, 40], [0, 1]),
          }}
        >
          ROXABI
        </div>

        {/* Hero wordmark */}
        <div
          style={{
            fontFamily: HEADING_FONT,
            fontWeight: HEADING_WEIGHT,
            fontSize: 200,
            letterSpacing: HEADING_TRACKING,
            lineHeight: 1,
            position: 'relative',
            display: 'inline-block',
            transform: `scale(${interpolate(wmAppear, [0, 1], [0.92, 1])})`,
          }}
        >
          <span
            style={{
              color: TEXT,
              opacity: wmAppear,
            }}
          >
            ROXAB
          </span>
          <span
            style={{
              color: AMBER,
              opacity: accentAppear,
              // Audio-reactive glow on the amber I — high band (sibilants) +
              // voice mid-band drive a soft breathing halo as VO closes.
              textShadow: `0 0 ${18 + 28 * sampleBand('high', frame + 2880)}px ${AMBER}88,
                          0 0 ${36 + 60 * sampleBand('mid', frame + 2880)}px ${AMBER}44`,
            }}
          >
            I
          </span>
          {/* Underline accent — amber arrives last (animation principle locked) */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: -6,
              height: 4,
              background: AMBER,
              transformOrigin: 'left',
              transform: `scaleX(${cInterpolate(frame, [220, 280], [0, 1])})`,
              opacity: 0.85,
            }}
          />
        </div>

        {/* Lead tagline */}
        <div
          style={{
            marginTop: 64,
            fontFamily: HEADING_FONT,
            fontWeight: 700,
            fontSize: 44,
            letterSpacing: '-0.02em',
            color: TEXT,
            textAlign: 'center',
            opacity: cInterpolate(frame, [260, 310], [0, 1]),
          }}
        >
          One person.{' '}
          <span style={{ color: AMBER }}>Team-scale output.</span>
        </div>

        {/* Sub-tagline */}
        <div
          style={{
            marginTop: 28,
            fontFamily: MONO,
            fontSize: 18,
            letterSpacing: '0.24em',
            color: TEXT_MUTED,
            textTransform: 'uppercase',
            opacity: cInterpolate(frame, [310, 360], [0, 1]),
          }}
        >
          Pre-wired · Open · Yours
        </div>

        {/* URL */}
        <div
          style={{
            marginTop: 50,
            fontFamily: MONO,
            fontSize: 16,
            color: TEXT_DIM,
            letterSpacing: '0.08em',
            opacity: cInterpolate(frame, [350, 400], [0, 1]),
          }}
        >
          roxabi.dev
        </div>
      </AbsoluteFill>

      <FilmGrain opacity={0.05} />
      <Vignette intensity={0.78} />
    </AbsoluteFill>
  )
}

// ─── Main composition ─────────────────────────────────────────────────────────
// 110s @ 30fps = 3300 frames. Each consecutive Sequence overlaps the next by
// FADE frames; the Crossfade wrapper fades the outgoing scene while the next
// fades in. Scene `from` anchors are unchanged (so localF semantics in each
// scene are preserved); only `durationInFrames` is extended for the tail.
//
// S01 Hook         0–315    (was 0–300,    +15 trail)
// S02 Gap        300–765    (was 300–750,  +15 trail; overlap 300–315 with S01)
// S03 Smith      750–1275   (was 750–1260, +15 trail; overlap 750–765 with S02)
// S04 Creed     1260–2055   (was 1260–2040, +15 trail; overlap 1260–1275)
// S05 Primitives 2040–2475  (was 2040–2460, +15 trail; overlap 2040–2055)
// S06 Guild     2460–2895   (was 2460–2880, +15 trail; overlap 2460–2475)
// S07 Close     2880–3300   (overlap 2880–2895 with S06)
const FADE = 15 // 0.5s @ 30fps

export const RoxabiTrailer: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <Sequence from={0} durationInFrames={300 + FADE}>
      <Crossfade durationInFrames={300 + FADE} fadeOut={FADE}>
        <S01Hook />
      </Crossfade>
    </Sequence>

    <Sequence from={300} durationInFrames={450 + FADE}>
      <Crossfade durationInFrames={450 + FADE} fadeIn={FADE} fadeOut={FADE}>
        <S02Gap />
      </Crossfade>
    </Sequence>

    <Sequence from={750} durationInFrames={510 + FADE}>
      <Crossfade durationInFrames={510 + FADE} fadeIn={FADE} fadeOut={FADE}>
        <S03Smith />
      </Crossfade>
    </Sequence>

    <Sequence from={1260} durationInFrames={780 + FADE}>
      <Crossfade durationInFrames={780 + FADE} fadeIn={FADE} fadeOut={FADE}>
        <S04Creed />
      </Crossfade>
    </Sequence>

    <Sequence from={2040} durationInFrames={420 + FADE}>
      <Crossfade durationInFrames={420 + FADE} fadeIn={FADE} fadeOut={FADE}>
        <S05Primitives />
      </Crossfade>
    </Sequence>

    <Sequence from={2460} durationInFrames={420 + FADE}>
      <Crossfade durationInFrames={420 + FADE} fadeIn={FADE} fadeOut={FADE}>
        <S06Guild />
      </Crossfade>
    </Sequence>

    <Sequence from={2880} durationInFrames={420}>
      <Crossfade durationInFrames={420} fadeIn={FADE}>
        <S07Close />
      </Crossfade>
    </Sequence>
  </AbsoluteFill>
)
