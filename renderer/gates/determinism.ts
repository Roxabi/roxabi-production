import * as fs from 'fs'
import * as path from 'path'
import { listProductionConfigs } from '../../config/paths'

export interface Finding {
  gate: 'determinism' | 'contrast' | 'overflow'
  severity: 'error' | 'warning'
  file: string
  line: number
  message: string
}

const BANNED: { pattern: RegExp; message: string }[] = [
  {
    pattern: /\bMath\.random\s*\(\)/g,
    message: "Math.random() is non-deterministic — use random() from core/random.ts",
  },
  {
    pattern: /\bDate\.now\s*\(\)/g,
    message: "Date.now() is non-deterministic — derive time from frame / fps",
  },
  {
    pattern: /\bperformance\.now\s*\(\)/g,
    message: "performance.now() is non-deterministic — derive time from frame / fps",
  },
]

export function scanFile(filePath: string): Finding[] {
  const content = fs.readFileSync(filePath, 'utf8')
  const lines = content.split('\n')
  const findings: Finding[] = []
  for (const { pattern, message } of BANNED) {
    for (let i = 0; i < lines.length; i++) {
      pattern.lastIndex = 0
      if (pattern.test(lines[i])) {
        findings.push({
          gate: 'determinism',
          severity: 'error',
          file: filePath,
          line: i + 1,
          message,
        })
      }
    }
  }
  return findings
}

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
