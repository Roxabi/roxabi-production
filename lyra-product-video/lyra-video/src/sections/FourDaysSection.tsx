import React from 'react'
import { interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from 'remotion'
import { SlideBase, Glow, Chrome } from '../components/Atoms'
import {
  ScalePop,
  ParticleField,
  CameraShake,
  SlideIn,
  FlickerReveal,
  PulseGlow,
  Typewriter,
  NumberReveal,
  ProgressBar,
} from '../components/Motion'
import { COLORS, ACCENT } from '../theme'

const DAYS = [
  {
    day: 'J+1', title: 'Structure',
    desc: 'Repos crees, _shared/ configure, CI en place.',
    delay: 25, from: 'left' as const,
  },
  {
    day: 'J+2', title: 'Pipeline',
    desc: 'Voice CLI fonctionnel, Whisper + TTS integres.',
    delay: 45, from: 'right' as const,
  },
  {
    day: 'J+3', title: 'Intelligence',
    desc: 'Radar v1 deploye, premiers briefs automatiques.',
    delay: 65, from: 'left' as const,
  },
  {
    day: 'J+4', title: 'Identite',
    desc: 'Lyra nommee, ecosystem connecte, premiere demo.',
    delay: 85, from: 'right' as const,
  },
]

export const FourDaysSection: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Timeline progress bar
  const timelineProgress = interpolate(frame, [20, 200], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })

  return (
    <SlideBase>
      <Chrome phase="OUTCOME" day="D52-55" accent="orange" />
      <ParticleField count={30} accent="orange" speed={1.5} />
      <Glow accent="orange" x="50%" y="45%" size="55vw" drift={16} />
      <Glow accent="amber" x="15%" y="70%" size="28vw" drift={10} />

      <CameraShake intensity={2}>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          textAlign: 'center', gap: 20, zIndex: 2,
        }}>
          <ScalePop delay={5}>
            <h2 style={{
              fontFamily: 'Cormorant, serif', fontWeight: 700,
              fontSize: 56, lineHeight: 1.1, color: COLORS.orange,
            }}>
              Lyra en 4 Jours
            </h2>
          </ScalePop>

          <SlideIn delay={10} from="bottom" distance={40}>
            <p style={{
              fontSize: 20, lineHeight: 1.65,
              color: COLORS.textSecondary, maxWidth: 700,
            }}>
              Du premier commit au premier ecosysteme fonctionnel. Quatre jours de
              sprint final qui cristallisent 50 jours d'apprentissage.
            </p>
          </SlideIn>

          {/* Horizontal timeline bar */}
          <div style={{
            width: 700, height: 3, background: 'rgba(255,255,255,0.06)',
            borderRadius: 2, position: 'relative', marginTop: 12,
          }}>
            <div style={{
              height: '100%',
              width: `${timelineProgress * 100}%`,
              background: `linear-gradient(90deg, ${COLORS.orange}, ${COLORS.amber})`,
              borderRadius: 2,
              boxShadow: `0 0 15px ${COLORS.orange}66`,
            }} />
            {/* Day dots on the timeline */}
            {DAYS.map((entry, i) => {
              const pos = i / (DAYS.length - 1)
              const dotVisible = timelineProgress > pos
              return (
                <div key={entry.day} style={{
                  position: 'absolute', left: `${pos * 100}%`, top: -5,
                  width: 13, height: 13, borderRadius: '50%',
                  background: dotVisible ? COLORS.orange : 'rgba(255,255,255,0.1)',
                  transform: 'translateX(-50%)',
                  boxShadow: dotVisible ? `0 0 14px ${COLORS.orange}` : 'none',
                }} />
              )
            })}
          </div>

          {/* Day entries — alternating slide directions */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 0,
            width: '100%', maxWidth: 700, position: 'relative', marginTop: 8,
          }}>
            {DAYS.map((entry) => (
              <SlideIn key={entry.day} delay={entry.delay} from={entry.from} distance={250}>
                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: 20,
                  padding: '14px 0',
                }}>
                  {/* Day number */}
                  <FlickerReveal delay={entry.delay} duration={8}>
                    <span style={{
                      fontFamily: 'Cormorant, serif', fontWeight: 700,
                      fontSize: 34, color: COLORS.orange,
                      width: 50, textAlign: 'right', flexShrink: 0, lineHeight: 1,
                    }}>
                      {entry.day}
                    </span>
                  </FlickerReveal>

                  {/* Dot */}
                  <PulseGlow accent="orange" speed={35}>
                    <div style={{
                      width: 10, height: 10, borderRadius: '50%',
                      background: COLORS.orange, flexShrink: 0, marginTop: 6,
                      boxShadow: `0 0 10px ${COLORS.orange}`,
                    }} />
                  </PulseGlow>

                  {/* Content */}
                  <div style={{
                    display: 'flex', flexDirection: 'column', gap: 4, textAlign: 'left',
                  }}>
                    <span style={{
                      fontFamily: 'Cormorant, serif', fontWeight: 600,
                      fontSize: 26, color: COLORS.text,
                    }}>
                      {entry.title}
                    </span>
                    <span style={{
                      fontFamily: 'IBM Plex Sans, sans-serif',
                      fontSize: 16, color: COLORS.textSecondary, lineHeight: 1.5,
                    }}>
                      {entry.desc}
                    </span>
                  </div>
                </div>
              </SlideIn>
            ))}
          </div>

          {/* Quote typewriter */}
          {frame > 160 && (
            <div style={{ marginTop: 8, maxWidth: 550 }}>
              <Typewriter
                text="4 jours pour assembler. 50 jours pour comprendre quoi assembler."
                delay={160}
                speed={1.2}
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
