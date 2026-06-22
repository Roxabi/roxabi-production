// @vitest-environment jsdom
/**
 * Gate 2 — Contrast / a11y (validate).
 *
 * Tests are split into two layers:
 *
 * 1. `collectColorPairs` under jsdom — covers the transparent-background filter,
 *    DOM walk, and pair extraction (the logic previously untested by mock).
 *
 * 2. `checkContrast` via mock page — covers the contrast-ratio math and
 *    Finding construction (no Puppeteer / no dev server required).
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import type { Finding } from '../../renderer/gates/determinism'
import { collectColorPairs, checkContrast } from '../../renderer/gates/validate'

// ---------------------------------------------------------------------------
// Layer 1: collectColorPairs under jsdom (real DOM, real getComputedStyle)
// ---------------------------------------------------------------------------

let container: HTMLDivElement

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  document.body.removeChild(container)
})

describe('validate gate — collectColorPairs (jsdom)', () => {
  it('returns a pair for an element with an opaque background', () => {
    const p = document.createElement('p')
    p.style.color = 'rgb(0, 0, 0)'
    p.style.backgroundColor = 'rgb(255, 255, 255)'
    p.textContent = 'hello'
    container.appendChild(p)

    const pairs = collectColorPairs(document)
    // jsdom returns computed styles, so exact match depends on browser normalisation;
    // we just verify the pair was collected (non-transparent bg was kept)
    expect(pairs.some(pair => pair.selector.startsWith('p'))).toBe(true)
  })

  it('skips elements with rgba(0, 0, 0, 0) background', () => {
    const span = document.createElement('span')
    span.id = 'transparent-span'
    span.style.color = 'rgb(0, 0, 0)'
    span.style.backgroundColor = 'rgba(0, 0, 0, 0)'
    span.textContent = 'ghost'
    container.appendChild(span)

    const pairs = collectColorPairs(document)
    expect(pairs.find(p => p.selector === 'span#transparent-span')).toBeUndefined()
  })

  it('skips elements with "transparent" background keyword', () => {
    const div = document.createElement('div')
    div.id = 'transparent-div'
    div.style.backgroundColor = 'transparent'
    div.style.color = 'rgb(0,0,0)'
    container.appendChild(div)

    const pairs = collectColorPairs(document)
    expect(pairs.find(p => p.selector === 'div#transparent-div')).toBeUndefined()
  })

  it('includes element id in selector', () => {
    const h1 = document.createElement('h1')
    h1.id = 'title'
    h1.style.color = 'rgb(255, 255, 255)'
    h1.style.backgroundColor = 'rgb(0, 0, 0)'
    h1.textContent = 'Title'
    container.appendChild(h1)

    const pairs = collectColorPairs(document)
    expect(pairs.find(p => p.selector === 'h1#title')).toBeDefined()
  })

  it('alpha-composites a semi-transparent background over its opaque ancestor (#57)', () => {
    // amber text on a 12%-alpha amber badge, over a dark opaque scene.
    container.style.backgroundColor = 'rgb(5, 3, 8)'
    const badge = document.createElement('span')
    badge.id = 'badge'
    badge.style.color = 'rgb(245, 158, 11)'
    badge.style.backgroundColor = 'rgba(245, 158, 11, 0.12)'
    badge.textContent = 'AccentBadge'
    container.appendChild(badge)

    const pair = collectColorPairs(document).find(p => p.selector === 'span#badge')
    expect(pair).toBeDefined()
    // bg must be composited toward the dark backdrop, NOT read as solid amber
    expect(pair!.bg).not.toBe('rgb(245, 158, 11)')
    const [r, g, b] = pair!.bg.match(/\d+/g)!.map(Number)
    expect(r).toBeLessThan(60) // darkened by the 0.12 alpha over rgb(5,3,8)
    expect(g).toBeLessThan(60)
    expect(b).toBeLessThan(60)
  })
})

describe('validate gate — alpha compositing end-to-end (#57)', () => {
  it('no false positive: amber text on 12%-alpha amber badge over dark scene', async () => {
    container.style.backgroundColor = 'rgb(5, 3, 8)'
    const badge = document.createElement('span')
    badge.id = 'badge'
    badge.style.color = 'rgb(245, 158, 11)'
    badge.style.backgroundColor = 'rgba(245, 158, 11, 0.12)'
    badge.textContent = 'AccentBadge'
    container.appendChild(badge)

    // collect under jsdom, then run the real contrast math via a mock page
    const pairs = collectColorPairs(document)
    const page = { evaluate: async () => pairs } as unknown as Parameters<typeof checkContrast>[0]
    const findings = await checkContrast(page)
    expect(findings.find(f => f.file === 'span#badge')).toBeUndefined()
  })
})

// ---------------------------------------------------------------------------
// Layer 2: checkContrast via mock page (contrast-ratio math + Finding shape)
// ---------------------------------------------------------------------------

interface ColorPairMock { selector: string; fg: string; bg: string }

function makeMockPage(pairs: ColorPairMock[]): { evaluate: (...args: unknown[]) => Promise<unknown> } {
  return { evaluate: async () => pairs }
}

describe('validate gate — checkContrast (contrast math)', () => {
  it('returns empty findings for high-contrast text (black on white, ratio ≈ 21)', async () => {
    const page = makeMockPage([
      { selector: 'p', fg: 'rgb(0, 0, 0)', bg: 'rgb(255, 255, 255)' },
    ]) as any
    const findings: Finding[] = await checkContrast(page)
    expect(findings).toHaveLength(0)
  })

  it('flags low-contrast text with severity error', async () => {
    // rgb(20,20,20) on rgb(30,30,30) → ratio ≈ 1.07
    const page = makeMockPage([
      { selector: 'div', fg: 'rgb(20, 20, 20)', bg: 'rgb(30, 30, 30)' },
    ]) as any
    const findings: Finding[] = await checkContrast(page)
    expect(findings).toHaveLength(1)
    expect(findings[0].gate).toBe('contrast')
    expect(findings[0].severity).toBe('error')
    expect(findings[0].message).toContain('WCAG AA')
  })

  it('flags white on very light background (ratio ≈ 1.35)', async () => {
    const page = makeMockPage([
      { selector: 'h1', fg: 'rgb(255, 255, 255)', bg: 'rgb(230, 230, 230)' },
    ]) as any
    const findings: Finding[] = await checkContrast(page)
    expect(findings).toHaveLength(1)
  })

  it('skips pairs with unparseable color strings', async () => {
    const page = makeMockPage([
      { selector: 'span', fg: 'not-a-color', bg: 'rgb(255, 255, 255)' },
    ]) as any
    expect(await checkContrast(page)).toHaveLength(0)
  })

  it('flags multiple low-contrast elements', async () => {
    const page = makeMockPage([
      { selector: 'p#a', fg: 'rgb(20, 20, 20)', bg: 'rgb(30, 30, 30)' },
      { selector: 'p#b', fg: 'rgb(50, 50, 50)', bg: 'rgb(55, 55, 55)' },
    ]) as any
    expect(await checkContrast(page)).toHaveLength(2)
  })

  it('passes amber text on black background (high contrast)', async () => {
    const page = makeMockPage([
      { selector: 'div', fg: 'rgb(245, 158, 11)', bg: 'rgb(0, 0, 0)' },
    ]) as any
    expect(await checkContrast(page)).toHaveLength(0)
  })

  it('includes contrast ratio in finding message', async () => {
    const page = makeMockPage([
      { selector: 'div#low', fg: 'rgb(20, 20, 20)', bg: 'rgb(30, 30, 30)' },
    ]) as any
    const findings: Finding[] = await checkContrast(page)
    expect(findings[0].message).toMatch(/Contrast ratio \d+\.\d+/)
  })
})
