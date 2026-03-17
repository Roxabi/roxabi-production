import React from 'react'
import { useCurrentFrame, useVideoConfig, FrameProvider } from './context'

export const AbsoluteFill: React.FC<{
  children?: React.ReactNode
  style?: React.CSSProperties
}> = ({ children, style }) => (
  <div
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      ...style,
    }}
  >
    {children}
  </div>
)

export const Sequence: React.FC<{
  from: number
  durationInFrames?: number
  children: React.ReactNode
  style?: React.CSSProperties
}> = ({ from, durationInFrames = Infinity, children, style }) => {
  const parentFrame = useCurrentFrame()
  const config = useVideoConfig()
  const localFrame = parentFrame - from

  if (localFrame < 0 || localFrame >= durationInFrames) return null

  return (
    <FrameProvider frame={localFrame} config={config}>
      <AbsoluteFill style={style}>{children}</AbsoluteFill>
    </FrameProvider>
  )
}

export const Series: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const elements = React.Children.toArray(children)
  let offset = 0

  return (
    <>
      {elements.map((child, i) => {
        if (!React.isValidElement(child)) return null
        const duration = (child.props as { durationInFrames?: number }).durationInFrames || 150
        const from = offset
        offset += duration
        return (
          <Sequence key={i} from={from} durationInFrames={duration}>
            {child}
          </Sequence>
        )
      })}
    </>
  )
}

export const Audio: React.FC<{
  src: string
  volume?: number
  startFrom?: number
}> = ({ src, volume = 1, startFrom = 0 }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const audioRef = React.useRef<HTMLAudioElement>(null)

  React.useEffect(() => {
    const el = audioRef.current
    if (!el) return

    el.volume = volume
    const targetTime = (frame - startFrom) / fps
    if (Math.abs(el.currentTime - targetTime) > 0.1) {
      el.currentTime = Math.max(0, targetTime)
    }
  }, [frame, fps, volume, startFrom])

  return <audio ref={audioRef} src={src} />
}
