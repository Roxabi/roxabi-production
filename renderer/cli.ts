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
import { QUALITY_PRESETS } from './config'
import type { BgmTrack, SfxCue } from './config'

const args = process.argv.slice(2)

// Support both positional and flag-based composition ID
let compositionId = args.find(a => a.startsWith('--composition='))?.split('=')[1]
if (!compositionId) {
  compositionId = args.find(a => !a.startsWith('--'))
}
const outputIndex = args.findIndex(a => a.startsWith('--output='))
const outputPath = outputIndex >= 0
  ? args[outputIndex].split('=')[1]
  : (args[1]?.startsWith('--') ? `out/${compositionId}.mp4` : (args[1] || `out/${compositionId}.mp4`))

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

// --quality preset (overrides --crf if both given)
const quality = flag('quality') as 'draft' | 'standard' | 'high' | undefined
const preset = quality ? QUALITY_PRESETS[quality] : undefined

// --format as codec alias: mp4→h264, webm→vp9
const format = flag('format')
const codecFromFormat = format === 'webm' ? 'vp9' : format === 'mp4' ? 'h264' : undefined

// --strict
const strict = args.includes('--strict')

// --timeout <ms>
const timeoutIdx = args.indexOf('--timeout')
const gateTimeout = timeoutIdx !== -1 ? parseInt(args[timeoutIdx + 1], 10) : undefined

// --docker: stub only
if (args.includes('--docker')) {
  console.warn('--docker: not yet implemented, rendering locally')
}

if (strict) {
  const port = parseInt(process.env.ROXVID_PORT || '3002', 10)
  const serverUrl = `http://localhost:${port}`
  const { runGates } = await import('./gates/index.js')
  console.log('Running pre-render gates (--strict)...')
  const findings = await runGates(compositionId, process.cwd(), serverUrl, { timeout: gateTimeout })
  if (findings.length > 0) {
    const errors = findings.filter(f => f.severity === 'error')
    const warnings = findings.filter(f => f.severity === 'warning')
    for (const f of findings) {
      const icon = f.severity === 'error' ? 'x' : '!'
      console.error(`  ${icon} [${f.gate}] ${f.file}:${f.line} — ${f.message}`)
    }
    if (errors.length > 0) {
      console.error(`\nGate failed: ${errors.length} error(s), ${warnings.length} warning(s). Fix before rendering.`)
      process.exit(1)
    }
    console.log(`  ${warnings.length} warning(s) (non-blocking).`)
  } else {
    console.log('Gates passed.\n')
  }
}

render({
  compositionId,
  outputPath,
  audioPath: flag('audio'),
  bgm: parseBgm(flag('bgm')),
  sfx: sfxRaw.length ? parseSfx(sfxRaw) : undefined,
  crf:    preset?.crf ?? (flag('crf') ? parseInt(flag('crf')!) : undefined),
  fps:    flag('fps')    ? parseInt(flag('fps')!)    : undefined,
  width:  flag('width')  ? parseInt(flag('width')!)  : undefined,
  height: flag('height') ? parseInt(flag('height')!) : undefined,
  codec:  (flag('codec') ?? codecFromFormat) as 'h264' | 'prores' | 'vp9' | undefined,
  strict,
}).catch(err => {
  console.error('Render failed:', err)
  process.exit(1)
})
