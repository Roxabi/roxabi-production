#!/usr/bin/env node
/**
 * CLI renderer
 *
 * Usage:
 *   npx tsx renderer/cli.ts <CompositionId> [output.mp4] [flags]
 *   npx tsx renderer/cli.ts lint     <CompositionId> [--json]
 *   npx tsx renderer/cli.ts validate <CompositionId> [--json]
 *   npx tsx renderer/cli.ts inspect  <CompositionId> [--json]
 *
 * Flags:
 *   --audio=path.wav                    single VO track
 *   --bgm=path.wav                      background music (default vol 0.2)
 *   --bgm=path.wav:vol=0.3              background music with custom volume
 *   --sfx=t=2.5:file=path.wav           SFX cue at 2.5s (default vol 0.8)
 *   --sfx=t=8.0:file=path.wav:vol=0.6  SFX cue with custom volume
 *   --crf=18  --fps=30  --width=1920  --height=1080  --codec=h264
 */

import * as path from 'path'
import type { Finding } from './gates/determinism'
import type { LintResult } from './gates/lint'
import { validateCompositionId } from './config'

/** Discriminated union so `LintFinding.rule` is preserved through the CLI result path. */
type GateRunResult = LintResult | { findings: Finding[]; exitCode: number }

const args = process.argv.slice(2)
const jsonOutput = args.includes('--json')

// ---------------------------------------------------------------------------
// Subcommand detection: lint | validate | inspect must be FIRST positional arg
// ---------------------------------------------------------------------------

const SUBCOMMANDS = ['lint', 'validate', 'inspect'] as const
type Subcommand = typeof SUBCOMMANDS[number]

const firstPositional = args.find(a => !a.startsWith('--'))
const subcommand = SUBCOMMANDS.includes(firstPositional as Subcommand)
  ? firstPositional as Subcommand
  : undefined

// ---------------------------------------------------------------------------
// Gate subcommand handler
// ---------------------------------------------------------------------------

function printFindings(findings: Finding[]): void {
  if (findings.length === 0) {
    console.log('No findings.')
    return
  }
  const errors = findings.filter(f => f.severity === 'error')
  const warnings = findings.filter(f => f.severity === 'warning')
  for (const f of findings) {
    const icon = f.severity === 'error' ? 'x' : '!'
    const loc = f.line > 0 ? `${f.file}:${f.line}` : f.file
    console.log(`  ${icon} [${f.gate}] ${loc} — ${f.message}`)
  }
  console.log(`\n${errors.length} error(s), ${warnings.length} warning(s).`)
}

if (subcommand) {
  // Consume the subcommand keyword by index — avoids collision if a composition
  // happens to share the same name as a subcommand elsewhere in the args list.
  const subCmdIdx = args.findIndex(a => a === subcommand)
  const remainingArgs = args.filter((_, i) => i !== subCmdIdx && !args[i].startsWith('--'))
  const compositionId = remainingArgs[0]

  if (!compositionId) {
    console.error(`Usage: npx tsx renderer/cli.ts ${subcommand} <CompositionId> [--json]`)
    process.exit(1)
  }

  // Guard: reject path-traversal attempts (e.g. "../../etc/passwd")
  try {
    validateCompositionId(compositionId)
  } catch {
    console.error(`Invalid composition ID: "${compositionId}" — must match /^[a-zA-Z0-9_-]+$/`)
    process.exit(1)
  }

  const port = parseInt(process.env.ROXVID_PORT || '3002', 10)
  const serverUrl = `http://localhost:${port}`
  const root = process.cwd()

  const { runLint, runValidate, runInspect } = await import('./gates/index.js')

  let result: GateRunResult

  if (subcommand === 'lint') {
    result = await runLint(compositionId, root)
  } else if (subcommand === 'validate') {
    result = await runValidate(compositionId, serverUrl)
  } else {
    result = await runInspect(compositionId, serverUrl)
  }

  if (jsonOutput) {
    console.log(JSON.stringify({ gate: subcommand, compositionId, ...result }, null, 2))
  } else {
    printFindings(result.findings)
  }

  process.exit(result.exitCode)
}

// ---------------------------------------------------------------------------
// Existing render flow (unchanged)
// ---------------------------------------------------------------------------

import { render } from './render'
import { QUALITY_PRESETS } from './config'
import type { BgmTrack, SfxCue } from './config'
import { findProductionDir } from '../config/paths'

// Support both positional and flag-based composition ID
let compositionId = args.find(a => a.startsWith('--composition='))?.split('=')[1]
if (!compositionId) {
  compositionId = args.find(a => !a.startsWith('--'))
}

if (!compositionId) {
  console.error('Usage: npx tsx renderer/cli.ts <CompositionId> [output.mp4] [--audio=...] [--bgm=...] [--sfx=...]')
  process.exit(1)
}

// Guard: reserved subcommand keywords cannot be used as composition IDs in the render path.
// (They would have been dispatched above — reaching here means the user typed something like
// `cli.ts lint` without a following composition ID, which the subcommand handler already
// catches.  This guard covers the edge case of --composition=lint or arg-order ambiguity.)
if (SUBCOMMANDS.includes(compositionId as Subcommand)) {
  console.error(
    `Composition name '${compositionId}' collides with reserved subcommand keyword. ` +
    `Rename the composition or use --composition= with a different name.`,
  )
  process.exit(1)
}

// Default output: <production-dir>/out/<id>.mp4 if production found, else ./out/<id>.mp4
const productionDir = findProductionDir(compositionId)
const defaultOutput = productionDir
  ? path.join(productionDir, 'out', `${compositionId}.mp4`)
  : `out/${compositionId}.mp4`

const outputIndex = args.findIndex(a => a.startsWith('--output='))
const outputPath = outputIndex >= 0
  ? args[outputIndex].split('=')[1]
  : (args[1]?.startsWith('--') ? defaultOutput : (args[1] || defaultOutput))

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
