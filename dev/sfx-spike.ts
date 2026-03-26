#!/usr/bin/env tsx
/**
 * dev/sfx-spike.ts
 *
 * Spike: validate multi-track FFmpeg filter_complex audio mixing.
 * Uses synthetic lavfi sources (sine tones + noise bursts) as stand-in SFX.
 * No real SFX files required.
 *
 * Output:
 *   out/sfx-spike.wav          — 20s mixed audio (VO + BGM + 4 SFX cues)
 *   out/sfx-spike-video.mp4    — same mix merged onto lyra-launch-v0.2.1c-voiced.mp4
 *
 * Run: npx tsx dev/sfx-spike.ts
 */

import { spawnSync } from 'child_process'
import * as path from 'path'
import * as fs from 'fs'

const ROOT   = path.resolve(process.cwd())
const OUT    = path.join(ROOT, 'out')
const TMP    = `/tmp/sfx-spike-${Date.now()}`
const VO     = path.join(OUT, 'lyra-trailer-vo-52s.wav')
const VIDEO  = path.join(OUT, 'lyra-launch-v0.2.1c-voiced.mp4')
const DURATION = 20  // seconds to mix

fs.mkdirSync(TMP, { recursive: true })

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function ffmpeg(args: string[], label: string, silent = false): boolean {
  const result = spawnSync('ffmpeg', args, {
    stdio: silent ? ['inherit', 'pipe', 'pipe'] : 'inherit',
  })
  if (result.status !== 0) {
    if (silent) console.error(result.stderr?.toString())
    console.error(`✗ ${label}`)
    return false
  }
  console.log(`  ✓ ${label}`)
  return true
}

// ---------------------------------------------------------------------------
// Step 1 — Generate synthetic SFX to /tmp
// ---------------------------------------------------------------------------

console.log('\n=== SFX Multi-track Spike ===')
console.log(`Duration: ${DURATION}s  |  Tracks: VO + BGM + 4 SFX cues\n`)

type SfxDef = { id: string; file: string; dur: number; at: number; vol: number; label: string }

const sfxDefs: SfxDef[] = [
  { id: 'whoosh',  file: '', dur: 1.0, at: 2.0,  vol: 0.65, label: 'Whoosh  (t=2s)'   },
  { id: 'impact1', file: '', dur: 0.5, at: 8.0,  vol: 0.80, label: 'Impact  (t=8s)'   },
  { id: 'ding',    file: '', dur: 1.5, at: 13.5, vol: 0.50, label: 'Ding    (t=13.5s)' },
  { id: 'impact2', file: '', dur: 0.4, at: 18.5, vol: 0.75, label: 'Impact  (t=18.5s)' },
]

for (const s of sfxDefs) {
  s.file = path.join(TMP, `${s.id}.wav`)

  // whoosh = sine sweep (rising frequency)
  // ding   = high sine with natural decay via envelope
  // impact = white noise burst
  const isNoise = s.id.startsWith('impact')
  const src = isNoise
    ? `anoisesrc=d=${s.dur}:color=white:sample_rate=44100`
    : s.id === 'whoosh'
      ? `sine=frequency=180:sample_rate=44100`  // low-ish tone for sweep feel
      : `sine=frequency=880:sample_rate=44100`  // ding

  if (!ffmpeg([
    '-y', '-f', 'lavfi', '-i', src,
    '-t', String(s.dur),
    // apply a short fade-out to avoid hard clicks
    '-af', `afade=t=out:st=${Math.max(0, s.dur - 0.15)}:d=0.15`,
    '-c:a', 'pcm_s16le', '-ar', '44100', '-ac', '1',
    s.file,
  ], `${s.label} → ${s.id}.wav`)) process.exit(1)
}

// BGM: two-harmonic ambient drone
const bgmFile = path.join(TMP, 'bgm.wav')
if (!ffmpeg([
  '-y',
  '-f', 'lavfi', '-i', `sine=frequency=55:sample_rate=44100`,
  '-f', 'lavfi', '-i', `sine=frequency=110:sample_rate=44100`,
  '-filter_complex', '[0][1]amix=inputs=2:normalize=0[out]',
  '-map', '[out]',
  '-t', String(DURATION + 2),
  '-c:a', 'pcm_s16le', '-ar', '44100', '-ac', '1',
  bgmFile,
], 'BGM drone (55Hz + 110Hz)')) process.exit(1)

// ---------------------------------------------------------------------------
// Step 2 — Build filter_complex
// ---------------------------------------------------------------------------
//
//  [0] VO       → trim to DURATION, normalise SR
//  [1] BGM      → low volume, fade in/out
//  [2..5] SFX   → adelay to scene timecode, volume per cue
//  amix all     → normalize=0 (no auto-gain reduction on overlap)

const inputs: string[] = [
  '-i', VO,
  '-i', bgmFile,
  ...sfxDefs.flatMap(s => ['-i', s.file]),
]

const filterLines: string[] = [
  `[0]atrim=0:${DURATION},asetpts=PTS-STARTPTS,aresample=44100,volume=1.0[vo]`,
  `[1]volume=0.15,afade=t=in:st=0:d=2,afade=t=out:st=${DURATION - 2}:d=2[bgm]`,
]
sfxDefs.forEach((s, i) => {
  const delayMs = Math.round(s.at * 1000)
  filterLines.push(`[${i + 2}]adelay=${delayMs},volume=${s.vol}[s${i}]`)
})
const mixLabels = ['[vo]', '[bgm]', ...sfxDefs.map((_, i) => `[s${i}]`)].join('')
filterLines.push(`${mixLabels}amix=inputs=${2 + sfxDefs.length}:normalize=0:duration=first[aout]`)

console.log('\nFilter complex:')
filterLines.forEach(l => console.log('  ' + l))

// ---------------------------------------------------------------------------
// Step 3 — Run mix → out/sfx-spike.wav
// ---------------------------------------------------------------------------

const audioOut = path.join(OUT, 'sfx-spike.wav')
console.log('\nRunning audio mix...')
if (!ffmpeg([
  '-y',
  ...inputs,
  '-filter_complex', filterLines.join(';\n'),
  '-map', '[aout]',
  '-c:a', 'pcm_s16le', '-ar', '44100',
  audioOut,
], 'audio mix → sfx-spike.wav')) process.exit(1)

// ---------------------------------------------------------------------------
// Step 4 — Merge mix onto video (if video exists)
// ---------------------------------------------------------------------------

const videoOut = path.join(OUT, 'sfx-spike-video.mp4')
if (fs.existsSync(VIDEO)) {
  console.log('\nMerging onto video...')
  ffmpeg([
    '-y',
    '-i', VIDEO,
    '-i', audioOut,
    '-map', '0:v', '-map', '1:a',
    '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest',
    videoOut,
  ], 'video merge → sfx-spike-video.mp4')
} else {
  console.log(`\n  (skipping video merge — ${VIDEO} not found)`)
}

// ---------------------------------------------------------------------------
// Step 5 — Volume check
// ---------------------------------------------------------------------------

console.log('\nVolume analysis:')
const probe = spawnSync('ffmpeg', [
  '-i', audioOut, '-af', 'volumedetect', '-f', 'null', '-',
], { stdio: ['inherit', 'pipe', 'pipe'] })
const probeOut = (probe.stderr?.toString() ?? '') + (probe.stdout?.toString() ?? '')
const maxVol  = probeOut.match(/max_volume:\s*([-\d.]+)\s*dB/)?.[1] ?? '?'
const meanVol = probeOut.match(/mean_volume:\s*([-\d.]+)\s*dB/)?.[1] ?? '?'
const clipping = parseFloat(maxVol) >= 0

console.log(`  max_volume:  ${maxVol} dB  ${clipping ? '⚠ CLIPPING — lower SFX/BGM vol' : '✓ OK'}`)
console.log(`  mean_volume: ${meanVol} dB`)

// ---------------------------------------------------------------------------
// Cleanup + summary
// ---------------------------------------------------------------------------

fs.rmSync(TMP, { recursive: true })

const audioSize = (fs.statSync(audioOut).size / 1024 / 1024).toFixed(2)
const videoSize = fs.existsSync(videoOut)
  ? (fs.statSync(videoOut).size / 1024 / 1024).toFixed(2)
  : null

console.log('\n--- Output ---')
console.log(`  out/sfx-spike.wav          ${audioSize} MB`)
if (videoSize) console.log(`  out/sfx-spike-video.mp4   ${videoSize} MB`)
console.log('\nSpike complete.')
console.log('Next: swap synthetic SFX for real files → integrate into RenderConfig\n')
