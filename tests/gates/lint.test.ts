import { describe, it, expect, afterEach } from 'vitest'
import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import { scanAstFile, runLint } from '../../renderer/gates/lint'
import { validateCompositionId } from '../../renderer/config'

function tmp(content: string, ext = '.tsx'): string {
  const f = path.join(os.tmpdir(), `rox-lint-test-${process.hrtime.bigint()}${ext}`)
  fs.writeFileSync(f, content)
  return f
}

describe('lint gate — scanAstFile (R1-R4)', () => {
  const files: string[] = []
  afterEach(() => files.forEach(f => { try { fs.unlinkSync(f) } catch {} }))

  // R1
  it('flags Math.random() with file:line', () => {
    const f = tmp('const x = Math.random()\n')
    files.push(f)
    const findings = scanAstFile(f)
    expect(findings.length).toBeGreaterThanOrEqual(1)
    const hit = findings.find(fi => fi.rule === 'R1')
    expect(hit).toBeDefined()
    expect(hit!.gate).toBe('determinism')
    expect(hit!.severity).toBe('error')
    expect(hit!.file).toBe(f)
    expect(hit!.line).toBe(1)
    expect(hit!.message).toContain('Math.random()')
  })

  // R2
  it('flags Date.now()', () => {
    const f = tmp('const t = Date.now()\n')
    files.push(f)
    const findings = scanAstFile(f)
    const hit = findings.find(fi => fi.rule === 'R2')
    expect(hit).toBeDefined()
    expect(hit?.severity).toBe('error')
    expect(hit?.gate).toBe('determinism')
    expect(hit?.line).toBe(1)
  })

  // R3
  it('flags performance.now()', () => {
    const f = tmp('const p = performance.now()\n')
    files.push(f)
    const findings = scanAstFile(f)
    const hit = findings.find(fi => fi.rule === 'R3')
    expect(hit).toBeDefined()
    expect(hit?.severity).toBe('error')
    expect(hit?.gate).toBe('determinism')
    expect(hit?.line).toBe(1)
  })

  // R4
  it('flags .play() call', () => {
    const f = tmp('const el = document.querySelector("video"); el.play()\n')
    files.push(f)
    const findings = scanAstFile(f)
    const hit = findings.find(fi => fi.rule === 'R4')
    expect(hit).toBeDefined()
    expect(hit?.severity).toBe('error')
    expect(hit?.gate).toBe('determinism')
    expect(hit?.line).toBe(1)
  })

  // R4 must not flag unrelated .play on strings etc. (sanity)
  it('does not flag displayName.play in non-call context', () => {
    const f = tmp('const x = { play: 1 }\n')
    files.push(f)
    const findings = scanAstFile(f)
    expect(findings.filter(fi => fi.rule === 'R4')).toHaveLength(0)
  })

  // Clean file
  it('passes a clean file', () => {
    const f = tmp([
      'import { random } from "../../core/random"',
      'import { useCurrentFrame, useVideoConfig } from "../../core"',
      'const frame = 0; const fps = 30',
      'const seconds = frame / fps',
      'const x = random("seed")',
    ].join('\n'))
    files.push(f)
    expect(scanAstFile(f)).toHaveLength(0)
  })

  // Multiple violations same file
  it('flags multiple violations with correct line numbers', () => {
    const f = tmp([
      '// line 1',
      '// line 2',
      'Math.random()',
      'Date.now()',
      'performance.now()',
    ].join('\n'))
    files.push(f)
    const findings = scanAstFile(f)
    const r1 = findings.find(fi => fi.rule === 'R1')
    const r2 = findings.find(fi => fi.rule === 'R2')
    const r3 = findings.find(fi => fi.rule === 'R3')
    expect(r1?.line).toBe(3)
    expect(r2?.line).toBe(4)
    expect(r3?.line).toBe(5)
  })

  // R5 heuristic: await inside top-level async component
  it('warns on await inside top-level component body (R5 heuristic)', () => {
    const f = tmp([
      'const MyScene: React.FC = async () => {',
      '  const data = await fetch("/api")',
      '  return null',
      '}',
    ].join('\n'))
    files.push(f)
    const findings = scanAstFile(f)
    const r5 = findings.find(fi => fi.rule === 'R5')
    expect(r5).toBeDefined()
    expect(r5!.severity).toBe('warning')
    expect(r5!.line).toBe(2)
  })

  // R5 should NOT fire on non-component functions
  it('does not warn on await inside non-component function', () => {
    const f = tmp([
      'async function loadData() {',
      '  const d = await fetch("/api")',
      '  return d',
      '}',
    ].join('\n'))
    files.push(f)
    const findings = scanAstFile(f)
    expect(findings.filter(fi => fi.rule === 'R5')).toHaveLength(0)
  })
})

describe('lint gate — runLint (integration)', () => {
  it('returns exitCode 0 for the showcase composition (no violations)', async () => {
    const result = await runLint('showcase', process.cwd())
    const errors = result.findings.filter(f => f.severity === 'error')
    // Document any findings but only fail on errors
    if (errors.length > 0) {
      console.error('Unexpected lint errors in showcase:', errors)
    }
    expect(result.exitCode).toBe(0)
  })
})

describe('validateCompositionId — path-traversal guard', () => {
  it('rejects path-traversal IDs', () => {
    expect(() => validateCompositionId('../../etc/passwd')).toThrow()
    expect(() => validateCompositionId('../foo')).toThrow()
    expect(() => validateCompositionId('foo/bar')).toThrow()
  })

  it('accepts valid composition IDs', () => {
    expect(() => validateCompositionId('showcase')).not.toThrow()
    expect(() => validateCompositionId('lyra-launch-trailer')).not.toThrow()
    expect(() => validateCompositionId('my_comp_01')).not.toThrow()
  })
})
