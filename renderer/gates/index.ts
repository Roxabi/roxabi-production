import puppeteer from 'puppeteer'
import { scanComposition } from './determinism'
import { checkContrast } from './validate'
import { checkOverflow } from './inspect'
import { runLint as _runLint } from './lint'
import type { Finding } from './determinism'

export { scanComposition }  // re-export for external callers; prefer runLint for new code

export type { Finding }

export interface GateOptions {
  determinism?: boolean   // default: true
  contrast?: boolean      // default: true
  overflow?: boolean      // default: true
  width?: number          // default: 1920
  height?: number         // default: 1080
  timeout?: number        // ms for page load + selector wait (default: 15000 / 10000)
}

export interface GateResult {
  findings: Finding[]
  exitCode: number
}

// ---------------------------------------------------------------------------
// Standalone importable gate runners (consumed by #27 --strict flag and CLI)
// ---------------------------------------------------------------------------

/**
 * Gate 1: AST-based determinism lint.
 * Static only — no dev server needed. < 1s per composition.
 */
export async function runLint(id: string, root: string = process.cwd()): Promise<GateResult> {
  return _runLint(id, root)
}

/**
 * Gate 2: WCAG contrast check (Puppeteer).
 * Requires a running Vite dev server at `serverUrl`.
 */
export async function runValidate(
  id: string,
  serverUrl: string,
  opts: Pick<GateOptions, 'width' | 'height' | 'timeout'> = {},
): Promise<GateResult> {
  const { width = 1920, height = 1080, timeout = 15000 } = opts
  const browser = await puppeteer.launch({
    headless: true,
    args: [`--window-size=${width},${height}`, '--no-sandbox'],
  })
  try {
    const page = await browser.newPage()
    page.setDefaultTimeout(timeout)
    await page.setViewport({ width, height, deviceScaleFactor: 1 })
    await page.goto(
      `${serverUrl}?composition=${encodeURIComponent(id)}&mode=render`,
      { timeout },
    )
    await page.waitForSelector('#render-root', { timeout: Math.round(timeout * 0.67) })

    // Seek to hero frame (0 default; composition can set window.__ROXVID_HERO__)
    const heroFrame: number = await page.evaluate(() => (window as any).__ROXVID_HERO__ ?? 0)
    if (heroFrame > 0) {
      await page.evaluate((f: number) => { (window as any).__ROXVID_SET_FRAME__?.(f) }, heroFrame)
      // 2-rAF settle: React 18 concurrent commit can take 2 frames
      await page.evaluate(() => new Promise(resolve =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve(undefined)))
      ))
    }

    const findings = await checkContrast(page)
    return { findings, exitCode: findings.some(f => f.severity === 'error') ? 1 : 0 }
  } finally {
    await browser.close()
  }
}

/**
 * Gate 3: Layout overflow check (Puppeteer).
 * Requires a running Vite dev server at `serverUrl`.
 */
export async function runInspect(
  id: string,
  serverUrl: string,
  opts: Pick<GateOptions, 'width' | 'height' | 'timeout'> = {},
): Promise<GateResult> {
  const { width = 1920, height = 1080, timeout = 15000 } = opts
  const browser = await puppeteer.launch({
    headless: true,
    args: [`--window-size=${width},${height}`, '--no-sandbox'],
  })
  try {
    const page = await browser.newPage()
    page.setDefaultTimeout(timeout)
    await page.setViewport({ width, height, deviceScaleFactor: 1 })
    await page.goto(
      `${serverUrl}?composition=${encodeURIComponent(id)}&mode=render`,
      { timeout },
    )
    await page.waitForSelector('#render-root', { timeout: Math.round(timeout * 0.67) })

    const findings = await checkOverflow(page, width, height)
    return { findings, exitCode: findings.some(f => f.severity === 'error') ? 1 : 0 }
  } finally {
    await browser.close()
  }
}

// ---------------------------------------------------------------------------
// Composite runner (used by --strict flag in render pipeline)
// ---------------------------------------------------------------------------

export async function runGates(
  compositionId: string,
  root: string,
  serverUrl: string,
  opts: GateOptions = {},
): Promise<Finding[]> {
  const {
    determinism = true,
    contrast = true,
    overflow = true,
    width = 1920,
    height = 1080,
    timeout = 15000,
  } = opts

  const findings: Finding[] = []

  // 1. AST lint — no server needed, fast (replaces legacy regex scanComposition)
  if (determinism) {
    findings.push(...(await _runLint(compositionId, root)).findings)
  }

  // 2. Puppeteer gates — share one browser session
  const needsPuppeteer = contrast || overflow
  if (needsPuppeteer) {
    const browser = await puppeteer.launch({
      headless: true,
      args: [`--window-size=${width},${height}`, '--no-sandbox'],
    })
    try {
      const page = await browser.newPage()
      await page.setViewport({ width, height, deviceScaleFactor: 1 })
      await page.goto(
        `${serverUrl}?composition=${encodeURIComponent(compositionId)}&mode=render`,
        { timeout },
      )
      await page.waitForSelector('#render-root', { timeout: Math.round(timeout * 0.67) })

      if (contrast) findings.push(...await checkContrast(page))
      if (overflow) findings.push(...await checkOverflow(page, width, height))
    } finally {
      await browser.close()
    }
  }

  return findings
}
