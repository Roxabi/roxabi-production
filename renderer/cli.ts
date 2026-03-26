#!/usr/bin/env node
/**
 * CLI renderer
 *
 * Usage:
 *   npx tsx renderer/cli.ts <CompositionId> [output.mp4] [flags]
 *
 * Flags:
 *   --audio=path.wav                    single VO track
 *   --bgm=path.wav                      background music (default vol 0.2)
 *   --bgm=path.wav:vol=0.3              background music with custom volume
 *   --sfx=t=2.5:file=path.wav           SFX cue at 2.5s (default vol 0.8)
 *   --sfx=t=8.0:file=path.wav:vol=0.6  SFX cue with custom volume
 *   --crf=18  --fps=30  --width=1920  --height=1080  --codec=h264
 */

import { render } from './render'
import type { BgmTrack, SfxCue } from './config'

const args = process.argv.slice(2)
const compositionId = args[0]
const outputPath = args[1]?.startsWith('--') ? `out/${args[0]}.mp4` : (args[1] || `out/${args[0]}.mp4`)

if (!compositionId) {
  console.error('Usage: npx tsx renderer/cli.ts <CompositionId> [output.mp4] [--audio=...] [--bgm=...] [--sfx=...]')
  process.exit(1)
}

function flag(name: string): string | undefined {
  return args.find(a => a.startsWith(`--${name}=`))?.slice(name.length + 3)
}

// --bgm=path.wav  or  --bgm=path.wav:vol=0.3
function parseBgm(raw: string | undefined): BgmTrack | undefined {
  if (!raw) return undefined
  const parts = raw.split(':')
  const file = parts[0]
  const vol = parts.find(p => p.startsWith('vol='))
  return {
    file,
    volume: vol ? parseFloat(vol.split('=')[1]) : undefined,
  }
}

// --sfx=t=2.5:file=path.wav  or  --sfx=t=2.5:file=path.wav:vol=0.6
function parseSfx(raw: string[]): SfxCue[] {
  return raw.map(r => {
    const parts = r.slice('--sfx='.length).split(':')
    const at   = parseFloat(parts.find(p => p.startsWith('t='))?.split('=')[1] ?? '0')
    const file = parts.find(p => p.startsWith('file='))?.split('=')[1] ?? ''
    const vol  = parts.find(p => p.startsWith('vol='))?.split('=')[1]
    if (!file) throw new Error(`--sfx missing file: ${r}`)
    return { at, file, volume: vol ? parseFloat(vol) : undefined }
  })
}

const sfxRaw = args.filter(a => a.startsWith('--sfx='))

render({
  compositionId,
  outputPath,
  audioPath: flag('audio'),
  bgm: parseBgm(flag('bgm')),
  sfx: sfxRaw.length ? parseSfx(sfxRaw) : undefined,
  crf:    flag('crf')    ? parseInt(flag('crf')!)    : undefined,
  fps:    flag('fps')    ? parseInt(flag('fps')!)    : undefined,
  width:  flag('width')  ? parseInt(flag('width')!)  : undefined,
  height: flag('height') ? parseInt(flag('height')!) : undefined,
  codec:  flag('codec')  as 'h264' | 'prores' | 'vp9' | undefined,
}).catch(err => {
  console.error('Render failed:', err)
  process.exit(1)
})
