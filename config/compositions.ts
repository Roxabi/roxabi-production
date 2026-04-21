import type { CompositionConfig } from '../core'
import { LyraLaunchTrailer } from '../showcase/LyraLaunchTrailer'
import { QayaTLDR } from '../showcase/QayaTLDR'
import { ShowcaseVideo } from '../showcase/ShowcaseVideo'

export const compositions: CompositionConfig[] = [
  {
    id: 'lyra-launch-trailer',
    component: LyraLaunchTrailer,
    durationInFrames: 1560, // 52s @ 30fps
    fps: 30,
    width: 1920,
    height: 1080,
  },
  {
    id: 'qaya-tldr',
    component: QayaTLDR,
    durationInFrames: 900, // 30s @ 30fps
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
