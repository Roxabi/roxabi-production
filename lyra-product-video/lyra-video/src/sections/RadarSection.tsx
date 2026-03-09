import React from 'react'
import { interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from 'remotion'
import { SlideBase, Glow, Chrome } from '../components/Atoms'
import {
  ScalePop,
  ParticleField,
  CameraShake,
  SlideIn,
  AnimatedCounter,
  Typewriter,
  PulseGlow,
} from '../components/Motion'
import { COLORS, ACCENT } from '../theme'

const STATS = [
  { label: 'Twitter / X', value: 214, delay: 40 },
  { label: 'GitHub', value: 52, delay: 52 },
  { label: 'Total Sources', value: 389, delay: 64 },
]

export const RadarSection: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Radar sweep: rotating line
  const sweepAngle = interpolate(frame, [0, 300], [0, 720], {
    extrapolateRight: 'clamp',
  })

  // Radar ring pulse
  const ringPulse = Math.sin(frame / 20) * 0.2 + 0.8

  return (
    <SlideBase>
      <Chrome phase="RADAR" day="D22" accent="cyan" />
      <ParticleField count={50} accent="cyan" speed={0.8} />
      <Glow accent="cyan" x="55%" y="40%" size="55vw" drift={18} />
      <Glow accent="amber" x="15%" y="70%" size="25vw" drift={10} />

      {/* Radar sweep background effect */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: 500, height: 500,
        transform: 'translate(-50%, -50%)',
        zIndex: 1, pointerEvents: 'none',
      }}>
        {/* Radar rings */}
        {[1, 0.66, 0.33].map((scale, i) => (
          <div key={i} style={{
            position: 'absolute', inset: 0,
            border: `1px solid ${ACCENT.cyan.border}`,
            borderRadius: '50%',
            transform: `scale(${scale})`,
            opacity: ringPulse * (0.15 + i * 0.05),
          }} />
        ))}
        {/* Sweep line */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: '50%', height: 2,
          background: `linear-gradient(90deg, ${COLORS.cyan}00, ${COLORS.cyan})`,
          transformOrigin: '0 50%',
          transform: `rotate(${sweepAngle}deg)`,
          boxShadow: `0 0 15px ${COLORS.cyan}66`,
        }} />
        {/* Center dot */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 8, height: 8, borderRadius: '50%',
          background: COLORS.cyan, transform: 'translate(-50%, -50%)',
          boxShadow: `0 0 20px ${COLORS.cyan}`,
        }} />
      </div>

      <CameraShake intensity={1}>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          textAlign: 'center', gap: 24, zIndex: 2,
        }}>
          <ScalePop delay={5}>
            <h2 style={{
              fontFamily: 'Cormorant, serif', fontWeight: 700,
              fontSize: 56, lineHeight: 1.1, color: COLORS.cyan,
            }}>
              Knowledge Radar
            </h2>
          </ScalePop>

          <SlideIn delay={12} from="bottom" distance={60}>
            <p style={{
              fontSize: 20, lineHeight: 1.65,
              color: COLORS.textSecondary, maxWidth: 700,
            }}>
              Un systeme de veille automatise qui scanne, filtre et synthetise les
              signaux faibles de l'ecosysteme AI. Chaque matin, le radar livre un
              brief actionnable.
            </p>
          </SlideIn>

          {/* 3 stat cards — ScalePop with AnimatedCounter */}
          <div style={{ display: 'flex', gap: 40, marginTop: 16 }}>
            {STATS.map((stat) => (
              <ScalePop key={stat.label} delay={stat.delay}>
                <PulseGlow accent="cyan" speed={50}>
                  <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                    border: `1px solid ${ACCENT.cyan.border}`,
                    borderRadius: 8, padding: '32px 48px',
                    background: ACCENT.cyan.glow, minWidth: 200,
                  }}>
                    <AnimatedCounter
                      value={stat.value}
                      delay={stat.delay + 5}
                      duration={35}
                      color={COLORS.cyan}
                      size={72}
                    />
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 13,
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      color: COLORS.textSecondary,
                    }}>
                      {stat.label}
                    </span>
                  </div>
                </PulseGlow>
              </ScalePop>
            ))}
          </div>

          {/* Quote typewriter */}
          {frame > 120 && (
            <div style={{ marginTop: 16, maxWidth: 600 }}>
              <Typewriter
                text="Tu ne peux pas innover si tu ne sais pas ce qui se passe. Le radar est tes yeux dans le bruit."
                delay={120}
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
