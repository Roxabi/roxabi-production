import React from 'react'
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from '../core'
import { cInterpolate, sprng } from '../lib'
import { GlitchText } from '../kits/kit-text/GlitchText'
import { Typewriter } from '../kits/kit-text/Typewriter'
import { StaggeredWords } from '../kits/kit-text/StaggeredWords'
import { ImpactText } from '../kits/kit-overlays/ImpactText'
import { GradientBackground } from '../kits/kit-backgrounds/GradientBackground'
import { ParticleField } from '../kits/kit-backgrounds/ParticleField'
import { GridPattern } from '../kits/kit-backgrounds/GridPattern'
import { FilmGrain } from '../kits/kit-cinema/FilmGrain'
import { Vignette } from '../kits/kit-cinema/Vignette'
import { LightSweep } from '../kits/kit-cinema/LightSweep'
import { FloatingOrbs } from '../kits/kit-cinema/FloatingOrbs'
import { ScalePop } from '../kits/kit-motion/ScalePop'
import { NotificationToast } from '../kits/kit-ui/NotificationToast'
import { ForgeTerminal } from '../kits/kit-lyra/ForgeTerminal'
import { ForgeArchDiagram } from '../kits/kit-lyra/ForgeArchDiagram'
import { LyraLogo } from '../kits/kit-lyra/LyraLogo'

// ─── Forge palette ─────────────────────────────────────────────────────────────
const BG = '#0a0a0f'
const ORANGE = '#e85d04'
const EMBER = '#f97316'
const WHITE = '#fafafa'
const GRAY = '#6b7280'
const GRAY2 = '#9ca3af'
const BORDER = '#2a2a35'

// ─── Typography — swap this constant for font variations ────────────────────────
const HEADING_FONT = "'Outfit', sans-serif"
const HEADING_WEIGHT = 800

// ─── Reusable badge ────────────────────────────────────────────────────────────
const ForgeBadge: React.FC<{
  label: string
  delay?: number
  style?: React.CSSProperties
}> = ({ label, delay = 0, style }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const p = sprng(frame, fps, { damping: 10, stiffness: 130 }, delay)

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 11,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: ORANGE,
        border: `1px solid rgba(232,93,4,0.3)`,
        background: 'rgba(232,93,4,0.08)',
        padding: '5px 14px',
        borderRadius: 3,
        opacity: p,
        transform: `scale(${interpolate(p, [0, 1], [0.5, 1])})`,
        ...style,
      }}
    >
      {label}
    </div>
  )
}

// ─── S01: Hook — The Void (f 0–150 · 5 s) ─────────────────────────────────────
const S01Hook: React.FC = () => {
  const frame = useCurrentFrame()

  return (
    <AbsoluteFill style={{ background: BG }}>
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 36,
          padding: '0 140px',
        }}
      >
        {/* Line 1 — glitch chaos → settle */}
        <GlitchText
          text="YOUR AI ASSISTANT KNOWS NOTHING ABOUT YOU."
          settleAt={60}
          color={WHITE}
          style={{
            fontSize: 38,
            textAlign: 'center',
            letterSpacing: '0.03em',
            fontFamily: HEADING_FONT,
            fontWeight: HEADING_WEIGHT,
          }}
        />

        {/* Line 2 — slides up after glitch settles */}
        <div
          style={{
            opacity: cInterpolate(frame, [80, 110], [0, 1]),
            transform: `translateY(${cInterpolate(frame, [80, 110], [24, 0])}px)`,
          }}
        >
          <span
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 21,
              color: GRAY2,
              letterSpacing: '0.06em',
            }}
          >
            Tomorrow it will know nothing again.
          </span>
        </div>
      </AbsoluteFill>

      {/* Blinking cursor — bottom center */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: Math.floor(frame / 15) % 2 === 0 ? 0.55 : 0,
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 22,
          color: ORANGE,
        }}
      >
        ▋
      </div>

      {/* Logo watermark — top left */}
      <div
        style={{
          position: 'absolute',
          top: 48,
          left: 56,
          opacity: cInterpolate(frame, [0, 25], [0, 0.45]),
        }}
      >
        <LyraLogo size={48} delay={5} />
      </div>

      <FilmGrain opacity={0.06} />
      <Vignette intensity={0.75} />
    </AbsoluteFill>
  )
}

// ─── Brand icons (monochrome, viewBox 0 0 24 24) ──────────────────────────────
// Paths from simple-icons (MIT license)
const BRAND_ICONS = {
  openai: 'M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z',
  anthropic: 'M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z',
  n8n: 'M21.4737 5.6842c-1.1772 0-2.1663.8051-2.4468 1.8947h-2.8955c-1.235 0-2.289.893-2.492 2.111l-.1038.623a1.263 1.263 0 0 1-1.246 1.0555H11.289c-.2805-1.0896-1.2696-1.8947-2.4468-1.8947s-2.1663.8051-2.4467 1.8947H4.973c-.2805-1.0896-1.2696-1.8947-2.4468-1.8947C1.1311 9.4737 0 10.6047 0 12s1.131 2.5263 2.5263 2.5263c1.1772 0 2.1663-.8051 2.4468-1.8947h1.4223c.2804 1.0896 1.2696 1.8947 2.4467 1.8947 1.1772 0 2.1663-.8051 2.4468-1.8947h1.0008a1.263 1.263 0 0 1 1.2459 1.0555l.1038.623c.203 1.218 1.257 2.111 2.492 2.111h.3692c.2804 1.0895 1.2696 1.8947 2.4468 1.8947 1.3952 0 2.5263-1.131 2.5263-2.5263s-1.131-2.5263-2.5263-2.5263c-1.1772 0-2.1664.805-2.4468 1.8947h-.3692a1.263 1.263 0 0 1-1.246-1.0555l-.1037-.623A2.52 2.52 0 0 0 13.9607 12a2.52 2.52 0 0 0 .821-1.4794l.1038-.623a1.263 1.263 0 0 1 1.2459-1.0555h2.8955c.2805 1.0896 1.2696 1.8947 2.4468 1.8947 1.3952 0 2.5263-1.131 2.5263-2.5263s-1.131-2.5263-2.5263-2.5263m0 1.2632a1.263 1.263 0 0 1 1.2631 1.2631 1.263 1.263 0 0 1-1.2631 1.2632 1.263 1.263 0 0 1-1.2632-1.2632 1.263 1.263 0 0 1 1.2632-1.2631M2.5263 10.7368A1.263 1.263 0 0 1 3.7895 12a1.263 1.263 0 0 1-1.2632 1.2632A1.263 1.263 0 0 1 1.2632 12a1.263 1.263 0 0 1 1.2631-1.2632m6.3158 0A1.263 1.263 0 0 1 10.1053 12a1.263 1.263 0 0 1-1.2632 1.2632A1.263 1.263 0 0 1 7.579 12a1.263 1.263 0 0 1 1.2632-1.2632m10.1053 3.7895a1.263 1.263 0 0 1 1.2631 1.2632 1.263 1.263 0 0 1-1.2631 1.2631 1.263 1.263 0 0 1-1.2632-1.2631 1.263 1.263 0 0 1 1.2632-1.2632',
} as const

const BrandIcon: React.FC<{ path: string; size?: number; color?: string }> = ({
  path,
  size = 40,
  color = WHITE,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d={path} />
  </svg>
)

// ─── S02: Problem — The Reset (f 150–450 · 10 s) ──────────────────────────────
const COMPETITOR_CARDS = [
  {
    name: 'ChatGPT',
    iconPath: BRAND_ICONS.openai,
    sub: 'Cloud · Resets every session',
    dissolveAt: 150,
  },
  {
    name: 'Claude.ai',
    iconPath: BRAND_ICONS.anthropic,
    sub: 'Subscription · No persistent memory',
    dissolveAt: 175,
  },
  {
    name: 'n8n Cloud',
    iconPath: BRAND_ICONS.n8n,
    sub: 'Managed · Your data, their server',
    dissolveAt: 200,
  },
]

const VO_LINES = [
  { text: 'Cloud tools reset.', start: 20 },
  { text: 'Subscriptions expire.', start: 60 },
  { text: 'Your context vanishes.', start: 100 },
  { text: 'Your data lives on someone else\'s server.', start: 145 },
]

const S02Problem: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  return (
    <AbsoluteFill style={{ background: BG }}>
      <GridPattern cellSize={48} color="rgba(255,255,255,0.04)" animate />

      {/* Competitor cards */}
      {COMPETITOR_CARDS.map((card, i) => {
        const entranceP = sprng(frame, fps, { damping: 14, stiffness: 80 }, i * 20)
        const dissolveP = cInterpolate(frame, [card.dissolveAt, card.dissolveAt + 80], [0, 1])
        const redGlow = Math.sin(dissolveP * Math.PI) // peaks at midpoint then fades
        const cardOpacity = entranceP * Math.max(0, 1 - dissolveP * 1.3)

        return (
          <div
            key={card.name}
            style={{
              position: 'absolute',
              left: `${20 + i * 27}%`,
              top: '44%',
              transform: `translate(-50%, -50%) scale(${interpolate(entranceP, [0, 1], [0.75, 1])}) translateY(${Math.sin(frame * 0.02 + i * 1.4) * 7}px)`,
              opacity: cardOpacity,
              background: 'rgba(12,12,22,0.92)',
              border: `1px solid ${dissolveP > 0 ? `rgba(239,68,68,${redGlow * 0.55})` : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 14,
              padding: '22px 30px',
              boxShadow:
                dissolveP > 0
                  ? `0 0 ${38 * redGlow}px rgba(239,68,68,0.25), 0 8px 32px rgba(0,0,0,0.5)`
                  : `0 8px 32px rgba(0,0,0,0.45)`,
              backdropFilter: 'blur(12px)',
              minWidth: 210,
              textAlign: 'center',
            }}
          >
            <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'center', opacity: 0.75 }}>
              <BrandIcon path={card.iconPath} size={42} />
            </div>
            <div
              style={{
                fontFamily: HEADING_FONT,
                fontWeight: HEADING_WEIGHT,
                fontSize: 22,
                color: WHITE,
              }}
            >
              {card.name}
            </div>
            <div
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 11,
                color: GRAY,
                marginTop: 7,
                lineHeight: 1.5,
              }}
            >
              {card.sub}
            </div>
            {dissolveP > 0.3 && (
              <div
                style={{
                  marginTop: 12,
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 10,
                  color: `rgba(239,68,68,${redGlow * 0.9})`,
                  letterSpacing: '0.14em',
                }}
              >
                SESSION EXPIRED
              </div>
            )}
          </div>
        )
      })}

      {/* VO subtitle lines */}
      <div
        style={{
          position: 'absolute',
          bottom: 100,
          left: 0,
          right: 0,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          alignItems: 'center',
        }}
      >
        {VO_LINES.map((line) => (
          <div
            key={line.text}
            style={{
              opacity: cInterpolate(frame, [line.start, line.start + 22], [0, 1]),
              fontFamily: HEADING_FONT,
              fontSize: 28,
              color: GRAY2,
              fontWeight: 500,
            }}
          >
            {line.text}
          </div>
        ))}
      </div>

      <FilmGrain opacity={0.04} />
      <Vignette intensity={0.55} />
    </AbsoluteFill>
  )
}

// ─── S03: Solution Reveal — Lyra Online (f 450–750 · 10 s) ────────────────────
const BOOT_LINES = [
  { text: 'connecting adapters...', type: 'info' as const, delay: 16 },
  { text: 'hub online', type: 'ok' as const, delay: 30 },
  { text: 'memory loaded — 47 episodic entries', type: 'ok' as const, delay: 46 },
  { text: '3 agents active', type: 'ok' as const, delay: 62 },
]

const S03Reveal: React.FC = () => {
  const frame = useCurrentFrame()

  const glowOpacity = cInterpolate(frame, [55, 180], [0, 1])
  const glowSize = cInterpolate(frame, [55, 200], [80, 960])
  const termOpacity = cInterpolate(frame, [0, 18], [0, 1])
  const termFadeOut = cInterpolate(frame, [130, 170], [1, 0])

  return (
    <AbsoluteFill style={{ background: BG }}>
      {/* Orange radial glow — grows on reveal */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: glowSize,
          height: glowSize,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(232,93,4,0.2) 0%, transparent 70%)`,
          transform: 'translate(-50%, -50%)',
          opacity: glowOpacity,
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      {/* Particle field — forge orange sparks */}
      <div style={{ opacity: cInterpolate(frame, [45, 130], [0, 0.5]) }}>
        <ParticleField count={55} color={ORANGE} maxSize={3} speed={0.5} direction="float" />
      </div>

      {/* Terminal — fades in then out */}
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          opacity: termOpacity * termFadeOut,
          transform: `translateY(${cInterpolate(frame, [0, 18], [30, 0])}px)`,
        }}
      >
        <div style={{ width: 580 }}>
          <ForgeTerminal command="lyra start" lines={BOOT_LINES} fontSize={15} />
        </div>
      </AbsoluteFill>

      {/* Lyra logo + Outfit wordmark — entrance at f160 */}
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 16,
          pointerEvents: 'none',
        }}
      >
        <LyraLogo size={140} delay={160} />

        {/* LYRA in Outfit 800 with forge glow */}
        <div
          style={{
            opacity: cInterpolate(frame, [185, 215], [0, 1]),
            transform: `translateY(${cInterpolate(frame, [185, 215], [18, 0])}px)`,
            fontFamily: HEADING_FONT,
            fontWeight: HEADING_WEIGHT,
            fontSize: 100,
            letterSpacing: '0.25em',
            paddingLeft: '0.25em',
            color: WHITE,
            textShadow: `0 0 24px rgba(232,93,4,0.45), 0 0 60px rgba(232,93,4,0.18)`,
            lineHeight: 1,
          }}
        >
          LYRA
        </div>

        {/* Category label */}
        <div
          style={{
            opacity: cInterpolate(frame, [215, 245], [0, 1]),
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 13,
            color: GRAY2,
            letterSpacing: '0.34em',
            textTransform: 'uppercase',
          }}
        >
          Personal Intelligence Engine
        </div>
      </AbsoluteFill>

      {/* Light sweep on crystallize */}
      <LightSweep delay={158} color={ORANGE} width={18} />

      <FilmGrain opacity={0.05} />
      <Vignette intensity={0.62} />
    </AbsoluteFill>
  )
}

// ─── S04: Architecture Flash — Hub and Spoke (f 750–1050 · 10 s) ──────────────
const ARCH_BADGES = [
  { label: 'asyncio hub', delay: 80 },
  { label: 'sequential per scope', delay: 108 },
  { label: 'parallel across users', delay: 136 },
]

const S04Architecture: React.FC = () => {
  const frame = useCurrentFrame()

  return (
    <AbsoluteFill style={{ background: BG }}>
      <GridPattern cellSize={48} color="rgba(255,255,255,0.03)" animate />

      {/* Diagram centered */}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <ForgeArchDiagram width={900} height={520} />
      </AbsoluteFill>

      {/* Section label */}
      <div
        style={{
          position: 'absolute',
          top: 56,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: cInterpolate(frame, [0, 22], [0, 1]),
          transform: `translateY(${cInterpolate(frame, [0, 22], [-16, 0])}px)`,
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 12,
          letterSpacing: '0.28em',
          color: GRAY,
          textTransform: 'uppercase',
        }}
      >
        Hub-and-Spoke Architecture
      </div>

      {/* Feature badges */}
      <div
        style={{
          position: 'absolute',
          bottom: 66,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 14,
        }}
      >
        {ARCH_BADGES.map((b) => (
          <ForgeBadge key={b.label} label={b.label} delay={b.delay} />
        ))}
      </div>

      <FloatingOrbs
        count={3}
        color1={ORANGE}
        color2="rgba(232,93,4,0.35)"
        maxSize={280}
        blur={55}
        speed={0.5}
      />
      <FilmGrain opacity={0.04} />
      <Vignette intensity={0.65} />
    </AbsoluteFill>
  )
}

// ─── S05: Extensibility Showcase — Your Rules (f 1050–1350 · 10 s) ─────────────
const TOML_CODE = `[agent.research]
name     = "research-agent"
model    = "qwen3:8b"
system   = "Deep research assistant."
tools    = ["web_search", "read_file"]
memory   = true
scope    = "user"
adapters = ["telegram", "discord"]
enabled  = true`

const S05Extensibility: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const leftP = sprng(frame, fps, { damping: 16 }, 0)
  const rightP = sprng(frame, fps, { damping: 16 }, 20)

  return (
    <AbsoluteFill style={{ background: BG }}>
      <GridPattern cellSize={48} color="rgba(255,255,255,0.03)" />

      <AbsoluteFill
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: '72px 100px',
          gap: 72,
        }}
      >
        {/* Left: TOML code block */}
        <div
          style={{
            flex: 1,
            opacity: leftP,
            transform: `translateX(${interpolate(leftP, [0, 1], [-55, 0])}px)`,
          }}
        >
          <div
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 11,
              color: GRAY,
              letterSpacing: '0.16em',
              marginBottom: 12,
              textTransform: 'uppercase',
            }}
          >
            agents/research.toml
          </div>
          <div
            style={{
              background: '#0d0d14',
              border: `1px solid ${BORDER}`,
              borderRadius: 8,
              padding: '18px 20px',
              boxShadow: `0 0 40px rgba(232,93,4,0.06)`,
            }}
          >
            <Typewriter
              text={TOML_CODE}
              speed={2}
              delay={10}
              cursor
              cursorColor={ORANGE}
              style={{
                whiteSpace: 'pre',
                color: '#94a3b8',
                fontSize: 13,
                lineHeight: 1.75,
              }}
            />
          </div>
          <div style={{ marginTop: 18, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <ForgeBadge label="10 lines of TOML" delay={115} />
            <ForgeBadge label="Swap model. One line." delay={145} />
          </div>
        </div>

        {/* Right: terminal command + notifications */}
        <div
          style={{
            flex: 0.75,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            gap: 20,
            opacity: rightP,
            transform: `translateX(${interpolate(rightP, [0, 1], [55, 0])}px)`,
          }}
        >
          {/* lyra agent init */}
          <div
            style={{
              background: '#0d0d14',
              border: `1px solid ${BORDER}`,
              borderRadius: 8,
              padding: '14px 18px',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 14,
              color: '#94a3b8',
            }}
          >
            <span style={{ color: ORANGE }}>$ </span>
            <Typewriter
              text="lyra agent init research"
              speed={3}
              delay={80}
              cursorColor={ORANGE}
            />
          </div>

          {/* Notification: agent online */}
          <NotificationToast
            icon="✈"
            app="Lyra · Telegram"
            message="research-agent is now online"
            delay={160}
            from="right"
          />

          {/* Notification: memory attached */}
          <NotificationToast
            icon="◉"
            app="Lyra · Memory"
            message="research-agent attached to your scope"
            delay={200}
            from="right"
          />

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ForgeBadge label="New agent. 2 minutes." delay={225} />
          </div>
        </div>
      </AbsoluteFill>

      <FilmGrain opacity={0.04} />
      <Vignette intensity={0.6} />
    </AbsoluteFill>
  )
}

// ─── S06: Tagline + CTA — Compound (f 1350–1560 · 7 s) ────────────────────────
const S06Tagline: React.FC = () => {
  const frame = useCurrentFrame()

  const glowOpacity = cInterpolate(frame, [0, 55], [0, 1])
  const glowSize = cInterpolate(frame, [0, 80], [150, 1050])
  const subOpacity = cInterpolate(frame, [95, 125], [0, 1])
  const subSlide = cInterpolate(frame, [95, 125], [22, 0])
  const ctaOpacity = cInterpolate(frame, [140, 168], [0, 1])

  return (
    <AbsoluteFill style={{ background: BG }}>
      {/* Radial glow build */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: glowSize,
          height: glowSize,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(232,93,4,0.24) 0%, transparent 65%)`,
          transform: 'translate(-50%, -50%)',
          opacity: glowOpacity,
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      <FloatingOrbs
        count={4}
        color1={ORANGE}
        color2="rgba(232,93,4,0.28)"
        maxSize={420}
        blur={80}
        speed={0.5}
      />

      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        {/* Forge diamond logo — prominent centered */}
        <div style={{ opacity: cInterpolate(frame, [0, 30], [0, 1]) }}>
          <LyraLogo size={140} delay={5} />
        </div>

        {/* Main tagline — word-by-word bounce */}
        <StaggeredWords
          text="YOUR INTELLIGENCE, COMPOUNDED"
          variant="bounce"
          delayPerWord={8}
          startAt={10}
          style={{
            fontSize: 68,
            fontFamily: HEADING_FONT,
            fontWeight: HEADING_WEIGHT,
            letterSpacing: '0.02em',
            color: WHITE,
            textAlign: 'center',
          }}
        />

        {/* Subline */}
        <div
          style={{
            opacity: subOpacity,
            transform: `translateY(${subSlide}px)`,
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 19,
            color: ORANGE,
            letterSpacing: '0.14em',
          }}
        >
          Lyra — open source · self-hosted
        </div>

        {/* GitHub CTA */}
        <div
          style={{
            opacity: ctaOpacity,
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 14,
            color: GRAY,
            letterSpacing: '0.18em',
          }}
        >
          github.com/Roxabi/lyra
        </div>
      </AbsoluteFill>

      {/* Corner cursor */}
      <div
        style={{
          position: 'absolute',
          bottom: 70,
          right: 120,
          opacity: Math.floor(frame / 12) % 2 === 0 ? 0.5 : 0,
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 18,
          color: ORANGE,
        }}
      >
        ▋
      </div>

      <FilmGrain opacity={0.06} />
      <Vignette intensity={0.72} />
    </AbsoluteFill>
  )
}

// ─── Main composition ──────────────────────────────────────────────────────────
export const LyraLaunchTrailer: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    {/* S01 Hook         0–150   ( 5 s) */}
    <Sequence from={0} durationInFrames={150}>
      <S01Hook />
    </Sequence>

    {/* S02 Problem     150–450  (10 s) */}
    <Sequence from={150} durationInFrames={300}>
      <S02Problem />
    </Sequence>

    {/* S03 Reveal      450–750  (10 s) */}
    <Sequence from={450} durationInFrames={300}>
      <S03Reveal />
    </Sequence>

    {/* S04 Architecture 750–1050 (10 s) */}
    <Sequence from={750} durationInFrames={300}>
      <S04Architecture />
    </Sequence>

    {/* S05 Extensibility 1050–1350 (10 s) */}
    <Sequence from={1050} durationInFrames={300}>
      <S05Extensibility />
    </Sequence>

    {/* S06 Tagline     1350–1560  (7 s) */}
    <Sequence from={1350} durationInFrames={210}>
      <S06Tagline />
    </Sequence>
  </AbsoluteFill>
)
