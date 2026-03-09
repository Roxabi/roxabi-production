import { Composition } from 'remotion'
import { LyraBirth } from './Video'

export const RemotionRoot: React.FC = () => {
  const FPS = 30
  const DURATION_SEC = 562 // 9:22

  return (
    <Composition
      id="LyraBirth"
      component={LyraBirth}
      durationInFrames={DURATION_SEC * FPS}
      fps={FPS}
      width={1920}
      height={1080}
    />
  )
}
