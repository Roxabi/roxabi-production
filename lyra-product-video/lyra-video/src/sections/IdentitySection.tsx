import React from 'react'
import { interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from 'remotion'
import { SlideBase, Glow, Chrome, Badge } from '../components/Atoms'
import {
  ScalePop,
  ParticleField,
  CameraShake,
  SlideIn,
  FlickerReveal,
  PulseGlow,
  Typewriter,
  WordByWord,
} from '../components/Motion'
import { COLORS, ACCENT } from '../theme'

export const IdentitySection: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Strikethrough on "Solene"
  const strikeS = spring({ frame: frame - 30, fps, config: { damping: 12, stiffness: 90 } })
  // Arrow punch
  const arrowS = spring({ frame: frame - 40, fps, config: { damping: 8, stiffness: 120, mass: 0.6 } })
  // Lyra reveal
  const lyraS = spring({ frame: frame - 48, fps, config: { damping: 10, stiffness: 80 } })

  return (
    <SlideBase>
      <Chrome phase="IDENTITY" day="D50" accent="amber" />
      <ParticleField count={30} accent="amber" speed={1} />
      <Glow accent="amber" x="50%" y="45%" size="55vw" drift={16} />
      <Glow accent="orange" x="70%" y="70%" size="25vw" drift={10} />

      <CameraShake intensity={1.5}>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          textAlign: 'center', gap: 24, zIndex: 2,
        }}>
          <SlideIn delay={3} from="top" distance={80}>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 14,
              letterSpacing: '0.15em', textTransform: 'uppercase',
              color: COLORS.textMuted,
            }}>
              L'electron libre
            </span>
          </SlideIn>

          {/* Name transition — dramatic */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 60, marginTop: 10,
          }}>
            {/* Solene (crossed out) */}
            <SlideIn delay={15} from="left" distance={250}>
              <div style={{
                position: 'relative', fontFamily: 'Cormorant, serif',
                fontWeight: 700, fontSize: 80, color: COLORS.textMuted,
              }}>
                Solene
                <div style={{
                  position: 'absolute', top: '52%', left: -8, right: -8,
                  height: 4, background: COLORS.rose,
                  transform: `scaleX(${strikeS})`, transformOrigin: 'left',
                  boxShadow: `0 0 20px ${COLORS.rose}`,
                }} />
              </div>
            </SlideIn>

            {/* Arrow — punches in */}
            <div style={{
              fontSize: 56, color: ACCENT.amber.color,
              opacity: arrowS,
              transform: `translateX(${interpolate(arrowS, [0, 1], [-40, 0])}px) scale(${interpolate(arrowS, [0, 1], [0.3, 1])})`,
              filter: `blur(${interpolate(arrowS, [0, 1], [6, 0])}px)`,
            }}>
              →
            </div>

            {/* Lyra — reveals with glow */}
            <SlideIn delay={45} from="right" distance={250}>
              <PulseGlow accent="amber">
                <div style={{
                  fontFamily: 'Cormorant, serif', fontWeight: 700,
                  fontSize: 80, lineHeight: 1,
                  opacity: lyraS,
                  transform: `scale(${interpolate(lyraS, [0, 1], [0.7, 1])})`,
                  background: `linear-gradient(135deg, ${COLORS.amber}, ${COLORS.orange})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  Lyra
                </div>
              </PulseGlow>
            </SlideIn>
          </div>

          <SlideIn delay={55} from="bottom" distance={40}>
            <WordByWord
              text="Un nom generique ne suffit pas. L'identite est le premier acte de design. Lyra evoque la constellation, la lyre — la musique et la direction."
              delay={58}
              wordGap={3}
              highlight={['Lyra', 'constellation', 'lyre', 'musique', 'direction']}
              highlightColor={COLORS.amber}
              style={{
                fontSize: 20, lineHeight: 1.65,
                color: COLORS.textSecondary, maxWidth: 650,
                justifyContent: 'center',
              }}
            />
          </SlideIn>

          {/* Meaning badges — staggered */}
          <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
            <ScalePop delay={95}>
              <Badge accent="amber">Constellation</Badge>
            </ScalePop>
            <ScalePop delay={103}>
              <Badge accent="amber">Lyre</Badge>
            </ScalePop>
            <ScalePop delay={111}>
              <Badge accent="amber">Lumiere</Badge>
            </ScalePop>
          </div>

          {/* Quote typewriter */}
          {frame > 130 && (
            <div style={{ marginTop: 10, maxWidth: 550 }}>
              <Typewriter
                text="Nommer, c'est donner vie. A partir de ce moment, le projet avait une ame."
                delay={130}
                speed={1.2}
                style={{
                  fontFamily: 'Cormorant, serif', fontStyle: 'italic',
                  fontSize: 24, color: COLORS.amber,
                }}
              />
            </div>
          )}
        </div>
      </CameraShake>
    </SlideBase>
  )
}
