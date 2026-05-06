import type { Page } from 'puppeteer'
import type { Finding } from './determinism'

interface Rect {
  top: number
  left: number
  right: number
  bottom: number
}

export interface OverflowResult {
  tag: string
  id: string
  className: string
  rect: Rect
}

/**
 * Pure DOM function — walks all elements, returns those whose bounding box
 * overflows the viewport, skipping elements clipped by an `overflow:hidden`
 * ancestor (e.g. AbsoluteFill containers for slide-in animations).
 *
 * Exported so tests can call it directly under jsdom without Puppeteer.
 */
export function buildOverflowViolations(
  root: ParentNode,
  vw: number,
  vh: number,
): OverflowResult[] {
  const renderRoot = (root as Document).getElementById?.('render-root') ?? null

  const results: OverflowResult[] = []
  const els = root.querySelectorAll('*')
  for (const el of Array.from(els)) {
    const r = el.getBoundingClientRect()
    // Only flag significant overflow (>2px tolerance for sub-pixel rounding)
    if (r.right > vw + 2 || r.bottom > vh + 2 || r.left < -2 || r.top < -2) {
      // Skip elements clipped by an ancestor (e.g. AbsoluteFill, slide-in animations)
      let clipped = false
      let ancestor = el.parentElement
      while (ancestor && ancestor !== renderRoot) {
        const s = getComputedStyle(ancestor)
        if (
          s.overflow === 'hidden' || s.overflow === 'clip' ||
          s.overflowX === 'hidden' || s.overflowY === 'hidden'
        ) { clipped = true; break }
        ancestor = ancestor.parentElement
      }
      if (clipped) continue
      results.push({
        tag: el.tagName.toLowerCase(),
        id: (el as HTMLElement).id || '',
        className: (el as HTMLElement).className?.toString().slice(0, 60) || '',
        rect: { top: r.top, left: r.left, right: r.right, bottom: r.bottom },
      })
    }
  }
  return results
}

export async function checkOverflow(
  page: Page,
  viewportWidth = 1920,
  viewportHeight = 1080,
): Promise<Finding[]> {
  const violations = await page.evaluate(
    buildOverflowViolations as (root: ParentNode, vw: number, vh: number) => OverflowResult[],
    document as unknown as ParentNode,
    viewportWidth,
    viewportHeight,
  )

  return violations.map(v => ({
    gate: 'overflow' as const,
    severity: 'error' as const,
    file: `<${v.tag}${v.id ? `#${v.id}` : v.className ? `.${v.className.split(' ')[0]}` : ''}>`,
    line: 0,
    message: `Layout overflow: top=${v.rect.top.toFixed(0)} left=${v.rect.left.toFixed(0)} right=${v.rect.right.toFixed(0)} bottom=${v.rect.bottom.toFixed(0)} (viewport: ${viewportWidth}×${viewportHeight})`,
  }))
}
