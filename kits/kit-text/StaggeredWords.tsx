import React from 'react'
import { interpolate, useCurrentFrame, useVideoConfig } from '../../core'
import { sprng } from '../../lib'

export interface StaggeredWordsProps {
  text: string
  /** Frames between each word appearing */
  delayPerWord?: number
  /** Starting frame */
  startAt?: number
  /** Animation type */
  variant?: 'fade-up' | 'scale' | 'blur' | 'bounce'
  style?: React.CSSProperties
}

export const StaggeredWords: React.FC<StaggeredWordsProps> = ({
  text,
  delayPerWord = 5,
  startAt = 0,
  variant = 'fade-up',
  style,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const words = text.split(' ')

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.3em',
        justifyContent: 'center',
        fontSize: 56,
        fontWeight: 700,
        color: 'white',
        ...style,
      }}
    >
      {words.map((word, i) => {
        const delay = startAt + i * delayPerWord
        const progress = sprng(frame, fps, { damping: 14 }, delay)

        const variants: Record<string, React.CSSProperties> = {
          'fade-up': {
            opacity: progress,
            transform: `translateY(${interpolate(progress, [0, 1], [30, 0])}px)`,
          },
          scale: {
            opacity: progress,
            transform: `scale(${interpolate(progress, [0, 1], [0.3, 1])})`,
          },
          blur: {
            opacity: progress,
            filter: `blur(${interpolate(progress, [0, 1], [10, 0])}px)`,
          },
          bounce: {
            opacity: Math.min(progress * 2, 1),
            transform: `translateY(${interpolate(
              sprng(frame, fps, { damping: 8, stiffness: 200 }, delay),
              [0, 1],
              [40, 0],
            )}px)`,
          },
        }

        return (
          <span key={i} style={variants[variant]}>
            {word}
          </span>
        )
      })}
    </div>
  )
}
