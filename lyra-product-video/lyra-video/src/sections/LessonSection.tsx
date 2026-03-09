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
  FlickerReveal,
} from '../components/Motion'
import { COLORS, ACCENT } from '../theme'

const PRINCIPLES = [
  { text: 'Tue tes cheris', delay: 45, from: 'left' as const },
  { text: 'Ship > Perfect', delay: 55, from: 'right' as const },
  { text: 'Emergence > Plan', delay: 65, from: 'left' as const },
  { text: 'Process = Amplificateur', delay: 75, from: 'right' as const },
]

export const LessonSection: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  return (
    <SlideBase>
      <Chrome phase="LESSON" day="---" accent="amber" />
      <ParticleField count={35} accent="amber" speed={0.8} />
      <Glow accent="amber" x="50%" y="45%" size="60vw" drift={18} />
      <Glow accent="orange" x="25%" y="75%" size="25vw" drift={10} />

      <CameraShake intensity={1}>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          textAlign: 'center', gap: 28, zIndex: 2,
        }}>
          <ScalePop delay={5}>
            <PulseGlow accent="amber" speed={50}>
              <h2 style={{
                fontFamily: 'Cormorant, serif', fontWeight: 700,
                fontSize: 60, lineHeight: 1.1, color: COLORS.amber,
              }}>
                La Lecon
              </h2>
            </PulseGlow>
          </ScalePop>

          {/* Big quote — WordByWord for impact */}
          <SlideIn delay={12} from="bottom" distance={50}>
            <div style={{
              maxWidth: 700, paddingLeft: 24,
              borderLeft: `3px solid ${ACCENT.amber.color}`,
            }}>
              <WordByWord
                text="Ce que tu croyais etre un projet perso etait en realite un laboratoire. Chaque erreur etait une experience. Chaque pivot, une decouverte."
                delay={15}
                wordGap={4}
                highlight={['laboratoire', 'experience', 'decouverte']}
                highlightColor={COLORS.amber}
                style={{
                  fontFamily: 'Cormorant, serif', fontStyle: 'italic',
                  fontSize: 30, lineHeight: 1.5, color: COLORS.text,
                }}
              />
            </div>
          </SlideIn>

          {/* 4 principle badges — alternating slide directions */}
          <div style={{
            display: 'flex', gap: 16, marginTop: 16,
            flexWrap: 'wrap', justifyContent: 'center',
          }}>
            {PRINCIPLES.map((p) => (
              <SlideIn key={p.text} delay={p.delay} from={p.from} distance={150}>
                <ScalePop delay={p.delay + 3}>
                  <Badge accent="amber">{p.text}</Badge>
                </ScalePop>
              </SlideIn>
            ))}
          </div>

          {/* Closing statement — typewriter */}
          {frame > 110 && (
            <div style={{ marginTop: 16, maxWidth: 600 }}>
              <Typewriter
                text="52 jours. 6 repos. 1 ecosysteme. Et la conviction que la meilleure facon de predire l'avenir, c'est de le construire."
                delay={110}
                speed={1.2}
                style={{
                  fontFamily: 'IBM Plex Sans, sans-serif',
                  fontSize: 20, lineHeight: 1.65,
                  color: COLORS.textSecondary,
                }}
              />
            </div>
          )}
        </div>
      </CameraShake>
    </SlideBase>
  )
}
