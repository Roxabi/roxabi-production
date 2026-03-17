import React from 'react'
import { useCurrentFrame, useVideoConfig } from '../../core'
import { sprng } from '../../lib'

export interface CaptionWord {
  text: string
  /** Start frame */
  from: number
  /** End frame */
  to: number
}

export interface CaptionOverlayProps {
  words: CaptionWord[]
  /** Style preset */
  variant?: 'karaoke' | 'pop' | 'subtitle'
  activeColor?: string
  inactiveColor?: string
  style?: React.CSSProperties
}

export const CaptionOverlay: React.FC<CaptionOverlayProps> = ({
  words,
  variant = 'karaoke',
  activeColor = '#ffbe0b',
  inactiveColor = 'rgba(255,255,255,0.8)',
  style,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  if (variant === 'subtitle') {
    const activeWords = words.filter((w) => frame >= w.from && frame <= w.to)
    if (activeWords.length === 0) return null

    return (
      <div
        style={{
          position: 'absolute',
          bottom: 120,
          left: '10%',
          right: '10%',
          textAlign: 'center',
          ...style,
        }}
      >
        <span
          style={{
            backgroundColor: 'rgba(0,0,0,0.75)',
            color: 'white',
            fontSize: 36,
            fontWeight: 600,
            padding: '8px 20px',
            borderRadius: 8,
          }}
        >
          {activeWords.map((w) => w.text).join(' ')}
        </span>
      </div>
    )
  }

  // Find the current "window" of words to display (group of ~5-7 words)
  const windowSize = 6
  const currentIdx = words.findIndex((w) => frame >= w.from && frame <= w.to)
  if (currentIdx === -1) return null

  const windowStart = Math.max(0, currentIdx - Math.floor(windowSize / 2))
  const windowEnd = Math.min(words.length, windowStart + windowSize)
  const visibleWords = words.slice(windowStart, windowEnd)

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 200,
        left: '10%',
        right: '10%',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '0.3em',
        ...style,
      }}
    >
      {visibleWords.map((word, i) => {
        const isActive = frame >= word.from && frame <= word.to
        const isPast = frame > word.to

        let scale = 1
        let color = inactiveColor

        if (variant === 'karaoke') {
          color = isActive ? activeColor : isPast ? 'white' : inactiveColor
        }

        if (variant === 'pop' && isActive) {
          const popProgress = sprng(frame - word.from, fps, { damping: 8, stiffness: 200 })
          scale = 1 + popProgress * 0.2
          color = activeColor
        } else if (variant === 'pop' && isPast) {
          color = 'white'
        }

        return (
          <span
            key={`${windowStart + i}`}
            style={{
              fontSize: 52,
              fontWeight: 800,
              color,
              transform: `scale(${scale})`,
              transition: 'none',
            }}
          >
            {word.text}
          </span>
        )
      })}
    </div>
  )
}
