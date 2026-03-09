import React from 'react'
import { interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from 'remotion'
import { SlideBase, Glow, Chrome } from '../components/Atoms'
import {
  StaggerLines,
  ScalePop,
  ParticleField,
  CameraShake,
  WordByWord,
  NumberReveal,
  FlickerReveal,
  SlideIn,
  ProgressBar,
} from '../components/Motion'
import { COLORS, ACCENT } from '../theme'

export const WrongBetSection: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  // Shake increases when errors appear
  const errorPhase = frame > 90 && frame < 250
  const shakeIntensity = errorPhase ? 3 : 1

  // Day counter (D01 -> D05)
  const dayProgress = interpolate(frame, [30, 300], [1, 5], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })

  return (
    <SlideBase>
      <Chrome phase="WRONG_BET" day="D01-05" accent="rose" />
      <ParticleField count={20} accent="rose" speed={1.2} />
      <Glow accent="rose" x="30%" y="55%" size="55vw" drift={18} />
      <Glow accent="orange" x="75%" y="30%" size="30vw" drift={12} />

      <CameraShake intensity={shakeIntensity}>
        <div style={{
          display: 'flex', gap: 60, alignItems: 'center', zIndex: 2,
        }}>
          {/* Left column */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Title slides in from left */}
            <SlideIn delay={5} from="left" distance={300}>
              <h2 style={{
                fontFamily: 'Cormorant, serif', fontWeight: 600,
                fontSize: 64, lineHeight: 1.1, color: COLORS.rose,
              }}>
                Le Mauvais Pari
              </h2>
            </SlideIn>

            {/* Body text word by word */}
            <SlideIn delay={15} from="left" distance={200}>
              <WordByWord
                text="MCP semblait parfait. Protocole standard. Bien documente."
                delay={20}
                wordGap={3}
                highlight={['MCP', 'parfait']}
                highlightColor={COLORS.rose}
                style={{
                  fontSize: 20, lineHeight: 1.65, color: COLORS.textSecondary, maxWidth: 500,
                }}
              />
            </SlideIn>

            {/* "Sauf que non." dramatic reveal */}
            {frame > 100 && (
              <ScalePop delay={100}>
                <span style={{
                  fontFamily: 'Cormorant, serif', fontSize: 48, fontWeight: 700,
                  color: COLORS.rose,
                }}>
                  Sauf que non.
                </span>
              </ScalePop>
            )}

            {/* Day counter + progress bar */}
            <SlideIn delay={45} from="bottom" distance={60}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <span style={{
                  fontFamily: 'Cormorant, serif', fontWeight: 700,
                  fontSize: 72, color: COLORS.rose,
                }}>
                  {Math.floor(dayProgress)}
                </span>
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 14,
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                  color: COLORS.textMuted,
                }}>
                  jours perdus
                </span>
              </div>
              <ProgressBar
                delay={50}
                duration={250}
                accent="rose"
                label="frustration"
                width={350}
              />
            </SlideIn>

            {/* Quote */}
            {frame > 200 && (
              <SlideIn delay={200} from="bottom" distance={40}>
                <div style={{
                  fontFamily: 'Cormorant, serif', fontStyle: 'italic',
                  fontSize: 22, color: COLORS.text, maxWidth: 450,
                  paddingLeft: 20, borderLeft: `3px solid ${COLORS.rose}`,
                  lineHeight: 1.5,
                }}>
                  La bonne facon des autres n'est pas toujours la bonne facon pour votre probleme.
                </div>
              </SlideIn>
            )}
          </div>

          {/* Right column — terminal with typing lines */}
          <SlideIn delay={10} from="right" distance={400}>
            <div style={{
              border: `1px solid ${ACCENT.rose.border}`,
              borderRadius: 6, padding: '20px 24px',
              background: ACCENT.rose.glow, minWidth: 480,
            }}>
              {/* Terminal header */}
              <div style={{
                display: 'flex', gap: 6, marginBottom: 16,
              }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f43f5e' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} />
              </div>

              <StaggerLines
                delay={30}
                lineGap={22}
                typeSpeed={2.5}
                lines={[
                  { text: 'mcp-server start --transport stdio', prefix: '$', color: COLORS.textMuted },
                  { text: 'Connection reset by peer', prefix: 'ERR', color: COLORS.rose },
                  { text: 'Tool call timeout (30s)', prefix: 'ERR', color: COLORS.rose },
                  { text: 'JSON-RPC parse error', prefix: 'ERR', color: COLORS.rose },
                  { text: 'mcp-server restart --retry 3', prefix: '$', color: COLORS.textMuted },
                  { text: 'Max retries exceeded', prefix: 'ERR', color: COLORS.rose },
                  { text: '# 5 jours. Meme boucle.', prefix: '', color: `${COLORS.textMuted}88` },
                ]}
              />

              {/* Blinking error indicator */}
              {frame > 180 && (
                <FlickerReveal delay={180} duration={20}>
                  <div style={{
                    marginTop: 16, padding: '8px 12px',
                    background: 'rgba(244,63,94,0.15)',
                    border: '1px solid rgba(244,63,94,0.3)',
                    borderRadius: 4,
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 12, color: COLORS.rose,
                    textAlign: 'center',
                  }}>
                    CRITICAL: Zero value delivered in 5 days
                  </div>
                </FlickerReveal>
              )}
            </div>
          </SlideIn>
        </div>
      </CameraShake>
    </SlideBase>
  )
}
