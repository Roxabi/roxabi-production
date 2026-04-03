import React from 'react'
import { interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from 'remotion'
import { SlideBase, Glow, Chrome } from '../components/Atoms'
import {
  ScalePop,
  ParticleField,
  CameraShake,
  SlideIn,
  AnimatedCounter,
  NumberReveal,
  PulseGlow,
  Typewriter,
} from '../components/Motion'
import { COLORS, ACCENT } from '../theme'

const STATS = [
  { value: 462, label: 'Issues', delay: 20, accent: 'amber' as const },
  { value: 389, label: 'Sources', delay: 28, accent: 'cyan' as const },
  { value: 194, label: 'PRs Merged', delay: 36, accent: 'orange' as const },
  { value: 52, label: 'Jours', delay: 44, accent: 'amber' as const },
  { value: 11, label: 'Skills', delay: 52, accent: 'cyan' as const },
  { value: 6, label: 'Repos', delay: 60, accent: 'orange' as const },
]

export const NumbersSection: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  return (
    <SlideBase>
      <Chrome phase="METRICS" day="---" accent="amber" />
      <ParticleField count={40} accent="amber" speed={1.5} />
      <Glow accent="amber" x="50%" y="45%" size="55vw" drift={16} />
      <Glow accent="orange" x="80%" y="70%" size="25vw" drift={10} />

      <CameraShake intensity={2}>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          textAlign: 'center', gap: 28, zIndex: 2,
        }}>
          <ScalePop delay={5}>
            <h2 style={{
              fontFamily: 'Cormorant, serif', fontWeight: 700,
              fontSize: 60, lineHeight: 1.1, color: COLORS.amber,
            }}>
              Les Chiffres
            </h2>
          </ScalePop>

          {/* 6-stat grid: 3 columns x 2 rows */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 28, marginTop: 8,
          }}>
            {STATS.map((stat) => (
              <ScalePop key={stat.label} delay={stat.delay}>
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                  border: `1px solid ${ACCENT[stat.accent].border}`,
                  borderRadius: 8, padding: '28px 40px',
                  background: ACCENT[stat.accent].glow, minWidth: 180,
                }}>
                  <AnimatedCounter
                    value={stat.value}
                    delay={stat.delay + 5}
                    duration={40}
                    color={ACCENT[stat.accent].color}
                    size={64}
                  />
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 13,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: COLORS.textSecondary,
                  }}>
                    {stat.label}
                  </span>
                </div>
              </ScalePop>
            ))}
          </div>

          {/* Quote typewriter */}
          {frame > 110 && (
            <div style={{ marginTop: 12, maxWidth: 600 }}>
              <Typewriter
                text="Les chiffres ne mentent pas. 52 jours, un humain, une vision — et l'ecosysteme existe."
                delay={110}
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
