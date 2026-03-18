import React, { useState, useCallback } from 'react'
import { createRoot } from 'react-dom/client'
import { Studio } from '../player/Studio'
import { FrameProvider } from '../core'
import type { CompositionConfig, VideoConfig } from '../core'
import { ShowcaseVideo } from '../showcase/ShowcaseVideo'
import { LyraLaunchTrailer } from '../showcase/LyraLaunchTrailer'

const compositions: CompositionConfig[] = [
  {
    id: 'lyra-launch-trailer',
    component: LyraLaunchTrailer,
    durationInFrames: 1560, // 52s @ 30fps
    fps: 30,
    width: 1920,
    height: 1080,
  },
  {
    id: 'showcase',
    component: ShowcaseVideo,
    durationInFrames: 1680, // 56s @ 30fps
    fps: 30,
    width: 1920,
    height: 1080,
  },
]

const params = new URLSearchParams(window.location.search)
const mode = params.get('mode')
const compositionId = params.get('composition')

if (mode === 'render' && compositionId) {
  // Render mode: headless frame-by-frame capture for Puppeteer
  const comp = compositions.find(c => c.id === compositionId)
  if (comp) {
    const RenderApp: React.FC = () => {
      const [frame, setFrame] = useState(0)
      const config: VideoConfig = {
        fps: comp.fps,
        width: comp.width,
        height: comp.height,
        durationInFrames: comp.durationInFrames,
      }

      const setFrameCallback = useCallback((f: number) => setFrame(f), [])

      // Register globals for Puppeteer renderer
      ;(window as any).__ROXVID_DURATION__ = comp.durationInFrames
      ;(window as any).__ROXVID_SET_FRAME__ = setFrameCallback

      const Component = comp.component
      return (
        <div id="render-root">
          <FrameProvider frame={frame} config={config}>
            <Component />
          </FrameProvider>
        </div>
      )
    }

    createRoot(document.getElementById('root')!).render(<RenderApp />)
  } else {
    document.getElementById('root')!.innerHTML = `<div id="render-root">Composition "${compositionId}" not found</div>`
  }
} else {
  // Studio mode: interactive dev preview
  createRoot(document.getElementById('root')!).render(<Studio compositions={compositions} />)
}
