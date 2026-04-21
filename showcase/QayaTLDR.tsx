import React from 'react'
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
} from '../core'
import { cInterpolate } from '../lib'
import { GlitchText } from '../kits/kit-text/GlitchText'
import { StaggeredWords } from '../kits/kit-text/StaggeredWords'
import { GradientBackground } from '../kits/kit-backgrounds/GradientBackground'
import { ParticleField } from '../kits/kit-backgrounds/ParticleField'
import { FilmGrain } from '../kits/kit-cinema/FilmGrain'
import { Vignette } from '../kits/kit-cinema/Vignette'
import { LightSweep } from '../kits/kit-cinema/LightSweep'

// ─── Qaya palette ─────────────────────────────────────────────────────────────
const BG = '#080810'
const CYAN = '#22d3ee'
const PURPLE = '#a855f7'
const ORANGE = '#f97316'
const WHITE = '#fafafa'
const GRAY = '#6b7280'

const HEADING_FONT = "'Outfit', sans-serif"
const HEADING_WEIGHT = 800

// ─── S01: Title Reveal (f 0–150 · 5 s) ─────────────────────────────────────
const S01Title: React.FC = () => {
  const frame = useCurrentFrame()

  return (
    <AbsoluteFill style={{ background: BG }}>
      <GradientBackground
        colors={['#080810', '#0f172a', '#1e1b4b']}
        animate
        speed={0.3}
      />

      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        {/* Glitch title */}
        <GlitchText
          text="QAYA³"
          settleAt={40}
          color={CYAN}
          style={{
            fontSize: 140,
            fontFamily: HEADING_FONT,
            fontWeight: HEADING_WEIGHT,
            letterSpacing: '0.15em',
            textShadow: `0 0 40px rgba(34,211,238,0.5), 0 0 80px rgba(34,211,238,0.3)`,
          }}
        />

        {/* Subtitle fade-in */}
        <div
          style={{
            opacity: cInterpolate(frame, [60, 90], [0, 1]),
            transform: `translateY(${cInterpolate(frame, [60, 90], [20, 0])}px)`,
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 18,
            color: GRAY,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}
        >
          Event-Driven AI Agent Platform
        </div>

        {/* Launch date */}
        <div
          style={{
            opacity: cInterpolate(frame, [100, 130], [0, 1]),
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 14,
            color: ORANGE,
            letterSpacing: '0.3em',
            marginTop: 16,
          }}
        >
          AVRIL 2026
        </div>
      </AbsoluteFill>

      <ParticleField count={30} color={CYAN} maxSize={2} speed={0.3} direction="float" />
      <FilmGrain opacity={0.04} />
      <Vignette intensity={0.7} />
    </AbsoluteFill>
  )
}

// ─── S02: Architecture (f 150–450 · 10 s) ──────────────────────────────────
const ARCH_MODULES = [
  { name: 'ED-LNN', desc: 'Event-Driven', delay: 0 },
  { name: 'ECAD-LNN', desc: 'Causal Attention', delay: 15 },
  { name: 'OAD-LNN', desc: 'Object Attention', delay: 30 },
]

const S02Architecture: React.FC = () => {
  const frame = useCurrentFrame()

  return (
    <AbsoluteFill style={{ background: BG }}>
      <GradientBackground colors={['#080810', '#0c0c18']} animate speed={0.2} />

      {/* Pipeline flow */}
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 120px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40, width: '100%', maxWidth: 900 }}>
          {/* Input row */}
          <div
            style={{
              opacity: cInterpolate(frame, [0, 20], [0, 1]),
              display: 'flex',
              gap: 16,
              justifyContent: 'center',
            }}
          >
            {['Oracles', 'Sources'].map((src, i) => (
              <div
                key={src}
                style={{
                  background: 'rgba(34,211,238,0.1)',
                  border: '1px solid rgba(34,211,238,0.3)',
                  borderRadius: 8,
                  padding: '12px 24px',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 13,
                  color: CYAN,
                }}
              >
                {src} Connector
              </div>
            ))}
          </div>

          {/* Arrow down */}
          <div style={{ textAlign: 'center', opacity: cInterpolate(frame, [25, 40], [0, 1]), color: GRAY, fontSize: 24 }}>
            ↓
          </div>

          {/* Pipeline modules */}
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
            {ARCH_MODULES.map((mod, i) => (
              <div
                key={mod.name}
                style={{
                  opacity: cInterpolate(frame, [mod.delay, mod.delay + 20], [0, 1]),
                  transform: `translateX(${cInterpolate(frame, [mod.delay, mod.delay + 20], [30, 0])}px)`,
                  background: 'rgba(168,85,247,0.08)',
                  border: '1px solid rgba(168,85,247,0.25)',
                  borderRadius: 12,
                  padding: '20px 28px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontFamily: HEADING_FONT, fontWeight: 700, fontSize: 22, color: PURPLE }}>
                  {mod.name}
                </div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: GRAY, marginTop: 6 }}>
                  {mod.desc}
                </div>
              </div>
            ))}
          </div>

          {/* Arrow down */}
          <div style={{ textAlign: 'center', opacity: cInterpolate(frame, [50, 65], [0, 1]), color: GRAY, fontSize: 24 }}>
            ↓
          </div>

          {/* World model output */}
          <div
            style={{
              opacity: cInterpolate(frame, [70, 90], [0, 1]),
              display: 'flex',
              gap: 12,
              justifyContent: 'center',
            }}
          >
            {['WoE (Lived)', 'WoB (Probable)', 'WoG (Creative)'].map((world, i) => (
              <div
                key={world}
                style={{
                  background: 'rgba(249,115,22,0.08)',
                  border: '1px solid rgba(249,115,22,0.25)',
                  borderRadius: 8,
                  padding: '10px 18px',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 12,
                  color: ORANGE,
                }}
              >
                {world}
              </div>
            ))}
          </div>
        </div>
      </AbsoluteFill>

      <FilmGrain opacity={0.03} />
      <Vignette intensity={0.6} />
    </AbsoluteFill>
  )
}

// ─── S03: Launch CTA (f 450–900 · 15 s) ─────────────────────────────────────
const S03Launch: React.FC = () => {
  const frame = useCurrentFrame()

  const glowSize = cInterpolate(frame, [0, 60], [100, 800])
  const glowOpacity = cInterpolate(frame, [0, 80], [0, 0.8])

  return (
    <AbsoluteFill style={{ background: BG }}>
      {/* Radial glow */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: glowSize,
          height: glowSize,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(34,211,238,0.25) 0%, transparent 70%)`,
          transform: 'translate(-50%, -50%)',
          opacity: glowOpacity,
          filter: 'blur(60px)',
        }}
      />

      <ParticleField count={40} color={CYAN} maxSize={3} speed={0.4} direction="float" />

      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 32,
        }}
      >
        {/* Tagline */}
        <StaggeredWords
          text="EVENT STREAMS → LNN COGNITION → EMBODIED AI"
          variant="bounce"
          delayPerWord={6}
          startAt={10}
          style={{
            fontSize: 36,
            fontFamily: HEADING_FONT,
            fontWeight: HEADING_WEIGHT,
            color: WHITE,
            textAlign: 'center',
            letterSpacing: '0.02em',
          }}
        />

        {/* Divider */}
        <div
          style={{
            width: 200,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${CYAN}, transparent)`,
            opacity: cInterpolate(frame, [80, 100], [0, 1]),
          }}
        />

        {/* Launch badge */}
        <div
          style={{
            opacity: cInterpolate(frame, [100, 130], [0, 1]),
            transform: `scale(${cInterpolate(frame, [100, 130], [0.8, 1])})`,
            background: 'rgba(34,211,238,0.1)',
            border: `1px solid ${CYAN}`,
            borderRadius: 8,
            padding: '16px 32px',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 16,
            color: CYAN,
            letterSpacing: '0.2em',
          }}
        >
          LAUNCHING APRIL 2026
        </div>

        {/* Stack badges */}
        <div
          style={{
            opacity: cInterpolate(frame, [140, 170], [0, 1]),
            display: 'flex',
            gap: 12,
            marginTop: 16,
          }}
        >
          {['C#', 'C++', 'Python', 'Discord', 'GPT', 'ElevenLabs'].map((tech) => (
            <span
              key={tech}
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 11,
                color: GRAY,
                padding: '4px 10px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 4,
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </AbsoluteFill>

      <LightSweep delay={60} color={CYAN} width={12} />
      <FilmGrain opacity={0.05} />
      <Vignette intensity={0.75} />
    </AbsoluteFill>
  )
}

// ─── Main composition ──────────────────────────────────────────────────────────
export const QayaTLDR: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    {/* S01 Title      0–150   (5 s) */}
    <Sequence from={0} durationInFrames={150}>
      <S01Title />
    </Sequence>

    {/* S02 Architecture 150–450 (10 s) */}
    <Sequence from={150} durationInFrames={300}>
      <S02Architecture />
    </Sequence>

    {/* S03 Launch    450–900  (15 s) */}
    <Sequence from={450} durationInFrames={450}>
      <S03Launch />
    </Sequence>
  </AbsoluteFill>
)
