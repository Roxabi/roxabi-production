import puppeteer from 'puppeteer'
import { spawnSync } from 'child_process'
import * as path from 'path'
import * as fs from 'fs'
import { codecArgs, validateCompositionId, MAX_DURATION_FRAMES, DEFAULT_FPS, DEFAULT_CODEC, QUALITY_PRESETS, type RenderConfig, type BgmTrack, type SfxCue } from './config'

// ---------------------------------------------------------------------------
// Audio helpers
// ---------------------------------------------------------------------------

interface AudioArgs {
  before: string[]  // extra -i inputs + optional -filter_complex
  after: string[]   // -map flags + audio codec flags (empty when no audio)
}

function buildAudioArgs(
  audioPath: string | undefined,
  bgm: BgmTrack | undefined,
  sfx: SfxCue[] | undefined,
  durationSeconds: number,
): AudioArgs {
  const hasAudio = audioPath || bgm || sfx?.length
  if (!hasAudio) return { before: [], after: [] }

  // Simple path: single VO, no mixing
  if (audioPath && !bgm && !sfx?.length) {
    return {
      before: ['-i', audioPath],
      after: ['-c:a', 'aac', '-b:a', '192k', '-shortest'],
    }
  }

  // Multi-track path: build filter_complex
  const inputs: string[] = []
  const filterLines: string[] = []
  const mixLabels: string[] = []
  let idx = 1  // [0] is always the frames input

  if (audioPath) {
    inputs.push('-i', audioPath)
    filterLines.push(`[${idx}]volume=1.0[vo]`)
    mixLabels.push('[vo]')
    idx++
  }

  if (bgm) {
    const vol = bgm.volume ?? 0.2
    const fadeIn = bgm.fadeIn ?? 2
    const fadeOut = bgm.fadeOut ?? 2
    const fadeOutStart = Math.max(0, durationSeconds - fadeOut)
    inputs.push('-i', bgm.file)
    filterLines.push(
      `[${idx}]volume=${vol},afade=t=in:st=0:d=${fadeIn},afade=t=out:st=${fadeOutStart.toFixed(2)}:d=${fadeOut}[bgm]`,
    )
    mixLabels.push('[bgm]')
    idx++
  }

  sfx?.forEach((cue, i) => {
    const vol = cue.volume ?? 0.8
    const delayMs = Math.round(cue.at * 1000)
    inputs.push('-i', cue.file)
    filterLines.push(`[${idx}]adelay=${delayMs},volume=${vol}[s${i}]`)
    mixLabels.push(`[s${i}]`)
    idx++
  })

  filterLines.push(
    `${mixLabels.join('')}amix=inputs=${mixLabels.length}:normalize=0:duration=first[aout]`,
  )

  return {
    before: [...inputs, '-filter_complex', filterLines.join(';\n')],
    after: ['-map', '0:v', '-map', '[aout]', '-c:a', 'aac', '-b:a', '192k', '-shortest'],
  }
}

export async function render(config: RenderConfig) {
  const {
    compositionId: rawId,
    outputPath,
    width = 1920,
    height = 1080,
    fps = DEFAULT_FPS,
    codec = DEFAULT_CODEC,
    crf = QUALITY_PRESETS.standard.crf,
    audioPath,
    bgm,
    sfx,
  } = config

  const compositionId = validateCompositionId(rawId)

  const port = parseInt(process.env.ROXVID_PORT || '3002', 10)
  const serverUrl = `http://localhost:${port}`
  const framesDir = path.join('/tmp', `roxvid-${compositionId}-${Date.now()}`)
  fs.mkdirSync(framesDir, { recursive: true })

  const outDir = path.dirname(outputPath)
  if (outDir) fs.mkdirSync(outDir, { recursive: true })

  console.log(`Rendering ${compositionId} → ${outputPath}`)
  console.log(`Resolution: ${width}x${height} @ ${fps}fps`)

  const browser = await puppeteer.launch({
    headless: true,
    args: [`--window-size=${width},${height}`],
  })

  const page = await browser.newPage()
  await page.setViewport({ width, height, deviceScaleFactor: 1 })

  await page.goto(`${serverUrl}?composition=${encodeURIComponent(compositionId)}&mode=render`)
  await page.waitForSelector('#render-root', { timeout: 10000 })

  const rawDuration = await page.evaluate(() => {
    return (window as any).__ROXVID_DURATION__ || 900
  })

  const durationInFrames = Math.min(
    typeof rawDuration === 'number' && isFinite(rawDuration) ? rawDuration : 900,
    MAX_DURATION_FRAMES,
  )

  console.log(`Frames: ${durationInFrames} (${(durationInFrames / fps).toFixed(1)}s)`)

  for (let frame = 0; frame < durationInFrames; frame++) {
    await page.evaluate((f: number) => {
      (window as any).__ROXVID_SET_FRAME__(f)
    }, frame)

    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(resolve)))

    const framePath = path.join(framesDir, `frame-${String(frame).padStart(6, '0')}.png`)
    await page.screenshot({ path: framePath, type: 'png' })

    if (frame % 30 === 0) {
      const pct = ((frame / durationInFrames) * 100).toFixed(1)
      process.stdout.write(`\r  Progress: ${pct}% (frame ${frame}/${durationInFrames})`)
    }
  }

  console.log('\n  Frames captured. Encoding...')
  await browser.close()

  const durationSeconds = durationInFrames / fps
  const { before: audioBefore, after: audioAfter } = buildAudioArgs(audioPath, bgm, sfx, durationSeconds)

  if (bgm || sfx?.length) {
    const tracks = [audioPath && 'VO', bgm && 'BGM', sfx?.length && `${sfx.length} SFX`].filter(Boolean)
    console.log(`  Audio: ${tracks.join(' + ')}`)
    sfx?.forEach(c => console.log(`    sfx  t=${c.at}s  ${path.basename(c.file)}  vol=${c.volume ?? 0.8}`))
  }

  const codecArgList = codecArgs[codec]?.(crf) ?? codecArgs.h264(crf)
  const ffmpegArgs = [
    '-y', '-framerate', String(fps),
    '-i', `${framesDir}/frame-%06d.png`,
    ...audioBefore,
    ...codecArgList,
    ...audioAfter,
    outputPath,
  ]

  const result = spawnSync('ffmpeg', ffmpegArgs, { stdio: 'inherit' })
  if (result.status !== 0) {
    throw new Error(`FFmpeg exited with code ${result.status}`)
  }

  fs.rmSync(framesDir, { recursive: true })

  console.log(`\nDone: ${outputPath}`)
}
