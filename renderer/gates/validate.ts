import type { Page } from 'puppeteer'
import type { Finding } from './determinism'

function relativeLuminance(r: number, g: number, b: number): number {
  return [r, g, b]
    .map(c => {
      const s = c / 255
      return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
    })
    .reduce((acc, val, i) => acc + val * [0.2126, 0.7152, 0.0722][i], 0)
}

function contrastRatio(l1: number, l2: number): number {
  const [lighter, darker] = l1 > l2 ? [l1, l2] : [l2, l1]
  return (lighter + 0.05) / (darker + 0.05)
}

// Parse "rgb(r, g, b)" or "rgba(r, g, b, a)" → [r, g, b] | null
function parseRgb(color: string): [number, number, number] | null {
  const m = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (!m) return null
  return [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])]
}

export interface ColorPair { selector: string; fg: string; bg: string }

/**
 * Pure DOM function — walks candidate text elements, resolves each one's
 * effective (alpha-composited) background, and returns solid (selector, fg, bg)
 * pairs for contrast analysis.
 *
 * Self-contained: stringified and run in the page via page.evaluate, so all
 * helpers are nested and it references only browser globals. Exported so tests
 * can call it directly under jsdom without Puppeteer. See #53, #57.
 */
export function collectColorPairs(root: ParentNode): ColorPair[] {
  type RGBA = { r: number; g: number; b: number; a: number }

  // NOTE: stringified and run in the page via page.evaluate (see checkContrast),
  // so reference only browser globals. esbuild's `__name` wrapper is shimmed by
  // the caller.
  function parse(c: string): RGBA | null {
    const m = c.match(/rgba?\(([^)]+)\)/)
    if (!m) return null
    const p = m[1].split(',').map(s => parseFloat(s.trim()))
    if (p.length < 3 || p.slice(0, 3).some(n => Number.isNaN(n))) return null
    return { r: p[0], g: p[1], b: p[2], a: p[3] ?? 1 }
  }

  // `src` over `dst` — standard source-over alpha compositing.
  function over(src: RGBA, dst: RGBA): RGBA {
    const a = src.a + dst.a * (1 - src.a)
    if (a === 0) return { r: 0, g: 0, b: 0, a: 0 }
    const k = dst.a * (1 - src.a)
    return {
      r: (src.r * src.a + dst.r * k) / a,
      g: (src.g * src.a + dst.g * k) / a,
      b: (src.b * src.a + dst.b * k) / a,
      a,
    }
  }

  // Effective background: composite the element's own bg over each ancestor
  // bg, walking up until the first fully-opaque layer. Falls back to white.
  function effectiveBg(el: Element): RGBA {
    const layers: RGBA[] = []
    let node: Element | null = el
    while (node) {
      const c = parse(getComputedStyle(node).backgroundColor)
      if (c && c.a > 0) {
        layers.push(c)
        if (c.a >= 1) break
      }
      node = node.parentElement
    }
    let base: RGBA = { r: 255, g: 255, b: 255, a: 1 }
    for (let i = layers.length - 1; i >= 0; i--) base = over(layers[i], base)
    return base
  }

  function toRgb(c: RGBA): string {
    return `rgb(${Math.round(c.r)}, ${Math.round(c.g)}, ${Math.round(c.b)})`
  }

  const results: ColorPair[] = []
  const candidates = root.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, div, label')
  for (const el of Array.from(candidates)) {
    const style = getComputedStyle(el)
    const ownBg = parse(style.backgroundColor)
    // skip elements with no own background (transparent) — scope unchanged
    if (!ownBg || ownBg.a === 0) continue
    // composite semi-transparent bg over the real backdrop; opaque stays as-is
    const bg = ownBg.a >= 1 ? ownBg : effectiveBg(el)
    let fg = parse(style.color)
    if (!fg) continue
    if (fg.a < 1) fg = over(fg, bg)
    const tag = el.tagName.toLowerCase()
    const id = (el as HTMLElement).id
    results.push({ selector: `${tag}${id ? `#${id}` : ''}`, fg: toRgb(fg), bg: toRgb(bg) })
  }
  return results
}

export async function checkContrast(
  page: Page,
  threshold = 4.5,
): Promise<Finding[]> {
  // collectColorPairs is stringified and run in the page. Two boundary fixes:
  // (1) reference the page's own `document` here — passing it as an evaluate arg
  //     fails (absent in Node + a DOM node isn't serializable).
  // (2) esbuild/tsx wraps named functions with a `__name(...)` helper that only
  //     exists in Node module scope, so define a no-op shim before invoking
  //     (else: "ReferenceError: __name is not defined" in the browser).
  // See #53, #57.
  const pairs = (await page.evaluate(
    `(function () {
       function __name(f) { return f }
       return (${collectColorPairs.toString()})(document)
     })()`,
  )) as ColorPair[]

  const findings: Finding[] = []
  for (const { selector, fg, bg } of pairs) {
    const fgRgb = parseRgb(fg)
    const bgRgb = parseRgb(bg)
    if (!fgRgb || !bgRgb) continue
    const ratio = contrastRatio(
      relativeLuminance(...fgRgb),
      relativeLuminance(...bgRgb),
    )
    if (ratio < threshold) {
      findings.push({
        gate: 'contrast',
        severity: 'error',
        file: selector,
        line: 0,
        message: `Contrast ratio ${ratio.toFixed(2)} < ${threshold} (WCAG AA) — fg: ${fg}, bg: ${bg}`,
      })
    }
  }
  return findings
}
