import React from 'react'
import { interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from 'remotion'
import { SlideBase, Glow, Chrome, Badge } from '../components/Atoms'
import {
  ScalePop,
  ParticleField,
  CameraShake,
  SlideIn,
  NumberReveal,
  PulseGlow,
  Typewriter,
  FlickerReveal,
  AnimatedCounter,
} from '../components/Motion'
import { COLORS, ACCENT } from '../theme'

const REPOS = [
  { name: 'voiceCLI', desc: 'Synthese vocale temps reel', tech: 'Python / TTS', icon: '🎙', delay: 40 },
  { name: 'roxabi-plugins', desc: 'Marketplace open-source', tech: 'TypeScript', icon: '🧩', delay: 60 },
  { name: 'claude-config', desc: 'Config AI partagee', tech: 'YAML / JSON', icon: '⚙', delay: 80 },
]

export const TheDaySection: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  // Explosion effect: zoom burst at start
  const burstS = spring({ frame, fps, config: { damping: 15, stiffness: 100 } })
  const burstZoom = interpolate(burstS, [0, 1], [1.15, 1])

  // "3 repos" number
  const repoCountS = spring({
    frame: frame - 15,
    fps,
    config: { damping: 8, stiffness: 100, mass: 0.8 },
  })

  // Timeline progress
  const timelineProgress = interpolate(frame, [35, 250], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })

  return (
    <SlideBase>
      <Chrome phase="EXPLOSION" day="D47" accent="orange" />
      <ParticleField count={50} accent="orange" speed={2} />
      <Glow accent="orange" x="50%" y="40%" size="65vw" drift={20} />
      <Glow accent="amber" x="20%" y="75%" size="30vw" drift={12} />
      <Glow accent="cyan" x="80%" y="20%" size="20vw" drift={8} />

      <CameraShake intensity={frame < 30 ? 4 : 1.5}>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          textAlign: 'center', gap: 20, zIndex: 2,
          transform: `scale(${burstZoom})`,
        }}>
          {/* "28 fevrier" date stamp */}
          <SlideIn delay={3} from="top" distance={100}>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 14,
              letterSpacing: '0.15em', textTransform: 'uppercase',
              color: COLORS.orange, opacity: 0.7,
            }}>
              28 Fevrier 2026
            </span>
          </SlideIn>

          {/* Title with explosion energy */}
          <ScalePop delay={5}>
            <h2 style={{
              fontFamily: 'Cormorant, serif', fontWeight: 700,
              fontSize: 60, lineHeight: 1.1,
              background: 'linear-gradient(135deg, #f97316, #fbbf24, #f59e0b)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Le Jour ou Tout Explose
            </h2>
          </ScalePop>

          {/* Big "3" number slam */}
          <div style={{
            display: 'flex', alignItems: 'baseline', gap: 16,
            opacity: repoCountS,
            transform: `scale(${interpolate(repoCountS, [0, 1], [3, 1])})`,
            filter: `blur(${interpolate(repoCountS, [0, 1], [15, 0])}px)`,
          }}>
            <span style={{
              fontFamily: 'Cormorant, serif', fontWeight: 700,
              fontSize: 100, color: COLORS.orange,
            }}>
              3
            </span>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 16,
              textTransform: 'uppercase', letterSpacing: '0.12em',
              color: COLORS.textMuted,
            }}>
              repos en 24h
            </span>
          </div>

          {/* Timeline bar */}
          <div style={{
            width: 700, height: 2, background: 'rgba(255,255,255,0.08)',
            borderRadius: 1, position: 'relative', marginTop: 10,
          }}>
            <div style={{
              height: '100%', width: `${timelineProgress * 100}%`,
              background: `linear-gradient(90deg, ${COLORS.orange}, ${COLORS.amber})`,
              borderRadius: 1, boxShadow: `0 0 15px ${COLORS.orange}66`,
            }} />
            {/* Timeline dots */}
            {[0, 0.33, 0.66, 1].map((pos, i) => {
              const dotVisible = timelineProgress > pos
              return (
                <div key={i} style={{
                  position: 'absolute', left: `${pos * 100}%`, top: -4,
                  width: 10, height: 10, borderRadius: '50%',
                  background: dotVisible ? COLORS.orange : 'rgba(255,255,255,0.1)',
                  transform: 'translateX(-50%)',
                  boxShadow: dotVisible ? `0 0 12px ${COLORS.orange}` : 'none',
                  transition: 'none',
                }} />
              )
            })}
          </div>

          {/* 3 repo cards — staggered entrance */}
          <div style={{ display: 'flex', gap: 24, marginTop: 16 }}>
            {REPOS.map((repo) => {
              const cardS = spring({
                frame: frame - repo.delay,
                fps,
                config: { damping: 12, stiffness: 80 },
              })

              return (
                <div
                  key={repo.name}
                  style={{
                    display: 'flex', flexDirection: 'column', gap: 10,
                    border: `1px solid ${ACCENT.orange.border}`,
                    borderRadius: 8, padding: '24px 28px',
                    background: ACCENT.orange.glow, minWidth: 210,
                    textAlign: 'left',
                    opacity: cardS,
                    transform: `translateY(${interpolate(cardS, [0, 1], [60, 0])}px) scale(${interpolate(cardS, [0, 1], [0.8, 1])})`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 24 }}>{repo.icon}</span>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 16, fontWeight: 600, color: COLORS.orange,
                    }}>
                      {repo.name}
                    </span>
                  </div>
                  <span style={{
                    fontFamily: 'IBM Plex Sans, sans-serif',
                    fontSize: 14, color: COLORS.textSecondary, lineHeight: 1.5,
                  }}>
                    {repo.desc}
                  </span>
                  <Badge accent="orange">{repo.tech}</Badge>
                </div>
              )
            })}
          </div>

          {/* Bottom quote */}
          {frame > 180 && (
            <div style={{ marginTop: 10, maxWidth: 600 }}>
              <Typewriter
                text="Les ecosystemes n'emergent pas de la planification. Ils emergent de la capitalisation."
                delay={180}
                speed={1.3}
                style={{
                  fontFamily: 'Cormorant, serif', fontStyle: 'italic',
                  fontSize: 22, color: COLORS.amber,
                }}
              />
            </div>
          )}
        </div>
      </CameraShake>
    </SlideBase>
  )
}
