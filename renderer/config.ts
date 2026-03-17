export interface RenderConfig {
  compositionId: string
  outputPath: string
  width?: number
  height?: number
  fps?: number
  codec?: 'h264' | 'prores' | 'vp9'
  crf?: number
  audioPath?: string
  concurrency?: number
}

export const codecFlags: Record<string, (crf: number) => string> = {
  h264: (crf) => `-c:v libx264 -preset medium -crf ${crf} -pix_fmt yuv420p`,
  prores: () => `-c:v prores_ks -profile:v 3 -pix_fmt yuva444p10le`,
  vp9: (crf) => `-c:v libvpx-vp9 -crf ${crf} -b:v 0 -pix_fmt yuv420p`,
}
