import React from 'react'
import { AbsoluteFill, useCurrentFrame } from '../../core'

export interface PixelArtSceneProps {
  /** 2D array of color strings — null/undefined cells are transparent */
  pixels: (string | null)[][]
  /** Optional array of frames for animation (cycles through them) */
  frames?: (string | null)[][][]
  /** Animation speed: frames between pixel-frame changes */
  frameInterval?: number
  /** Size of each pixel cell in px */
  cellSize?: number
  /** Background color */
  background?: string
  /** Scale up with nearest-neighbor (pixelated) rendering */
  pixelated?: boolean
  /** Center the grid in the frame */
  centered?: boolean
}

/**
 * Returns an empty 2D array of the given dimensions.
 * Useful for building pixel art programmatically.
 */
export function createPixelFrame(
  width: number,
  height: number,
  fillColor?: string,
): (string | null)[][] {
  return Array.from({ length: height }, () =>
    Array.from({ length: width }, () => fillColor ?? null),
  )
}

export const PixelArtScene: React.FC<PixelArtSceneProps> = ({
  pixels,
  frames,
  frameInterval = 4,
  cellSize = 16,
  background = 'transparent',
  pixelated = true,
  centered = true,
}) => {
  const currentFrame = useCurrentFrame()

  const activePixels: (string | null)[][] =
    frames && frames.length > 0
      ? frames[Math.floor(currentFrame / frameInterval) % frames.length]
      : pixels

  const rows = activePixels.length
  const cols = rows > 0 ? activePixels[0].length : 0

  const grid = (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
        imageRendering: pixelated ? 'pixelated' : undefined,
      }}
    >
      {activePixels.map((row, rowIndex) =>
        row.map((color, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            style={{
              width: cellSize,
              height: cellSize,
              backgroundColor: color ?? 'transparent',
            }}
          />
        )),
      )}
    </div>
  )

  return (
    <AbsoluteFill style={{ backgroundColor: background }}>
      {centered ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          {grid}
        </div>
      ) : (
        grid
      )}
    </AbsoluteFill>
  )
}
