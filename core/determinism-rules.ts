/**
 * Shared determinism rule definitions — CLAUDE.md R1-R4.
 *
 * Single source of truth consumed by:
 *   - renderer/gates/determinism.ts  (legacy regex gate)
 *   - renderer/gates/lint.ts         (AST gate)
 *
 * The ESLint config (eslint.config.js) uses the same R-numbers in its messages
 * but stays separate — ESLint selectors are a different paradigm.
 */

export interface DeterminismRule {
  /** R-number matching CLAUDE.md */
  id: 'R1' | 'R2' | 'R3' | 'R4'
  /** Human-readable description */
  description: string
  /** Severity in gate output */
  severity: 'error' | 'warning'
  /** Regex for the legacy line-based scanner */
  pattern: RegExp
  /** ESLint `no-restricted-syntax` selector (informational — enforced by eslint.config.js) */
  eslintSelector: string
  /** Approved alternative for the error message */
  alternative: string
}

export const DETERMINISM_RULES: DeterminismRule[] = [
  {
    id: 'R1',
    description: 'Math.random() is non-deterministic across renders',
    severity: 'error',
    pattern: /\bMath\.random\s*\(\)/g,
    eslintSelector: "CallExpression[callee.object.name='Math'][callee.property.name='random']",
    alternative: 'use random(seed) from core/random.ts',
  },
  {
    id: 'R2',
    description: 'Date.now() is non-deterministic (wall-clock varies between runs)',
    severity: 'error',
    pattern: /\bDate\.now\s*\(\)/g,
    eslintSelector: "CallExpression[callee.object.name='Date'][callee.property.name='now']",
    alternative: 'derive time from frame / fps',
  },
  {
    id: 'R3',
    description: 'performance.now() is non-deterministic (wall-clock varies between runs)',
    severity: 'error',
    pattern: /\bperformance\.now\s*\(\)/g,
    eslintSelector: "CallExpression[callee.object.name='performance'][callee.property.name='now']",
    alternative: 'derive time from frame / fps',
  },
  {
    id: 'R4',
    description: '.play() on media elements — autoplay is blocked in headless Chromium',
    severity: 'error',
    pattern: /\.play\s*\(\)/g,
    eslintSelector: "CallExpression[callee.property.name='play']",
    alternative: 'audio is handled by the --audio= CLI flag',
  },
]

/** Build the human-readable gate message for a rule */
export function ruleMessage(rule: DeterminismRule): string {
  return `[${rule.id}] ${rule.description} — ${rule.alternative}`
}
