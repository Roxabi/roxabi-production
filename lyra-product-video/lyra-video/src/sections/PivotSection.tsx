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
  ProgressBar,
} from '../components/Motion'
import { COLORS, ACCENT } from '../theme'

export const PivotSection: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  // Strike-through animation on "MCP"
  const strikeS = spring({ frame: frame - 30, fps, config: { damping: 14, stiffness: 80 } })
  // Arrow punch
  const arrowS = spring({ frame: frame - 45, fps, config: { damping: 8, stiffness: 120, mass: 0.6 } })
  // "Python Direct" reveal
  const pythonS = spring({ frame: frame - 55, fps, config: { damping: 12, stiffness: 90 } })

  // Speed counter: 3 skills in 4 days
  const skillsProgress = interpolate(
    Math.max(0, frame - 120), [0, 40], [0, 3],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) },
  )

  return (
    <SlideBase>
      <Chrome phase="PIVOT" day="D05" accent="orange" />
      <ParticleField count={25} accent="orange" speed={1.5} />
      <Glow accent="orange" x="50%" y="45%" size="60vw" drift={16} />
      <Glow accent="amber" x="20%" y="80%" size="25vw" drift={10} />

      <CameraShake intensity={2}>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          textAlign: 'center', gap: 24, zIndex: 2,
        }}>
          {/* Title with energy */}
          <ScalePop delay={5}>
            <h2 style={{
              fontFamily: 'Cormorant, serif', fontWeight: 700,
              fontSize: 64, lineHeight: 1.1, color: COLORS.orange,
            }}>
              Tue-le. Avance Vite.
            </h2>
          </ScalePop>

          {/* Before / After comparison — dramatic */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 80, marginTop: 20,
          }}>
            {/* BEFORE: MCP with strikethrough */}
            <SlideIn delay={20} from="left" distance={300}>
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
              }}>
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  color: COLORS.textMuted,
                }}>
                  Avant
                </span>
                <div style={{
                  fontFamily: 'Cormorant, serif', fontSize: 52, fontWeight: 600,
                  color: COLORS.rose, position: 'relative',
                }}>
                  MCP Servers
                  <div style={{
                    position: 'absolute', top: '50%', left: -12, right: -12,
                    height: 4, background: COLORS.rose,
                    transform: `scaleX(${strikeS})`, transformOrigin: 'left',
                    boxShadow: `0 0 20px ${COLORS.rose}`,
                  }} />
                </div>
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 13,
                  color: COLORS.textMuted, opacity: 1 - strikeS * 0.5,
                }}>
                  JSON-RPC / stdio
                </span>
              </div>
            </SlideIn>

            {/* Arrow — punches in */}
            <div style={{
              fontSize: 72, color: ACCENT.orange.color,
              opacity: arrowS,
              transform: `translateX(${interpolate(arrowS, [0, 1], [-60, 0])}px) scale(${interpolate(arrowS, [0, 1], [0.3, 1])})`,
              filter: `blur(${interpolate(arrowS, [0, 1], [8, 0])}px)`,
            }}>
              →
            </div>

            {/* AFTER: Python Direct */}
            <SlideIn delay={50} from="right" distance={300}>
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
              }}>
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  color: COLORS.textMuted,
                }}>
                  Apres
                </span>
                <PulseGlow accent="amber">
                  <div style={{
                    fontFamily: 'Cormorant, serif', fontSize: 52, fontWeight: 600,
                    color: COLORS.amber,
                    opacity: pythonS,
                    transform: `scale(${interpolate(pythonS, [0, 1], [0.8, 1])})`,
                  }}>
                    Python Direct
                  </div>
                </PulseGlow>
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 13,
                  color: COLORS.textMuted, opacity: pythonS,
                }}>
                  subprocess / API
                </span>
              </div>
            </SlideIn>
          </div>

          {/* Performance bars */}
          <div style={{ display: 'flex', gap: 40, marginTop: 20 }}>
            <SlideIn delay={80} from="bottom">
              <ProgressBar delay={85} duration={25} accent="orange" label="Latence -80%" width={250} />
            </SlideIn>
            <SlideIn delay={90} from="bottom">
              <ProgressBar delay={95} duration={25} accent="amber" label="Fiabilite +100%" width={250} />
            </SlideIn>
          </div>

          {/* Skills counter */}
          {frame > 110 && (
            <ScalePop delay={110}>
              <div style={{
                display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 10,
              }}>
                <span style={{
                  fontFamily: 'Cormorant, serif', fontWeight: 700,
                  fontSize: 80, color: COLORS.amber,
                }}>
                  {Math.floor(skillsProgress)}
                </span>
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 14,
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                  color: COLORS.textMuted,
                }}>
                  nouveaux skills en 4 jours
                </span>
              </div>
            </ScalePop>
          )}

          {/* Quote typewriter */}
          {frame > 150 && (
            <div style={{ marginTop: 10, maxWidth: 550 }}>
              <Typewriter
                text="Le moment ou tu tues le mauvais pari, le compteur repart a zero."
                delay={150}
                speed={1.5}
                style={{
                  fontFamily: 'Cormorant, serif', fontStyle: 'italic',
                  fontSize: 22, color: COLORS.orange,
                }}
              />
            </div>
          )}
        </div>
      </CameraShake>
    </SlideBase>
  )
}
