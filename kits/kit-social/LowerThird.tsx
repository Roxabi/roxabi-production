import React from 'react'
import { useCurrentFrame, useVideoConfig } from '../../core'
import { sprng, cInterpolate } from '../../lib'

export interface LowerThirdProps {
  name: string
  title?: string
  accentColor?: string
  /** "left" | "right" */
  position?: 'left' | 'right'
  delay?: number
  style?: React.CSSProperties
}

export const LowerThird: React.FC<LowerThirdProps> = ({
  name,
  title,
  accentColor = '#3a86ff',
  position = 'left',
  delay = 0,
  style,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const progress = sprng(frame, fps, { damping: 15 }, delay)

  const barWidth = cInterpolate(progress, [0, 1], [0, 100])
  const textOpacity = cInterpolate(progress, [0.4, 1], [0, 1])
  const translateX = cInterpolate(progress, [0, 1], [position === 'left' ? -40 : 40, 0])

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 80,
        [position]: 60,
        display: 'flex',
        flexDirection: 'column',
        alignItems: position === 'left' ? 'flex-start' : 'flex-end',
        transform: `translateX(${translateX}px)`,
        ...style,
      }}
    >
      <div
        style={{
          height: 3,
          width: `${barWidth}%`,
          maxWidth: 300,
          backgroundColor: accentColor,
          marginBottom: 8,
        }}
      />
      <div
        style={{
          backgroundColor: 'rgba(0,0,0,0.7)',
          padding: '12px 24px',
          borderRadius: 4,
          backdropFilter: 'blur(10px)',
          opacity: textOpacity,
        }}
      >
        <div style={{ color: 'white', fontSize: 28, fontWeight: 700 }}>{name}</div>
        {title && (
          <div style={{ color: accentColor, fontSize: 18, fontWeight: 500, marginTop: 2 }}>
            {title}
          </div>
        )}
      </div>
    </div>
  )
}
