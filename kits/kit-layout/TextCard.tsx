import React from 'react'
import { interpolate, spring, useCurrentFrame, useVideoConfig } from '../../core'
import { COLORS } from '../../themes'
import { SlideBase } from './SlideBase'

export interface TextCardProps {
  title: string
  subtitle?: string
  body?: string
  /** "center" | "top-left" | "top-center" | "bottom-left" */
  align?: 'center' | 'top-left' | 'top-center' | 'bottom-left'
  /** Background color, defaults to black */
  background?: string
  /** Accent color for title underline or left border */
  accent?: string
  /** Entry animation delay in frames */
  delay?: number
}

const alignStyles: Record<
  NonNullable<TextCardProps['align']>,
  { justifyContent: string; alignItems: string; textAlign: 'center' | 'left' }
> = {
  center:      { justifyContent: 'center', alignItems: 'center',     textAlign: 'center' },
  'top-left':  { justifyContent: 'flex-start', alignItems: 'flex-start', textAlign: 'left' },
  'top-center':{ justifyContent: 'flex-start', alignItems: 'center',     textAlign: 'center' },
  'bottom-left':{ justifyContent: 'flex-end', alignItems: 'flex-start',  textAlign: 'left' },
}

export const TextCard: React.FC<TextCardProps> = ({
  title,
  subtitle,
  body,
  align = 'center',
  background,
  accent,
  delay = 0,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const s = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 80 } })
  const opacity = s
  const translateY = interpolate(s, [0, 1], [40, 0])

  const { justifyContent, alignItems, textAlign } = alignStyles[align]

  return (
    <SlideBase bg={background}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent,
          alignItems,
          height: '100%',
        }}
      >
        <div
          style={{
            opacity,
            transform: `translateY(${translateY}px)`,
            display: 'flex',
            flexDirection: 'column',
            alignItems,
            gap: 16,
            textAlign,
          }}
        >
          {/* Title */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems, gap: 10 }}>
            <h2
              style={{
                fontFamily: 'Cormorant, serif',
                fontWeight: 600,
                fontSize: 64,
                lineHeight: 1.1,
                color: COLORS.text,
                margin: 0,
              }}
            >
              {title}
            </h2>
            {accent && (
              <div
                style={{
                  height: 3,
                  width: 64,
                  borderRadius: 2,
                  background: accent,
                }}
              />
            )}
          </div>

          {/* Subtitle */}
          {subtitle && (
            <p
              style={{
                fontFamily: 'IBM Plex Sans, sans-serif',
                fontSize: 26,
                fontWeight: 400,
                lineHeight: 1.4,
                color: COLORS.textSecondary,
                margin: 0,
              }}
            >
              {subtitle}
            </p>
          )}

          {/* Body */}
          {body && (
            <p
              style={{
                fontFamily: 'IBM Plex Sans, sans-serif',
                fontSize: 20,
                lineHeight: 1.65,
                color: COLORS.textSecondary,
                maxWidth: 620,
                margin: 0,
              }}
            >
              {body}
            </p>
          )}
        </div>
      </div>
    </SlideBase>
  )
}
