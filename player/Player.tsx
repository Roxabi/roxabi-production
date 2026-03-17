import React, { useState, useRef, useCallback, useEffect } from 'react'
import { FrameProvider } from '../core/context'
import type { VideoConfig, CompositionConfig } from '../core/types'

export const Player: React.FC<{
  composition: CompositionConfig
  autoPlay?: boolean
  style?: React.CSSProperties
}> = ({ composition, autoPlay = false, style }) => {
  const { component: Component, durationInFrames, fps, width, height } = composition
  const [frame, setFrame] = useState(0)
  const [playing, setPlaying] = useState(autoPlay)
  const rafRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)

  const config: VideoConfig = { fps, width, height, durationInFrames }

  useEffect(() => {
    if (!playing) return

    const tick = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp
      const delta = timestamp - lastTimeRef.current

      if (delta >= 1000 / fps) {
        setFrame(prev => {
          const next = prev + 1
          return next >= durationInFrames ? 0 : next
        })
        lastTimeRef.current = timestamp
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [playing, fps, durationInFrames])

  const togglePlay = useCallback(() => {
    setPlaying(p => !p)
    lastTimeRef.current = 0
  }, [])

  const currentTime = (frame / fps).toFixed(1)
  const totalTime = (durationInFrames / fps).toFixed(1)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, ...style }}>
      <div style={{
        position: 'relative',
        width, height,
        overflow: 'hidden',
        background: '#000',
        transform: `scale(${Math.min(1, 960 / width)})`,
        transformOrigin: 'top left',
      }}>
        <FrameProvider frame={frame} config={config}>
          <Component />
        </FrameProvider>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}>
        <button onClick={togglePlay} style={{ fontSize: 18, cursor: 'pointer', background: 'none', border: 'none', color: '#fff' }}>
          {playing ? '\u23F8' : '\u25B6'}
        </button>

        <input
          type="range"
          min={0}
          max={durationInFrames - 1}
          value={frame}
          onChange={e => {
            setFrame(Number(e.target.value))
            setPlaying(false)
          }}
          style={{ flex: 1 }}
        />

        <span style={{ fontFamily: 'monospace', fontSize: 13, color: '#888', minWidth: 120 }}>
          {currentTime}s / {totalTime}s  F{frame}
        </span>
      </div>
    </div>
  )
}
