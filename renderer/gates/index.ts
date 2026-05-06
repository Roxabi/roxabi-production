import puppeteer from 'puppeteer'
import { scanComposition } from './determinism'
import { checkContrast } from './validate'
import { checkOverflow } from './inspect'
import type { Finding } from './determinism'

export type { Finding }

export interface GateOptions {
  determinism?: boolean   // default: true
  contrast?: boolean      // default: true
  overflow?: boolean      // default: true
  width?: number          // default: 1920
  height?: number         // default: 1080
}

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
  } = opts

  const findings: Finding[] = []

  // 1. Static scan — no server needed, fast
  if (determinism) {
    findings.push(...scanComposition(root))
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
        { timeout: 15000 },
      )
      await page.waitForSelector('#render-root', { timeout: 10000 })

      if (contrast) findings.push(...await checkContrast(page))
      if (overflow) findings.push(...await checkOverflow(page, width, height))
    } finally {
      await browser.close()
    }
  }

  return findings
}
