import React from 'react'
import { interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from 'remotion'
import { SlideBase, Glow, Chrome, Badge } from '../components/Atoms'
import {
  ScalePop,
  ParticleField,
  CameraShake,
  SlideIn,
  FlickerReveal,
  StaggerLines,
  AnimatedCounter,
  ProgressBar,
  Typewriter,
  NumberReveal,
} from '../components/Motion'
import { COLORS, ACCENT } from '../theme'

export const KillDarlingsSection: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Deletion counter (counts DOWN from 1200 to 0)
  const deleteProgress = interpolate(
    Math.max(0, frame - 60), [0, 50], [0, 1],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) },
  )
  const deletionCount = Math.round(1200 * (1 - deleteProgress))

  // Strike-through on the title word "Cheris"
  const strikeS = spring({ frame: frame - 15, fps, config: { damping: 12, stiffness: 90 } })

  return (
    <SlideBase>
      <Chrome phase="KILL_IT" day="D12" accent="rose" />
      <ParticleField count={35} accent="rose" speed={1.8} />
      <Glow accent="rose" x="40%" y="50%" size="50vw" drift={15} />
      <Glow accent="orange" x="80%" y="25%" size="28vw" drift={8} />

      <CameraShake intensity={frame < 20 ? 3 : 1.5}>
        <div style={{
          display: 'flex', gap: 80, alignItems: 'center', zIndex: 2,
        }}>
          {/* Left column */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <ScalePop delay={5}>
              <h2 style={{
                fontFamily: 'Cormorant, serif', fontWeight: 700,
                fontSize: 58, lineHeight: 1.1, color: COLORS.rose,
                position: 'relative', display: 'inline-block',
              }}>
                Tuez vos{' '}
                <span style={{ position: 'relative' }}>
                  Cheris
                  <div style={{
                    position: 'absolute', top: '52%', left: -4, right: -4,
                    height: 4, background: COLORS.rose,
                    transform: `scaleX(${strikeS})`, transformOrigin: 'left',
                    boxShadow: `0 0 20px ${COLORS.rose}`,
                  }} />
                </span>
              </h2>
            </ScalePop>

            <SlideIn delay={15} from="left" distance={200}>
              <p style={{
                fontSize: 20, lineHeight: 1.65,
                color: COLORS.textSecondary, maxWidth: 520,
              }}>
                1 200 lignes de code MCP. Supprimees en un seul commit.
                Pas de regret, pas de branche archive — un delete propre.
              </p>
            </SlideIn>

            {/* Big deletion counter */}
            <div style={{
              display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8,
            }}>
              {frame > 55 && (
                <ScalePop delay={55}>
                  <span style={{
                    fontFamily: 'Cormorant, serif', fontWeight: 700,
                    fontSize: 100, color: COLORS.rose, lineHeight: 1,
                  }}>
                    -{deletionCount === 0 ? '1200' : deletionCount}
                  </span>
                </ScalePop>
              )}
              <span style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 14,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: COLORS.textMuted,
                opacity: frame > 55 ? 1 : 0,
              }}>
                lignes
              </span>
            </div>

            {/* Deletion progress bar */}
            <SlideIn delay={70} from="bottom">
              <ProgressBar delay={75} duration={35} accent="rose" label="Suppression" width={400} />
            </SlideIn>

            {/* Badges staggered */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 4 }}>
              <ScalePop delay={100}>
                <Badge accent="rose">1 commit</Badge>
              </ScalePop>
              <ScalePop delay={108}>
                <Badge accent="rose">0 regret</Badge>
              </ScalePop>
              <ScalePop delay={116}>
                <Badge accent="rose">100% propre</Badge>
              </ScalePop>
            </div>
          </div>

          {/* Right column — terminal with typing lines */}
          <SlideIn delay={25} from="right" distance={400}>
            <div style={{
              border: `1px solid ${ACCENT.rose.border}`,
              borderRadius: 6, padding: '20px 24px',
              background: ACCENT.rose.glow, maxWidth: 550,
            }}>
              <StaggerLines
                delay={30}
                lineGap={14}
                typeSpeed={2.5}
                lines={[
                  { text: 'git log --oneline -1', color: COLORS.textMuted, prefix: '$' },
                  { text: 'cfa0ce3 chore: remove MCP layer', color: COLORS.amber },
                  { text: '', color: COLORS.textMuted },
                  { text: 'git diff --stat cfa0ce3', color: COLORS.textMuted, prefix: '$' },
                  { text: 'src/mcp/server.ts    | 340 ----------', color: COLORS.rose },
                  { text: 'src/mcp/transport.ts | 280 ----------', color: COLORS.rose },
                  { text: 'src/mcp/tools/*.ts   | 580 ----------', color: COLORS.rose },
                  { text: '', color: COLORS.textMuted },
                  { text: '3 files changed, 1200 deletions(-)', color: COLORS.rose },
                ]}
              />
            </div>
          </SlideIn>
        </div>

        {/* Bottom quote — typewriter */}
        {frame > 150 && (
          <div style={{ marginTop: 28, textAlign: 'center' }}>
            <Typewriter
              text="Le code mort, c'est de la dette cognitive. Chaque ligne supprimee est un cadeau a ton futur toi."
              delay={150}
              speed={1.3}
              style={{
                fontFamily: 'Cormorant, serif', fontStyle: 'italic',
                fontSize: 22, color: COLORS.rose,
              }}
            />
          </div>
        )}
      </CameraShake>
    </SlideBase>
  )
}
