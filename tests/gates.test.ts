import { describe, it, expect, afterEach } from 'vitest'
import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import { scanFile, scanComposition } from '../renderer/gates/determinism'

function tmp(content: string, ext = '.tsx'): string {
  const f = path.join(os.tmpdir(), `rox-test-${Date.now()}${ext}`)
  fs.writeFileSync(f, content)
  return f
}

describe('determinism gate — scanFile', () => {
  const files: string[] = []
  afterEach(() => files.forEach(f => { try { fs.unlinkSync(f) } catch {} }))

  it('flags Math.random()', () => {
    const f = tmp('const x = Math.random()\n')
    files.push(f)
    const findings = scanFile(f)
    expect(findings).toHaveLength(1)
    expect(findings[0].gate).toBe('determinism')
    expect(findings[0].severity).toBe('error')
    expect(findings[0].message).toContain('Math.random()')
    expect(findings[0].line).toBe(1)
  })

  it('flags Date.now()', () => {
    const f = tmp('const t = Date.now()\n')
    files.push(f)
    const findings = scanFile(f)
    expect(findings).toHaveLength(1)
    expect(findings[0].message).toContain('Date.now()')
  })

  it('flags performance.now()', () => {
    const f = tmp('const p = performance.now()\n')
    files.push(f)
    expect(scanFile(f)).toHaveLength(1)
  })

  it('passes clean file', () => {
    const f = tmp('import { random } from "../core/random"\nconst x = random("seed")\n')
    files.push(f)
    expect(scanFile(f)).toHaveLength(0)
  })

  it('flags multiple violations in same file', () => {
    const f = tmp('Math.random()\nDate.now()\n')
    files.push(f)
    expect(scanFile(f)).toHaveLength(2)
  })

  it('reports correct line numbers', () => {
    const f = tmp('// line 1\n// line 2\nMath.random()\n')
    files.push(f)
    const findings = scanFile(f)
    expect(findings[0].line).toBe(3)
  })
})

describe('determinism gate — scanComposition', () => {
  it('returns empty array for existing repo (no violations in showcase/ or kits/)', () => {
    const findings = scanComposition(process.cwd())
    expect(findings).toEqual([])
  })
})
