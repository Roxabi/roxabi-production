import React from 'react'
import { interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from 'remotion'
import { SlideBase, Glow, Chrome, Badge } from '../components/Atoms'
import {
  ScalePop,
  ParticleField,
  CameraShake,
  SlideIn,
  NumberReveal,
  AnimatedCounter,
  PulseGlow,
  Typewriter,
} from '../components/Motion'
import { COLORS, ACCENT } from '../theme'

const MESSAGES = [
  { text: 'Nouveau brief disponible', from: 'left' as const, delay: 50 },
  { text: '12 signaux detectes', from: 'right' as const, delay: 62 },
  { text: '3 actions recommandees', from: 'left' as const, delay: 74 },
  { text: 'OpenAI GPT-5 annonce — impact eleve', from: 'right' as const, delay: 86 },
]

export const TelegramSection: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Pulsing AM indicator
  const pulseOpacity = interpolate(
    Math.sin(frame / 12),
    [-1, 1],
    [0.3, 1],
  )

  return (
    <SlideBase>
      <Chrome phase="SHIP_IT" day="D22-24" accent="orange" />
      <ParticleField count={25} accent="orange" speed={1} />
      <Glow accent="orange" x="50%" y="40%" size="55vw" drift={16} />
      <Glow accent="amber" x="80%" y="75%" size="28vw" drift={10} />

      <CameraShake intensity={1.5}>
        <div style={{
          display: 'flex', gap: 70, alignItems: 'center', zIndex: 2,
        }}>
          {/* Left column — time + info */}
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 20,
          }}>
            <ScalePop delay={5}>
              <h2 style={{
                fontFamily: 'Cormorant, serif', fontWeight: 700,
                fontSize: 52, lineHeight: 1.1, color: COLORS.orange,
              }}>
                Le Bot Telegram
              </h2>
            </ScalePop>

            {/* Big time display with NumberReveal */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 10 }}>
              <NumberReveal value="6:34" delay={12} color={COLORS.orange} size={130} />
              <PulseGlow accent="orange" speed={25}>
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 32,
                  color: COLORS.orange, marginLeft: 8,
                  opacity: pulseOpacity,
                }}>
                  AM
                </span>
              </PulseGlow>
            </div>

            <SlideIn delay={25} from="bottom" distance={40}>
              <p style={{
                fontSize: 18, lineHeight: 1.65,
                color: COLORS.textSecondary, maxWidth: 450,
                textAlign: 'center',
              }}>
                Chaque matin a 6h34, le brief arrive sur Telegram.
                L'information vient a toi.
              </p>
            </SlideIn>

            {/* Stats with AnimatedCounter */}
            <div style={{ display: 'flex', gap: 30, marginTop: 8 }}>
              <ScalePop delay={100}>
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                }}>
                  <AnimatedCounter value={20} delay={105} duration={30} color={COLORS.orange} size={48} suffix="/sem" />
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: COLORS.textMuted,
                  }}>sessions</span>
                </div>
              </ScalePop>
              <ScalePop delay={112}>
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                }}>
                  <AnimatedCounter value={105} delay={117} duration={35} color={COLORS.amber} size={48} suffix="/sem" />
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: COLORS.textMuted,
                  }}>messages</span>
                </div>
              </ScalePop>
            </div>
          </div>

          {/* Right column — chat bubbles sliding in from alternating sides */}
          <div style={{
            width: 420, display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            {MESSAGES.map((msg, i) => (
              <SlideIn key={i} delay={msg.delay} from={msg.from} distance={250}>
                <div style={{
                  padding: '14px 20px',
                  borderRadius: msg.from === 'left' ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                  background: msg.from === 'left'
                    ? ACCENT.orange.glow
                    : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${msg.from === 'left' ? ACCENT.orange.border : 'rgba(255,255,255,0.08)'}`,
                  alignSelf: msg.from === 'left' ? 'flex-start' : 'flex-end',
                  maxWidth: '85%',
                }}>
                  <span style={{
                    fontFamily: 'IBM Plex Sans, sans-serif',
                    fontSize: 15, color: COLORS.text, lineHeight: 1.5,
                  }}>
                    {msg.text}
                  </span>
                </div>
              </SlideIn>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        {frame > 140 && (
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Typewriter
              text="Le meilleur produit est celui que tu utilises sans y penser. Telegram etait deja dans ma poche."
              delay={140}
              speed={1.3}
              style={{
                fontFamily: 'Cormorant, serif', fontStyle: 'italic',
                fontSize: 22, color: COLORS.orange,
              }}
            />
          </div>
        )}
      </CameraShake>
    </SlideBase>
  )
}
