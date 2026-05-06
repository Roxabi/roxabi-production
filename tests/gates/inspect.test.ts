// @vitest-environment jsdom
/**
 * Gate 3 — Layout overflow (inspect).
 *
 * Tests call `buildOverflowViolations` directly under jsdom — no Puppeteer,
 * no dev server. Covers the DOM walk, 2px tolerance, and the overflow:hidden
 * ancestor clipping heuristic.
 *
 * jsdom's getBoundingClientRect returns zeros for unrendered elements, so we
 * override it per-element to simulate layout positions.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { buildOverflowViolations } from '../../renderer/gates/inspect'

// ---------------------------------------------------------------------------
// Helper: build an element with a mocked bounding rect
// ---------------------------------------------------------------------------

type Rect = { top: number; left: number; right: number; bottom: number }

function makeEl(
  tag: string,
  rect: Rect,
  opts: { id?: string; className?: string } = {},
): HTMLElement {
  const e = document.createElement(tag)
  if (opts.id) e.id = opts.id
  if (opts.className) e.className = opts.className
  e.getBoundingClientRect = () => ({
    ...rect,
    width: rect.right - rect.left,
    height: rect.bottom - rect.top,
    x: rect.left,
    y: rect.top,
    toJSON: () => ({}),
  })
  return e
}

// ---------------------------------------------------------------------------
// Per-test: use a fresh render-root appended to body, clean up after each test
// ---------------------------------------------------------------------------

let renderRoot: HTMLDivElement

beforeEach(() => {
  renderRoot = document.createElement('div')
  renderRoot.id = 'render-root'
  document.body.appendChild(renderRoot)
})

afterEach(() => {
  document.body.removeChild(renderRoot)
})

describe('inspect gate — buildOverflowViolations', () => {
  it('returns empty array when element is fully inside viewport', () => {
    const child = makeEl('div', { top: 0, left: 0, right: 100, bottom: 100 }, { id: 'inner' })
    renderRoot.appendChild(child)

    const results = buildOverflowViolations(document, 1920, 1080)
    expect(results.find(r => r.id === 'inner')).toBeUndefined()
  })

  it('flags an element with right > viewport width', () => {
    const child = makeEl('div', { top: 100, left: 2000, right: 2200, bottom: 200 }, { id: 'offscreen' })
    renderRoot.appendChild(child)

    const results = buildOverflowViolations(document, 1920, 1080)
    const hit = results.find(r => r.id === 'offscreen')

    expect(hit).toBeDefined()
    expect(hit!.tag).toBe('div')
    expect(hit!.rect.right).toBe(2200)
    expect(hit!.rect.left).toBe(2000)
  })

  it('flags an element with bottom > viewport height', () => {
    const child = makeEl('p', { top: 1090, left: 0, right: 200, bottom: 1200 }, { id: 'below' })
    renderRoot.appendChild(child)

    const results = buildOverflowViolations(document, 1920, 1080)
    const hit = results.find(r => r.id === 'below')

    expect(hit).toBeDefined()
    expect(hit!.rect.bottom).toBe(1200)
  })

  it('flags an element with left < 0', () => {
    const child = makeEl('span', { top: 100, left: -50, right: 200, bottom: 200 }, { id: 'leftover' })
    renderRoot.appendChild(child)

    const results = buildOverflowViolations(document, 1920, 1080)
    const hit = results.find(r => r.id === 'leftover')

    expect(hit).toBeDefined()
    expect(hit!.rect.left).toBe(-50)
  })

  it('respects 2px sub-pixel tolerance (exactly at boundary is not flagged)', () => {
    // right === vw + 2 — NOT flagged (requires > vw+2)
    const child = makeEl('div', { top: 0, left: 0, right: 1922, bottom: 100 }, { id: 'tolerance' })
    renderRoot.appendChild(child)

    const results = buildOverflowViolations(document, 1920, 1080)
    expect(results.find(r => r.id === 'tolerance')).toBeUndefined()
  })

  it('skips elements clipped by overflow:hidden ancestor', () => {
    const wrapper = document.createElement('div')
    wrapper.style.overflow = 'hidden'

    const child = makeEl('div', { top: 0, left: 2000, right: 2200, bottom: 100 }, { id: 'clipped' })
    wrapper.appendChild(child)
    renderRoot.appendChild(wrapper)

    const results = buildOverflowViolations(document, 1920, 1080)
    expect(results.find(r => r.id === 'clipped')).toBeUndefined()
  })
})
