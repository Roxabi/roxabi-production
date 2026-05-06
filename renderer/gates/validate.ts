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

export async function checkContrast(
  page: Page,
  threshold = 4.5,
): Promise<Finding[]> {
  interface ColorPair { selector: string; fg: string; bg: string }

  const pairs = await page.evaluate((): ColorPair[] => {
    const results: ColorPair[] = []
    const candidates = document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, div, label')
    for (const el of Array.from(candidates)) {
      const style = getComputedStyle(el)
      const bg = style.backgroundColor
      // skip transparent backgrounds
      if (!bg || bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') continue
      const fg = style.color
      if (!fg) continue
      const tag = el.tagName.toLowerCase()
      const id = (el as HTMLElement).id
      results.push({ selector: `${tag}${id ? `#${id}` : ''}`, fg, bg })
    }
    return results
  })

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
