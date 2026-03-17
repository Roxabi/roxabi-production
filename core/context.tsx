import React, { createContext, useContext } from 'react'
import type { VideoConfig } from './types'

const FrameContext = createContext<number>(0)
const VideoConfigContext = createContext<VideoConfig>({
  fps: 30,
  width: 1920,
  height: 1080,
  durationInFrames: 900,
})

export const useCurrentFrame = (): number => useContext(FrameContext)

export const useVideoConfig = (): VideoConfig => useContext(VideoConfigContext)

export const FrameProvider: React.FC<{
  frame: number
  config: VideoConfig
  children: React.ReactNode
}> = ({ frame, config, children }) => (
  <VideoConfigContext.Provider value={config}>
    <FrameContext.Provider value={frame}>
      {children}
    </FrameContext.Provider>
  </VideoConfigContext.Provider>
)
