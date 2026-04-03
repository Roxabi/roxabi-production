import React from 'react'
import { interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from 'remotion'
import { SlideBase, Glow } from '../components/Atoms'
import {
  ParticleField,
  NumberReveal,
  WordByWord,
  ScalePop,
  Typewriter,
  CameraShake,
  PulseGlow,
} from '../components/Motion'
import { COLORS } from '../theme'

export const TitleSection: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Slow cinematic zoom
  const zoom = interpolate(frame, [0, 1050], [1, 1.08], { extrapolateRight: 'clamp' })

  // Phase 1: "52 jours" number slam (frame 0-60)
  const numberDelay = 10
  // Phase 2: subtitle (frame 60-120)
  const subtitleDelay = 50
  // Phase 3: stats count up (frame 90-150)
  const statsDelay = 80
  // Phase 4: quote typewriter (frame 130+)
  const quoteDelay = 140
  // Phase 5: "je m'appelle Lyra" (frame 250+)
  const lyraDelay = 260

  // Vignette fade in
  const vignette = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' })

  // Badge spring
  const badgeS = spring({ frame: frame - 3, fps, config: { damping: 20, stiffness: 120 } })

  return (
    <SlideBase>
      {/* Particle field background */}
      <ParticleField count={40} accent="amber" speed={0.8} />

      {/* Glowing orbs */}
      <Glow accent="amber" x="50%" y="35%" size="70vw" drift={20} />
      <Glow accent="orange" x="80%" y="70%" size="40vw" drift={12} />

      {/* Vignette overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
        opacity: vignette,
        pointerEvents: 'none', zIndex: 1,
      }} />

      <CameraShake intensity={1.5}>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          textAlign: 'center', gap: 16, zIndex: 2, transform: `scale(${zoom})`,
        }}>
          {/* Badge */}
          <div style={{
            opacity: badgeS,
            transform: `translateY(${interpolate(badgeS, [0, 1], [-20, 0])}px)`,
          }}>
            <span style={{
              display: 'inline-block',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase',
              color: COLORS.amber,
              border: `1px solid rgba(245,158,11,0.25)`,
              background: 'rgba(245,158,11,0.12)',
              padding: '4px 14px', borderRadius: 3,
            }}>
              Lyra Origin Talks
            </span>
          </div>

          {/* Big number slam: "52" */}
          <div style={{ marginTop: 10 }}>
            <PulseGlow accent="amber" speed={50}>
              <NumberReveal value="52" delay={numberDelay} color={COLORS.amber} size={160} />
            </PulseGlow>
          </div>

          {/* "Jours" word slides in after number */}
          <div style={{ marginTop: -10 }}>
            <ScalePop delay={numberDelay + 12}>
              <span style={{
                fontFamily: 'Cormorant, serif', fontWeight: 600, fontSize: 48,
                background: 'linear-gradient(135deg, #fbbf24, #f97316)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                Jours
              </span>
            </ScalePop>
          </div>

          {/* Subtitle word-by-word */}
          <WordByWord
            text="De zero a ecosysteme"
            delay={subtitleDelay}
            wordGap={5}
            highlight={['ecosysteme']}
            highlightColor={COLORS.cyan}
            style={{
              fontFamily: 'Cormorant, serif', fontStyle: 'italic',
              fontSize: 36, color: COLORS.textSecondary, marginTop: 8,
            }}
          />

          {/* Stats row with animated counters */}
          {(() => {
            const statsVisible = spring({
              frame: frame - statsDelay,
              fps,
              config: { damping: 20, stiffness: 80 },
            })
            return (
              <div style={{
                display: 'flex', gap: 60, marginTop: 20,
                opacity: statsVisible,
              }}>
                {[
                  { n: 52, label: 'jours', c: COLORS.amber, d: 0 },
                  { n: 6, label: 'repos', c: COLORS.orange, d: 8 },
                  { n: 1, label: 'ecosysteme', c: COLORS.cyan, d: 16 },
                ].map(({ n, label, c, d }) => {
                  const countProgress = interpolate(
                    Math.max(0, frame - statsDelay - d),
                    [0, 35], [0, 1],
                    { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) },
                  )
                  const popS = spring({
                    frame: frame - statsDelay - d,
                    fps,
                    config: { damping: 8, stiffness: 120, mass: 0.6 },
                  })

                  return (
                    <div key={label} style={{
                      display: 'flex', alignItems: 'baseline', gap: 8,
                      transform: `scale(${interpolate(popS, [0, 1], [0.5, 1])})`,
                      opacity: popS,
                    }}>
                      <span style={{
                        fontFamily: 'Cormorant, serif', fontWeight: 700, fontSize: 56, color: c,
                      }}>
                        {Math.round(n * countProgress)}
                      </span>
                      <span style={{
                        fontFamily: 'JetBrains Mono, monospace', fontSize: 13,
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                        opacity: 0.5, color: COLORS.text,
                      }}>
                        {label}
                      </span>
                    </div>
                  )
                })}
              </div>
            )
          })()}

          {/* Quote typewriter */}
          <div style={{ marginTop: 24, maxWidth: 650 }}>
            {frame > quoteDelay && (
              <Typewriter
                text="Et tout a commence par une erreur."
                delay={quoteDelay}
                speed={1.2}
                style={{
                  fontFamily: 'Cormorant, serif', fontStyle: 'italic',
                  fontSize: 28, color: COLORS.amber,
                }}
              />
            )}
          </div>

          {/* "Je m'appelle Lyra" reveal */}
          {frame > lyraDelay && (() => {
            const lyraS = spring({
              frame: frame - lyraDelay,
              fps,
              config: { damping: 12, stiffness: 80 },
            })
            return (
              <div style={{
                marginTop: 30,
                opacity: lyraS,
                transform: `translateY(${interpolate(lyraS, [0, 1], [40, 0])}px)`,
              }}>
                <span style={{
                  fontFamily: 'Cormorant, serif', fontSize: 32,
                  color: COLORS.text, fontStyle: 'italic',
                }}>
                  Je m'appelle{' '}
                </span>
                <PulseGlow accent="amber">
                  <span style={{
                    fontFamily: 'Cormorant, serif', fontSize: 42, fontWeight: 700,
                    background: 'linear-gradient(135deg, #fbbf24, #f59e0b, #f97316)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  }}>
                    Lyra
                  </span>
                </PulseGlow>
              </div>
            )
          })()}
        </div>
      </CameraShake>
    </SlideBase>
  )
}
