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
  FlickerReveal,
} from '../components/Motion'
import { COLORS, ACCENT } from '../theme'

export const ClosingSection: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Pulsing brand
  const pulseOpacity = interpolate(
    Math.sin(frame / 18),
    [-1, 1],
    [0.6, 1],
  )

  // Link reveal
  const linkS = spring({ frame: frame - 110, fps, config: { damping: 16, stiffness: 60 } })

  return (
    <SlideBase>
      <Chrome phase="NEXT" day="---" accent="amber" />
      <ParticleField count={45} accent="amber" speed={0.6} />
      <Glow accent="amber" x="50%" y="40%" size="65vw" drift={20} />
      <Glow accent="orange" x="30%" y="70%" size="30vw" drift={12} />
      <Glow accent="cyan" x="75%" y="25%" size="20vw" drift={8} />

      <CameraShake intensity={1}>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          textAlign: 'center', gap: 24, zIndex: 2,
        }}>
          <FlickerReveal delay={3} duration={10}>
            <Badge accent="amber">La question finale</Badge>
          </FlickerReveal>

          {/* Big CTA — typewriter for dramatic effect */}
          <div style={{ marginTop: 16, minHeight: 160 }}>
            {frame > 15 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <Typewriter
                  text="C'est quoi,"
                  delay={15}
                  speed={0.8}
                  cursor={false}
                  style={{
                    fontFamily: 'Cormorant, serif', fontWeight: 700,
                    fontSize: 64, lineHeight: 1.2,
                    background: `linear-gradient(135deg, ${COLORS.amber}, ${COLORS.orange})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                />
                {frame > 40 && (
                  <Typewriter
                    text="votre laboratoire ?"
                    delay={40}
                    speed={0.6}
                    cursor={true}
                    style={{
                      fontFamily: 'Cormorant, serif', fontWeight: 700,
                      fontSize: 64, lineHeight: 1.2,
                      color: COLORS.text,
                    }}
                  />
                )}
              </div>
            )}
          </div>

          {/* Body text */}
          {frame > 75 && (
            <SlideIn delay={75} from="bottom" distance={40}>
              <p style={{
                fontFamily: 'IBM Plex Sans, sans-serif',
                fontSize: 20, lineHeight: 1.65,
                color: COLORS.textSecondary, maxWidth: 600,
              }}>
                Chaque projet cache un ecosysteme qui attend d'emerger. La seule
                question est : allez-vous le voir a temps ?
              </p>
            </SlideIn>
          )}

          {/* Lyra brand with PulseGlow */}
          <div style={{
            opacity: linkS,
            transform: `translateY(${interpolate(linkS, [0, 1], [30, 0])}px)`,
            marginTop: 20,
          }}>
            <PulseGlow accent="amber" speed={30}>
              <span style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 32, fontWeight: 700,
                color: COLORS.amber, letterSpacing: '0.08em',
                opacity: pulseOpacity,
              }}>
                ROXABI.COM
              </span>
            </PulseGlow>
          </div>

          {/* Social badges — staggered */}
          <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
            <ScalePop delay={120}>
              <Badge accent="amber">GitHub</Badge>
            </ScalePop>
            <ScalePop delay={128}>
              <Badge accent="orange">Twitter</Badge>
            </ScalePop>
            <ScalePop delay={136}>
              <Badge accent="cyan">Contact</Badge>
            </ScalePop>
          </div>

          {/* Closing tagline */}
          {frame > 150 && (
            <div style={{ marginTop: 16 }}>
              <Typewriter
                text="Lyra Origin Talks — 52 jours, de zero a ecosysteme."
                delay={150}
                speed={1}
                style={{
                  fontFamily: 'Cormorant, serif', fontStyle: 'italic',
                  fontSize: 22, color: COLORS.textMuted,
                }}
              />
            </div>
          )}
        </div>
      </CameraShake>
    </SlideBase>
  )
}
