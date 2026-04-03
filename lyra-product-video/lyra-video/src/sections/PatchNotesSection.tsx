import React from 'react'
import { interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from 'remotion'
import { SlideBase, Glow, Chrome, Badge } from '../components/Atoms'
import {
  ScalePop,
  ParticleField,
  CameraShake,
  SlideIn,
  StaggerLines,
  FlickerReveal,
  Typewriter,
} from '../components/Motion'
import { COLORS, ACCENT } from '../theme'

export const PatchNotesSection: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  return (
    <SlideBase>
      <Chrome phase="CHANGELOG" day="D31" accent="amber" />
      <ParticleField count={20} accent="amber" speed={0.7} />
      <Glow accent="amber" x="40%" y="45%" size="50vw" drift={16} />
      <Glow accent="rose" x="75%" y="70%" size="25vw" drift={10} />

      <CameraShake intensity={1}>
        <div style={{
          display: 'flex', gap: 80, alignItems: 'center', zIndex: 2,
        }}>
          {/* Left column */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <ScalePop delay={5}>
              <h2 style={{
                fontFamily: 'Cormorant, serif', fontWeight: 700,
                fontSize: 52, lineHeight: 1.1, color: COLORS.amber,
              }}>
                Patch Notes
              </h2>
            </ScalePop>

            {/* Version number with ScalePop */}
            <ScalePop delay={10}>
              <span style={{
                fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
                fontSize: 80, color: COLORS.amber, lineHeight: 1,
                display: 'inline-block',
              }}>
                v0.7
              </span>
            </ScalePop>

            <SlideIn delay={18} from="left" distance={150}>
              <p style={{
                fontSize: 20, lineHeight: 1.65,
                color: COLORS.textSecondary, maxWidth: 450,
              }}>
                Un changelog n'est pas un detail. C'est un contrat de transparence
                avec ton futur toi et ton equipe.
              </p>
            </SlideIn>

            <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
              <ScalePop delay={100}>
                <Badge accent="amber">v0.7.0</Badge>
              </ScalePop>
              <ScalePop delay={108}>
                <Badge accent="amber">12 PRs merged</Badge>
              </ScalePop>
            </div>
          </div>

          {/* Right column — terminal with typed changelog */}
          <SlideIn delay={20} from="right" distance={400}>
            <div style={{
              border: `1px solid ${ACCENT.amber.border}`,
              borderRadius: 6, padding: '20px 24px',
              background: ACCENT.amber.glow, minWidth: 500,
            }}>
              {/* Header */}
              <StaggerLines
                delay={25}
                lineGap={10}
                typeSpeed={2}
                lines={[
                  { text: '## v0.7.0 Changelog', color: COLORS.textMuted },
                ]}
              />

              {/* Removed section — flicker in rose */}
              {frame > 40 && (
                <div style={{ marginTop: 16 }}>
                  <FlickerReveal delay={40} duration={12}>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      color: COLORS.rose, fontWeight: 700,
                    }}>
                      Removed
                    </span>
                  </FlickerReveal>

                  <StaggerLines
                    delay={55}
                    lineGap={12}
                    typeSpeed={2.5}
                    lines={[
                      { text: 'MCP server layer', color: COLORS.rose, prefix: '-' },
                      { text: 'JSON-RPC transport', color: COLORS.rose, prefix: '-' },
                      { text: 'Stdio bridge adapters', color: COLORS.rose, prefix: '-' },
                    ]}
                  />
                </div>
              )}

              {/* Added section — slide in amber */}
              {frame > 95 && (
                <div style={{ marginTop: 16 }}>
                  <SlideIn delay={95} from="right" distance={100}>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      color: COLORS.amber, fontWeight: 700,
                    }}>
                      Added
                    </span>
                  </SlideIn>

                  <StaggerLines
                    delay={105}
                    lineGap={10}
                    typeSpeed={2}
                    lines={[
                      { text: 'Python direct API layer', color: COLORS.amber, prefix: '+' },
                      { text: '_shared/ module system', color: COLORS.amber, prefix: '+' },
                      { text: 'Knowledge Radar v1', color: COLORS.amber, prefix: '+' },
                      { text: 'Telegram bot integration', color: COLORS.amber, prefix: '+' },
                      { text: 'CI pipeline + code review', color: COLORS.amber, prefix: '+' },
                    ]}
                  />
                </div>
              )}
            </div>
          </SlideIn>
        </div>

        {/* Bottom quote */}
        {frame > 170 && (
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Typewriter
              text="Si tu ne peux pas expliquer ce qui a change, tu ne sais pas ce que tu as construit."
              delay={170}
              speed={1.3}
              style={{
                fontFamily: 'Cormorant, serif', fontStyle: 'italic',
                fontSize: 22, color: COLORS.amber,
              }}
            />
          </div>
        )}
      </CameraShake>
    </SlideBase>
  )
}
