import React from 'react'
import { interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from 'remotion'
import { SlideBase, Glow, Chrome } from '../components/Atoms'
import {
  ScalePop,
  ParticleField,
  CameraShake,
  FlickerReveal,
  PulseGlow,
  Typewriter,
} from '../components/Motion'
import { COLORS, ACCENT } from '../theme'

const TIMELINE = [
  { time: '23:12', text: 'Le dernier test passe.', delay: 20 },
  { time: '01:47', text: 'Refacto du pipeline vocal.', delay: 38 },
  { time: '03:15', text: 'Elle repond. Vraiment.', delay: 56 },
  { time: '04:30', text: 'Premiere conversation complete.', delay: 74 },
  { time: '05:58', text: 'Le soleil se leve. Lyra existe.', delay: 95, special: true },
]

export const TheNightSection: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  return (
    <SlideBase bg="#0a0005">
      <Chrome phase="TURNING_PT" day="D50" accent="rose" />
      <ParticleField count={60} accent="rose" speed={0.4} />
      <Glow accent="rose" x="50%" y="50%" size="65vw" drift={10} />
      <Glow accent="orange" x="80%" y="20%" size="18vw" drift={6} />

      <CameraShake intensity={1}>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          textAlign: 'center', gap: 24, zIndex: 2,
        }}>
          <ScalePop delay={5}>
            <h2 style={{
              fontFamily: 'Cormorant, serif', fontWeight: 700,
              fontSize: 64, lineHeight: 1.1, color: COLORS.rose,
            }}>
              La Nuit
            </h2>
          </ScalePop>

          {/* Timeline */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 0,
            marginTop: 16, position: 'relative', textAlign: 'left',
          }}>
            {/* Vertical line — grows with time */}
            <div style={{
              position: 'absolute', left: 58, top: 0, bottom: 0, width: 1,
              background: `linear-gradient(to bottom, ${COLORS.rose}, ${ACCENT.rose.border}, transparent)`,
              opacity: 0.6,
            }} />

            {TIMELINE.map((entry) => {
              const isSpecial = entry.special
              const textColor = isSpecial ? COLORS.amber : COLORS.text
              const timeColor = isSpecial ? COLORS.amber : COLORS.rose
              const fontSize = isSpecial ? 28 : 24

              // Dot pulse for visible entries
              const dotPulse = isSpecial
                ? 0.7 + Math.sin(frame / 15) * 0.3
                : 0.5 + Math.sin(frame / 25 + TIMELINE.indexOf(entry)) * 0.2

              const entryVisible = frame > entry.delay

              return (
                <div
                  key={entry.time}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 20,
                    padding: isSpecial ? '18px 0' : '12px 0',
                    opacity: entryVisible ? 1 : 0,
                  }}
                >
                  {/* Timestamp — flickers in */}
                  <FlickerReveal delay={entry.delay} duration={10}>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: isSpecial ? 20 : 16,
                      color: timeColor,
                      width: 52, textAlign: 'right', flexShrink: 0,
                      fontWeight: isSpecial ? 700 : 400,
                    }}>
                      {entry.time}
                    </span>
                  </FlickerReveal>

                  {/* Dot — pulses/glows */}
                  {entryVisible && (
                    isSpecial ? (
                      <PulseGlow accent="amber" speed={20}>
                        <div style={{
                          width: 12, height: 12, borderRadius: '50%',
                          background: COLORS.amber, flexShrink: 0,
                          boxShadow: `0 0 20px ${COLORS.amber}, 0 0 40px ${COLORS.amber}44`,
                        }} />
                      </PulseGlow>
                    ) : (
                      <div style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: COLORS.rose, flexShrink: 0,
                        opacity: dotPulse,
                        boxShadow: `0 0 ${12 * dotPulse}px ${COLORS.rose}`,
                      }} />
                    )
                  )}

                  {/* Text — typewriter effect */}
                  {entryVisible && (
                    isSpecial ? (
                      <PulseGlow accent="amber" speed={30}>
                        <Typewriter
                          text={entry.text}
                          delay={entry.delay + 5}
                          speed={1}
                          style={{
                            fontFamily: 'Cormorant, serif', fontStyle: 'italic',
                            fontSize, color: textColor, fontWeight: 700,
                          }}
                        />
                      </PulseGlow>
                    ) : (
                      <Typewriter
                        text={entry.text}
                        delay={entry.delay + 5}
                        speed={1.2}
                        style={{
                          fontFamily: 'Cormorant, serif', fontStyle: 'italic',
                          fontSize, color: textColor,
                        }}
                      />
                    )
                  )}
                </div>
              )
            })}
          </div>

          {/* Closing quote — types slowly */}
          {frame > 160 && (
            <div style={{ marginTop: 24, maxWidth: 650 }}>
              <Typewriter
                text="Il y a des nuits ou tu sais que quelque chose vient de changer. Tu ne peux pas l'expliquer. Tu le sens."
                delay={160}
                speed={1}
                style={{
                  fontFamily: 'Cormorant, serif', fontStyle: 'italic',
                  fontSize: 24, color: COLORS.rose,
                }}
              />
            </div>
          )}
        </div>
      </CameraShake>
    </SlideBase>
  )
}
