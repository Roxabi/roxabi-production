import React from 'react'
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from '../../core'
import { sprng } from '../../lib'

export interface SocialCardProps {
  /** "story" (1080x1920), "post" (1080x1080), "landscape" (1920x1080) */
  format?: 'story' | 'post' | 'landscape'
  headline: string
  subline?: string
  accentColor?: string
  bgColor?: string
  /** Optional logo URL */
  logoSrc?: string
}

export const SocialCard: React.FC<SocialCardProps> = ({
  headline,
  subline,
  accentColor = '#ff006e',
  bgColor = '#0a0a0a',
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const headlineProgress = sprng(frame, fps, { damping: 14 }, 5)
  const sublineProgress = sprng(frame, fps, { damping: 14 }, 15)
  const lineProgress = sprng(frame, fps, { damping: 20 }, 0)

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bgColor,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10%',
      }}
    >
      {/* Accent line */}
      <div
        style={{
          width: `${lineProgress * 60}%`,
          height: 4,
          backgroundColor: accentColor,
          marginBottom: 40,
          borderRadius: 2,
        }}
      />

      {/* Headline */}
      <h1
        style={{
          color: 'white',
          fontSize: 64,
          fontWeight: 800,
          textAlign: 'center',
          lineHeight: 1.2,
          opacity: headlineProgress,
          transform: `translateY(${(1 - headlineProgress) * 30}px)`,
          margin: 0,
        }}
      >
        {headline}
      </h1>

      {/* Subline */}
      {subline && (
        <p
          style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: 28,
            textAlign: 'center',
            marginTop: 20,
            opacity: sublineProgress,
            transform: `translateY(${(1 - sublineProgress) * 20}px)`,
          }}
        >
          {subline}
        </p>
      )}
    </AbsoluteFill>
  )
}
