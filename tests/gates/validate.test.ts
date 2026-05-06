/**
 * Gate 2 — Contrast / a11y (validate).
 *
 * Tests exercise checkContrast in isolation via a mock Puppeteer Page.
 * The contrast-ratio math is the main thing to validate; no Puppeteer / no
 * dev server required.
 *
 * NOTE: The transparent-background filter (`rgba(0, 0, 0, 0)` / `transparent`)
 * runs inside the browser-side evaluate() callback and is not exercised here.
 * Those code paths are covered by the existing integration gate in gates.test.ts.
 */
import { describe, it, expect } from 'vitest'
import type { Finding } from '../../renderer/gates/determinism'
import { checkContrast } from '../../renderer/gates/validate'

// ---------------------------------------------------------------------------
// Mock Page helper.
// The browser-side evaluate() callback filters transparent backgrounds BEFORE
// returning pairs.  Our mock simulates what the browser already filtered:
// only opaque pairs are returned.
// ---------------------------------------------------------------------------

interface ColorPair { selector: string; fg: string; bg: string }

function makeMockPage(pairs: ColorPair[]): { evaluate: (...args: unknown[]) => Promise<unknown> } {
  return {
    evaluate: async () => pairs,
  }
}

describe('validate gate — checkContrast', () => {
  it('returns empty findings when all text has sufficient contrast', async () => {
    // Black text on white background → ratio ≈ 21:1
    const page = makeMockPage([
      { selector: 'p', fg: 'rgb(0, 0, 0)', bg: 'rgb(255, 255, 255)' },
    ]) as any
    const findings: Finding[] = await checkContrast(page)
    expect(findings).toHaveLength(0)
  })

  it('flags black text on dark background (low contrast)', async () => {
    // rgb(20,20,20) fg on rgb(30,30,30) bg → ratio ≈ 1.07 — well below 4.5
    const page = makeMockPage([
      { selector: 'div', fg: 'rgb(20, 20, 20)', bg: 'rgb(30, 30, 30)' },
    ]) as any
    const findings: Finding[] = await checkContrast(page)
    expect(findings).toHaveLength(1)
    expect(findings[0].gate).toBe('contrast')
    expect(findings[0].severity).toBe('error')
    expect(findings[0].message).toContain('WCAG AA')
  })

  it('flags white text on very light background', async () => {
    // rgb(255,255,255) on rgb(230,230,230) → ratio ≈ 1.35
    const page = makeMockPage([
      { selector: 'h1', fg: 'rgb(255, 255, 255)', bg: 'rgb(230, 230, 230)' },
    ]) as any
    const findings: Finding[] = await checkContrast(page)
    expect(findings).toHaveLength(1)
  })

  it('skips elements with unparseable color strings', async () => {
    // If a color string cannot be parsed by parseRgb, the pair is silently skipped
    const page = makeMockPage([
      { selector: 'span', fg: 'not-a-color', bg: 'rgb(255, 255, 255)' },
    ]) as any
    const findings: Finding[] = await checkContrast(page)
    expect(findings).toHaveLength(0)
  })

  it('flags multiple low-contrast elements', async () => {
    const page = makeMockPage([
      { selector: 'p#a', fg: 'rgb(20, 20, 20)', bg: 'rgb(30, 30, 30)' },
      { selector: 'p#b', fg: 'rgb(50, 50, 50)', bg: 'rgb(55, 55, 55)' },
    ]) as any
    const findings: Finding[] = await checkContrast(page)
    expect(findings).toHaveLength(2)
  })

  it('passes amber text on black background (high contrast)', async () => {
    // Amber #f59e0b on #000000 — high contrast, should not fail
    const page = makeMockPage([
      { selector: 'div', fg: 'rgb(245, 158, 11)', bg: 'rgb(0, 0, 0)' },
    ]) as any
    const findings: Finding[] = await checkContrast(page)
    expect(findings).toHaveLength(0)
  })

  it('contrast ratio is included in finding message', async () => {
    const page = makeMockPage([
      { selector: 'div#low', fg: 'rgb(20, 20, 20)', bg: 'rgb(30, 30, 30)' },
    ]) as any
    const findings: Finding[] = await checkContrast(page)
    expect(findings[0].message).toMatch(/Contrast ratio \d+\.\d+/)
  })
})
