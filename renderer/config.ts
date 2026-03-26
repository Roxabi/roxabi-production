export interface SfxCue {
  file: string
  at: number       // seconds from start
  volume?: number  // 0–1, default 0.8
}

export interface BgmTrack {
  file: string
  volume?: number   // 0–1, default 0.2
  fadeIn?: number   // seconds, default 2
  fadeOut?: number  // seconds, default 2
}

export interface RenderConfig {
  compositionId: string
  outputPath: string
  width?: number
  height?: number
  fps?: number
  codec?: 'h264' | 'prores' | 'vp9'
  crf?: number
  audioPath?: string  // single VO track (backward-compatible)
  bgm?: BgmTrack      // background music
  sfx?: SfxCue[]      // timecoded sound effects
  concurrency?: number
}

export const codecArgs: Record<string, (crf: number) => string[]> = {
  h264: (crf) => ['-c:v', 'libx264', '-preset', 'medium', '-crf', String(crf), '-pix_fmt', 'yuv420p'],
  prores: () => ['-c:v', 'prores_ks', '-profile:v', '3', '-pix_fmt', 'yuva444p10le'],
  vp9: (crf) => ['-c:v', 'libvpx-vp9', '-crf', String(crf), '-b:v', '0', '-pix_fmt', 'yuv420p'],
}

const COMPOSITION_ID_RE = /^[a-zA-Z0-9_-]+$/

export function validateCompositionId(id: string): string {
  if (!COMPOSITION_ID_RE.test(id)) {
    throw new Error(`Invalid compositionId: "${id}" — must match ${COMPOSITION_ID_RE}`)
  }
  return id
}

export const MAX_DURATION_FRAMES = 36000 // 20 min @ 30fps
