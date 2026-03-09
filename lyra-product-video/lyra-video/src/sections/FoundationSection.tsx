import React from 'react'
import { interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from 'remotion'
import { SlideBase, Glow, Chrome, Badge } from '../components/Atoms'
import {
  ScalePop,
  ParticleField,
  CameraShake,
  SlideIn,
  NumberReveal,
  WordByWord,
  ProgressBar,
  Typewriter,
  AnimatedCounter,
} from '../components/Motion'
import { COLORS, ACCENT } from '../theme'

const MODULES = [
  { name: 'Config', delay: 85 },
  { name: 'Types', delay: 93 },
  { name: 'Prompts', delay: 101 },
  { name: 'Utils', delay: 109 },
]

export const FoundationSection: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Arrow animation — punches in
  const arrowS = spring({ frame: frame - 50, fps, config: { damping: 8, stiffness: 120, mass: 0.6 } })

  return (
    <SlideBase>
      <Chrome phase="COMPOUND" day="D09-12" accent="amber" />
      <ParticleField count={30} accent="amber" speed={1.2} />
      <Glow accent="amber" x="50%" y="45%" size="60vw" drift={20} />
      <Glow accent="orange" x="15%" y="75%" size="25vw" drift={10} />

      <CameraShake intensity={1.5}>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          textAlign: 'center', gap: 24, zIndex: 2,
        }}>
          <ScalePop delay={5}>
            <h2 style={{
              fontFamily: 'Cormorant, serif', fontWeight: 700,
              fontSize: 52, lineHeight: 1.1, color: COLORS.amber,
            }}>
              _shared/ — La Fondation Invisible
            </h2>
          </ScalePop>

          <SlideIn delay={15} from="bottom" distance={60}>
            <WordByWord
              text="Un repertoire partage entre tous les repos. Les modules communs, extraits et mutualises, ont divise le temps d'integration par 24."
              delay={18}
              wordGap={3}
              highlight={['mutualises', '24']}
              highlightColor={COLORS.amber}
              style={{
                fontSize: 20, lineHeight: 1.65,
                color: COLORS.textSecondary, maxWidth: 700,
                justifyContent: 'center',
              }}
            />
          </SlideIn>

          {/* Big number comparison — dramatic */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 60, marginTop: 16,
          }}>
            {/* BEFORE: 240 minutes */}
            <SlideIn delay={25} from="left" distance={300}>
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              }}>
                <NumberReveal value="240" delay={28} color={COLORS.rose} size={110} />
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 13,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: COLORS.textMuted,
                }}>
                  minutes avant
                </span>
              </div>
            </SlideIn>

            {/* Arrow — punches in like PivotSection */}
            <div style={{
              fontSize: 72, color: ACCENT.amber.color,
              opacity: arrowS,
              transform: `translateX(${interpolate(arrowS, [0, 1], [-60, 0])}px) scale(${interpolate(arrowS, [0, 1], [0.3, 1])})`,
              filter: `blur(${interpolate(arrowS, [0, 1], [8, 0])}px)`,
            }}>
              →
            </div>

            {/* AFTER: 10 minutes */}
            <SlideIn delay={40} from="right" distance={300}>
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              }}>
                <NumberReveal value="10" delay={43} color={COLORS.amber} size={110} />
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 13,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: COLORS.textMuted,
                }}>
                  minutes apres
                </span>
              </div>
            </SlideIn>
          </div>

          {/* Progress bars */}
          <div style={{ display: 'flex', gap: 40, marginTop: 8 }}>
            <SlideIn delay={60} from="bottom">
              <ProgressBar delay={65} duration={30} accent="rose" label="Temps avant" width={220} />
            </SlideIn>
            <SlideIn delay={68} from="bottom">
              <ProgressBar delay={73} duration={30} accent="amber" label="Reduction -96%" width={220} />
            </SlideIn>
          </div>

          {/* Module badges — staggered ScalePop */}
          <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
            {MODULES.map((mod) => (
              <ScalePop key={mod.name} delay={mod.delay}>
                <Badge accent="amber">{mod.name}</Badge>
              </ScalePop>
            ))}
          </div>

          {/* Quote typewriter */}
          {frame > 130 && (
            <div style={{ marginTop: 10, maxWidth: 600 }}>
              <Typewriter
                text="Les modules partages sont l'interet compose du code. Chaque nouveau repo demarre avec une longueur d'avance."
                delay={130}
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
