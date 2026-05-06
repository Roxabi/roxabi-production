import * as fs from 'fs'
import * as path from 'path'
import { listProductionConfigs } from '../../config/paths'
import { DETERMINISM_RULES, ruleMessage } from '../../core/determinism-rules'

export interface Finding {
  gate: 'determinism' | 'contrast' | 'overflow'
  severity: 'error' | 'warning'
  file: string
  line: number
  message: string
}

export function scanFile(filePath: string): Finding[] {
  const content = fs.readFileSync(filePath, 'utf8')
  const lines = content.split('\n')
  const findings: Finding[] = []
  for (const rule of DETERMINISM_RULES) {
    for (let i = 0; i < lines.length; i++) {
      rule.pattern.lastIndex = 0
      if (rule.pattern.test(lines[i])) {
        findings.push({
          gate: 'determinism',
          severity: rule.severity,
          file: filePath,
          line: i + 1,
          message: ruleMessage(rule),
        })
      }
    }
  }
  return findings
}

/**
 * @deprecated Use `runLint(compositionId, root)` from `renderer/gates/lint.ts` instead.
 * Legacy regex-based scan kept for backward compatibility; new code should use the AST gate.
 */
export function scanComposition(root: string): Finding[] {
  const dirs: string[] = [path.join(root, 'kits')]
  for (const entry of listProductionConfigs(root)) {
    dirs.push(entry.dir)
  }

  const findings: Finding[] = []
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue
    const walk = (d: string): void => {
      for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
        if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue
        const full = path.join(d, entry.name)
        if (entry.isDirectory()) {
          walk(full)
        } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
          findings.push(...scanFile(full))
        }
      }
    }
    walk(dir)
  }
  return findings
}
