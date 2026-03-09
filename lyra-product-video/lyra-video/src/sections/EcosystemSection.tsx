import React from 'react'
import { interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from 'remotion'
import { SlideBase, Glow, Chrome, Badge } from '../components/Atoms'
import {
  ScalePop,
  ParticleField,
  CameraShake,
  SlideIn,
  PulseGlow,
  Typewriter,
  WordByWord,
} from '../components/Motion'
import { COLORS, ACCENT } from '../theme'

const REPOS = [
  {
    name: 'lyra-core',
    desc: 'Orchestration, memoire, raisonnement',
    connections: ['lyra-voice', 'lyra-radar'],
    delay: 30,
    from: 'left' as const,
  },
  {
    name: 'lyra-voice',
    desc: 'Pipeline vocal temps reel',
    connections: ['lyra-core'],
    delay: 48,
    from: 'bottom' as const,
  },
  {
    name: 'lyra-radar',
    desc: 'Veille automatisee, signaux faibles',
    connections: ['lyra-core'],
    delay: 66,
    from: 'right' as const,
  },
]

export const EcosystemSection: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Connection lines animation
  const lineS = spring({ frame: frame - 80, fps, config: { damping: 20, stiffness: 50 } })

  return (
    <SlideBase>
      <Chrome phase="ECOSYSTEM" day="D47-54" accent="cyan" />
      <ParticleField count={40} accent="cyan" speed={1} />
      <Glow accent="cyan" x="50%" y="45%" size="55vw" drift={18} />
      <Glow accent="amber" x="20%" y="75%" size="25vw" drift={10} />

      <CameraShake intensity={1.5}>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          textAlign: 'center', gap: 24, zIndex: 2,
        }}>
          <ScalePop delay={5}>
            <h2 style={{
              fontFamily: 'Cormorant, serif', fontWeight: 700,
              fontSize: 52, lineHeight: 1.1, color: COLORS.cyan,
            }}>
              Emergence, Pas Planification
            </h2>
          </ScalePop>

          <SlideIn delay={12} from="bottom" distance={50}>
            <WordByWord
              text="L'ecosysteme Lyra n'a pas ete designe sur un whiteboard. Il a emerge organiquement — chaque repo est ne d'un besoin reel."
              delay={15}
              wordGap={3}
              highlight={['emerge', 'organiquement', 'besoin', 'reel']}
              highlightColor={COLORS.cyan}
              style={{
                fontSize: 20, lineHeight: 1.65,
                color: COLORS.textSecondary, maxWidth: 700,
                justifyContent: 'center',
              }}
            />
          </SlideIn>

          {/* 3 repo cards — staggered from different directions */}
          <div style={{
            display: 'flex', gap: 32, marginTop: 16, position: 'relative',
          }}>
            {/* Connection lines between cards */}
            <div style={{
              position: 'absolute', top: '50%', left: '20%', right: '20%',
              height: 2, zIndex: 0,
              background: `linear-gradient(90deg, transparent, ${COLORS.cyan}, transparent)`,
              opacity: lineS * 0.5,
              transform: `scaleX(${lineS})`,
              boxShadow: `0 0 15px ${COLORS.cyan}44`,
            }} />

            {REPOS.map((repo) => (
              <SlideIn key={repo.name} delay={repo.delay} from={repo.from} distance={200}>
                <ScalePop delay={repo.delay + 3}>
                  <div style={{
                    display: 'flex', flexDirection: 'column', gap: 12,
                    border: `1px solid ${ACCENT.cyan.border}`,
                    borderRadius: 8, padding: '28px 32px',
                    background: ACCENT.cyan.glow, minWidth: 240,
                    textAlign: 'left', position: 'relative', zIndex: 2,
                  }}>
                    <PulseGlow accent="cyan" speed={60}>
                      <span style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: 18, fontWeight: 600, color: COLORS.cyan,
                      }}>
                        {repo.name}
                      </span>
                    </PulseGlow>
                    <span style={{
                      fontFamily: 'IBM Plex Sans, sans-serif',
                      fontSize: 15, color: COLORS.textSecondary, lineHeight: 1.5,
                    }}>
                      {repo.desc}
                    </span>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {repo.connections.map((c) => (
                        <span key={c} style={{
                          fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                          color: COLORS.cyan, opacity: 0.6,
                          border: `1px solid ${ACCENT.cyan.border}`,
                          borderRadius: 3, padding: '2px 6px',
                        }}>
                          → {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </ScalePop>
              </SlideIn>
            ))}
          </div>

          {/* Quote typewriter */}
          {frame > 130 && (
            <div style={{ marginTop: 16, maxWidth: 600 }}>
              <Typewriter
                text="Les meilleurs ecosystemes ne sont pas planifies. Ils emergent quand les contraintes sont les bonnes."
                delay={130}
                speed={1.2}
                style={{
                  fontFamily: 'Cormorant, serif', fontStyle: 'italic',
                  fontSize: 22, color: COLORS.cyan,
                }}
              />
            </div>
          )}
        </div>
      </CameraShake>
    </SlideBase>
  )
}
