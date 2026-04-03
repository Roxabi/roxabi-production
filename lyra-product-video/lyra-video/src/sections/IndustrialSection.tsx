import React from 'react'
import { interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from 'remotion'
import { SlideBase, Glow, Chrome, Badge } from '../components/Atoms'
import {
  ScalePop,
  ParticleField,
  CameraShake,
  SlideIn,
  ProgressBar,
  Typewriter,
  WordByWord,
} from '../components/Motion'
import { COLORS, ACCENT } from '../theme'

const RULES = [
  { before: 'Code first', after: 'Spec first', delay: 30 },
  { before: 'Manual QA', after: 'CI gate', delay: 42 },
  { before: 'Gut feeling', after: 'Data-driven', delay: 54 },
  { before: 'Ad hoc deploy', after: 'Pipeline auto', delay: 66 },
]

export const IndustrialSection: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  return (
    <SlideBase>
      <Chrome phase="PROCESS" day="D26-31" accent="amber" />
      <ParticleField count={20} accent="amber" speed={0.8} />
      <Glow accent="amber" x="45%" y="50%" size="55vw" drift={16} />
      <Glow accent="orange" x="80%" y="20%" size="28vw" drift={12} />

      <CameraShake intensity={1}>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          textAlign: 'center', gap: 24, zIndex: 2,
        }}>
          <ScalePop delay={5}>
            <h2 style={{
              fontFamily: 'Cormorant, serif', fontWeight: 700,
              fontSize: 56, lineHeight: 1.1, color: COLORS.amber,
            }}>
              Le Virage Industriel
            </h2>
          </ScalePop>

          <SlideIn delay={12} from="bottom" distance={50}>
            <WordByWord
              text="La vitesse artisanale a une limite. Pour scaler, il faut des process. Pas de la bureaucratie — de l'infrastructure mentale."
              delay={15}
              wordGap={3}
              highlight={['process', 'infrastructure']}
              highlightColor={COLORS.amber}
              style={{
                fontSize: 20, lineHeight: 1.65,
                color: COLORS.textSecondary, maxWidth: 700,
                justifyContent: 'center',
              }}
            />
          </SlideIn>

          {/* Before/After rules — sliding from opposite sides */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 14,
            marginTop: 16, width: '100%', maxWidth: 750,
          }}>
            {RULES.map((rule) => {
              const rowProgress = interpolate(
                Math.max(0, frame - rule.delay - 10), [0, 15], [0, 1],
                { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) },
              )
              // Strikethrough animation on the "before" text
              const strikeS = spring({
                frame: frame - rule.delay - 5,
                fps,
                config: { damping: 14, stiffness: 90 },
              })

              return (
                <div
                  key={rule.before}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 20,
                  }}
                >
                  {/* Before — slides from left with strikethrough */}
                  <SlideIn delay={rule.delay} from="left" distance={200}>
                    <div style={{
                      flex: 1, textAlign: 'right', minWidth: 180,
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 17,
                      color: COLORS.textMuted, position: 'relative',
                      display: 'inline-block',
                    }}>
                      {rule.before}
                      <div style={{
                        position: 'absolute', top: '52%', left: 0, right: 0,
                        height: 2, background: COLORS.rose,
                        transform: `scaleX(${strikeS})`, transformOrigin: 'left',
                        boxShadow: `0 0 10px ${COLORS.rose}44`,
                      }} />
                    </div>
                  </SlideIn>

                  {/* Arrow */}
                  <span style={{
                    fontSize: 22, color: ACCENT.amber.color,
                    opacity: rowProgress,
                  }}>→</span>

                  {/* After — slides from right */}
                  <SlideIn delay={rule.delay + 5} from="right" distance={200}>
                    <div style={{
                      flex: 1, textAlign: 'left', minWidth: 180,
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 17,
                      color: COLORS.amber, fontWeight: 600,
                    }}>
                      {rule.after}
                    </div>
                  </SlideIn>
                </div>
              )
            })}
          </div>

          {/* Transformation progress bar */}
          <SlideIn delay={80} from="bottom">
            <ProgressBar delay={85} duration={30} accent="amber" label="Transformation" width={500} />
          </SlideIn>

          {/* Process badges */}
          <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
            <ScalePop delay={95}>
              <Badge accent="amber">Frame → Spec → Plan</Badge>
            </ScalePop>
            <ScalePop delay={103}>
              <Badge accent="amber">CI / CD</Badge>
            </ScalePop>
            <ScalePop delay={111}>
              <Badge accent="amber">Code Review Auto</Badge>
            </ScalePop>
          </div>

          {/* Quote typewriter */}
          {frame > 140 && (
            <div style={{ marginTop: 8, maxWidth: 550 }}>
              <Typewriter
                text="Le process n'est pas l'ennemi de la creativite. C'est son amplificateur."
                delay={140}
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
