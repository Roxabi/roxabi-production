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
} from '../components/Motion'
import { COLORS, ACCENT } from '../theme'

const PIPELINE_STEPS = [
  { label: 'Whisper STT', delay: 85 },
  { label: 'Claude LLM', delay: 95 },
  { label: 'TTS Streaming', delay: 105 },
]

export const VoiceSection: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Arrow punches in
  const arrowS = spring({ frame: frame - 55, fps, config: { damping: 8, stiffness: 120, mass: 0.6 } })

  return (
    <SlideBase>
      <Chrome phase="NEW_MODE" day="D47" accent="cyan" />
      <ParticleField count={35} accent="cyan" speed={1.2} />
      <Glow accent="cyan" x="50%" y="45%" size="55vw" drift={18} />
      <Glow accent="amber" x="15%" y="70%" size="25vw" drift={10} />

      <CameraShake intensity={2}>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          textAlign: 'center', gap: 24, zIndex: 2,
        }}>
          <ScalePop delay={5}>
            <h2 style={{
              fontFamily: 'Cormorant, serif', fontWeight: 700,
              fontSize: 56, lineHeight: 1.1, color: COLORS.cyan,
            }}>
              La Voix de Lyra
            </h2>
          </ScalePop>

          <SlideIn delay={12} from="bottom" distance={50}>
            <p style={{
              fontSize: 20, lineHeight: 1.65,
              color: COLORS.textSecondary, maxWidth: 700,
            }}>
              De la transcription Whisper au TTS en passant par la comprehension — le
              pipeline vocal complet, en temps reel.
            </p>
          </SlideIn>

          {/* Dynamic waveform — each bar has different speed */}
          <SlideIn delay={18} from="bottom" distance={30}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 3, height: 50, marginTop: 4,
            }}>
              {Array.from({ length: 32 }).map((_, i) => {
                // Each bar oscillates at a different frequency/phase
                const freq = 5 + (i % 7) * 1.3
                const phase = i * 0.8
                const amplitude = 14 + Math.sin(i * 0.4) * 8
                const h = Math.sin(frame / freq + phase) * amplitude + amplitude + 4
                const barOpacity = 0.4 + Math.sin(frame / 10 + i) * 0.3

                return (
                  <div
                    key={i}
                    style={{
                      width: 4,
                      height: h,
                      borderRadius: 2,
                      background: `linear-gradient(to top, ${COLORS.cyan}88, ${COLORS.cyan})`,
                      opacity: barOpacity,
                    }}
                  />
                )
              })}
            </div>
          </SlideIn>

          {/* Latency comparison — dramatic NumberReveal */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 60, marginTop: 12,
          }}>
            {/* Before: ~15s */}
            <SlideIn delay={30} from="left" distance={300}>
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <NumberReveal value="~15" delay={33} color={COLORS.rose} size={90} />
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 22,
                    color: COLORS.rose,
                  }}>s</span>
                </div>
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: COLORS.textMuted,
                }}>
                  Latence initiale
                </span>
              </div>
            </SlideIn>

            {/* Arrow — punches in */}
            <div style={{
              fontSize: 72, color: ACCENT.cyan.color,
              opacity: arrowS,
              transform: `translateX(${interpolate(arrowS, [0, 1], [-60, 0])}px) scale(${interpolate(arrowS, [0, 1], [0.3, 1])})`,
              filter: `blur(${interpolate(arrowS, [0, 1], [8, 0])}px)`,
            }}>
              →
            </div>

            {/* After: ~2s */}
            <SlideIn delay={48} from="right" distance={300}>
              <PulseGlow accent="cyan">
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <NumberReveal value="~2" delay={50} color={COLORS.cyan} size={90} />
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 22,
                      color: COLORS.cyan,
                    }}>s</span>
                  </div>
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: COLORS.textMuted,
                  }}>
                    Latence finale
                  </span>
                </div>
              </PulseGlow>
            </SlideIn>
          </div>

          {/* Pipeline badge steps — appear one by one */}
          <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
            {PIPELINE_STEPS.map((step) => (
              <ScalePop key={step.label} delay={step.delay}>
                <Badge accent="cyan">{step.label}</Badge>
              </ScalePop>
            ))}
          </div>

          {/* Quote typewriter */}
          {frame > 140 && (
            <div style={{ marginTop: 10, maxWidth: 500 }}>
              <Typewriter
                text="Parler a ton systeme change tout. L'interface disparait."
                delay={140}
                speed={1.3}
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
