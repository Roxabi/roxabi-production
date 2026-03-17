import React from 'react'
import { useCurrentFrame, useVideoConfig } from '../../core'
import { sprng, cInterpolate } from '../../lib'

export type ShapeType = 'circle' | 'square' | 'triangle' | 'hexagon' | 'star'

export interface AnimatedShapeProps {
  type?: ShapeType
  size?: number
  color?: string
  /** "grow" | "rotate" | "pulse" | "morph" */
  animation?: 'grow' | 'rotate' | 'pulse' | 'morph'
  delay?: number
  style?: React.CSSProperties
}

const getClipPath = (type: ShapeType): string => {
  switch (type) {
    case 'circle':
      return 'circle(50% at 50% 50%)'
    case 'square':
      return 'inset(0)'
    case 'triangle':
      return 'polygon(50% 0%, 0% 100%, 100% 100%)'
    case 'hexagon':
      return 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
    case 'star':
      return 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
    default:
      return 'circle(50% at 50% 50%)'
  }
}

export const AnimatedShape: React.FC<AnimatedShapeProps> = ({
  type = 'circle',
  size = 100,
  color = '#3a86ff',
  animation = 'grow',
  delay = 0,
  style,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const progress = sprng(frame, fps, { damping: 12 }, delay)

  let transform = ''
  let scale = 1
  let opacity = 1

  switch (animation) {
    case 'grow':
      scale = progress
      opacity = progress
      break
    case 'rotate':
      scale = progress
      opacity = progress
      transform = `rotate(${cInterpolate(progress, [0, 1], [0, 360])}deg)`
      break
    case 'pulse': {
      const pulse = 1 + Math.sin(frame * 0.1) * 0.1
      scale = progress * pulse
      opacity = progress
      break
    }
    case 'morph':
      scale = progress
      opacity = progress
      break
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        clipPath: getClipPath(type),
        transform: `scale(${scale}) ${transform}`,
        opacity,
        ...style,
      }}
    />
  )
}
