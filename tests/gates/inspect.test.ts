/**
 * Gate 3 — Layout overflow (inspect).
 *
 * These tests exercise the overflow-detection logic in isolation using a
 * synthetic DOM via jsdom (no Puppeteer / no dev server required).
 * The checkOverflow function accepts a Puppeteer Page object — we provide
 * a minimal mock that replays DOM evaluation results.
 */
import { describe, it, expect } from 'vitest'
import type { Finding } from '../../renderer/gates/determinism'

// ---------------------------------------------------------------------------
// Minimal Puppeteer Page mock
// We only need page.evaluate() to return a fixed result.
// ---------------------------------------------------------------------------

type EvalFn<T> = (...args: unknown[]) => T | Promise<T>

function makeMockPage(evaluateResult: unknown): { evaluate: (...args: unknown[]) => Promise<unknown> } {
  return {
    evaluate: async (fn: EvalFn<unknown>, ...passedArgs: unknown[]) => {
      // The fn received by checkOverflow is the inline function that queries the DOM.
      // Instead of executing it (which would need a real browser), we return the
      // predetermined result directly.
      return evaluateResult
    },
  }
}

// Import the check function — it only calls page.evaluate() once.
import { checkOverflow } from '../../renderer/gates/inspect'

describe('inspect gate — checkOverflow', () => {
  it('returns empty findings when all elements are in-viewport', async () => {
    // Simulate: every getBoundingClientRect fits inside 1920x1080
    const page = makeMockPage([]) as any
    const findings: Finding[] = await checkOverflow(page, 1920, 1080)
    expect(findings).toHaveLength(0)
  })

  it('flags an element with right > viewport width', async () => {
    // Simulate: a div at left=2000, right=2200 (overflows 1920-wide viewport)
    const overflowResult = [
      {
        tag: 'div',
        id: 'offscreen',
        className: '',
        rect: { top: 100, left: 2000, right: 2200, bottom: 200 },
      },
    ]
    const page = makeMockPage(overflowResult) as any
    const findings: Finding[] = await checkOverflow(page, 1920, 1080)
    expect(findings).toHaveLength(1)
    expect(findings[0].gate).toBe('overflow')
    expect(findings[0].severity).toBe('error')
    expect(findings[0].message).toContain('right=2200')
    expect(findings[0].message).toContain('1920')
  })

  it('flags an element with bottom > viewport height', async () => {
    const overflowResult = [
      {
        tag: 'p',
        id: '',
        className: 'footer',
        rect: { top: 1090, left: 0, right: 200, bottom: 1200 },
      },
    ]
    const page = makeMockPage(overflowResult) as any
    const findings: Finding[] = await checkOverflow(page, 1920, 1080)
    expect(findings).toHaveLength(1)
    expect(findings[0].message).toContain('bottom=1200')
  })

  it('flags an element with left < 0', async () => {
    const overflowResult = [
      {
        tag: 'span',
        id: '',
        className: '',
        rect: { top: 100, left: -50, right: 200, bottom: 200 },
      },
    ]
    const page = makeMockPage(overflowResult) as any
    const findings: Finding[] = await checkOverflow(page, 1920, 1080)
    expect(findings).toHaveLength(1)
    expect(findings[0].message).toContain('left=-50')
  })

  it('handles multiple overflow violations', async () => {
    const overflowResult = [
      {
        tag: 'div',
        id: 'a',
        className: '',
        rect: { top: 100, left: 2000, right: 2200, bottom: 200 },
      },
      {
        tag: 'div',
        id: 'b',
        className: '',
        rect: { top: 1200, left: 0, right: 100, bottom: 1300 },
      },
    ]
    const page = makeMockPage(overflowResult) as any
    const findings: Finding[] = await checkOverflow(page, 1920, 1080)
    expect(findings).toHaveLength(2)
  })
})
