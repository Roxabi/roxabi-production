import type { CompositionConfig } from '@core'
import { ShowcaseVideo } from './ShowcaseVideo'

const compositions: CompositionConfig[] = [
  {
    id: 'showcase',
    component: ShowcaseVideo,
    durationInFrames: 1680, // 56s @ 30fps
    fps: 30,
    width: 1920,
    height: 1080,
  },
]

export default compositions
