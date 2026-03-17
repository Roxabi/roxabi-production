import puppeteer from 'puppeteer'
import { spawnSync } from 'child_process'
import * as path from 'path'
import * as fs from 'fs'
import { codecArgs, validateCompositionId, MAX_DURATION_FRAMES, type RenderConfig } from './config'

export async function render(config: RenderConfig) {
  const {
    compositionId: rawId,
    outputPath,
    width = 1920,
    height = 1080,
    fps = 30,
    codec = 'h264',
    crf = 18,
    audioPath,
  } = config

  const compositionId = validateCompositionId(rawId)

  const serverUrl = `http://localhost:3001`
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

  const codecArgList = codecArgs[codec]?.(crf) ?? codecArgs.h264(crf)
  const ffmpegArgs = [
    '-y', '-framerate', String(fps),
    '-i', `${framesDir}/frame-%06d.png`,
    ...codecArgList,
    ...(audioPath ? ['-i', audioPath, '-c:a', 'aac', '-b:a', '192k', '-shortest'] : []),
    outputPath,
  ]

  const result = spawnSync('ffmpeg', ffmpegArgs, { stdio: 'inherit' })
  if (result.status !== 0) {
    throw new Error(`FFmpeg exited with code ${result.status}`)
  }

  fs.rmSync(framesDir, { recursive: true })

  console.log(`\nDone: ${outputPath}`)
}
