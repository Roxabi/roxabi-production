/**
 * Gate 1: Lint — AST-based determinism scan (R1-R4).
 *
 * Uses the TypeScript compiler API for accurate AST traversal.
 * No extra dependencies (ts is already a devDep).
 * Must run without dev server; target < 1s for a single composition.
 *
 * Covers:
 *   R1  Math.random()
 *   R2  Date.now()
 *   R3  performance.now()
 *   R4  .play() on any call expression
 *   R5* async timeline construction — heuristic: `await` inside a top-level
 *       scene component function body (best-effort; false positives tolerated).
 *       (* R5 is not in CLAUDE.md table but is specified in issue #28.)
 */

import * as ts from 'typescript'
import * as fs from 'fs'
import * as path from 'path'
import type { Finding } from './determinism'
import { DETERMINISM_RULES, ruleMessage } from '../../core/determinism-rules'
import { listProductionConfigs } from '../../config/paths'

// ---------------------------------------------------------------------------
// AST helpers
// ---------------------------------------------------------------------------

function getLineNumber(sourceFile: ts.SourceFile, node: ts.Node): number {
  const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart())
  return line + 1  // 1-based
}

/**
 * Returns true if `node` is a CallExpression matching `obj.method()`.
 * obj and method are string literals for exact matching.
 */
function isCallOf(node: ts.Node, obj: string, method: string): boolean {
  if (!ts.isCallExpression(node)) return false
  const expr = node.expression
  if (!ts.isPropertyAccessExpression(expr)) return false
  const objExpr = expr.expression
  return (
    ts.isIdentifier(objExpr) &&
    objExpr.text === obj &&
    ts.isIdentifier(expr.name) &&
    expr.name.text === method
  )
}

/**
 * Returns true if `node` is a CallExpression whose callee's property name is `method`
 * (i.e. `anything.method()`).
 */
function isCallWithMethod(node: ts.Node, method: string): boolean {
  if (!ts.isCallExpression(node)) return false
  const expr = node.expression
  if (!ts.isPropertyAccessExpression(expr)) return false
  return ts.isIdentifier(expr.name) && expr.name.text === method
}

// ---------------------------------------------------------------------------
// Heuristic: detect `await` inside a top-level scene component body (R5/async).
//
// "Top-level scene component" = a function/arrow-function declaration whose
// name starts with an uppercase letter (React component convention) at module
// scope (depth 0 from SourceFile children).
//
// Heuristic is conservative: ANY await inside such a function body is flagged.
// This will produce false positives for hooks like `useEffect` that use async
// callbacks — acceptable per spec ("false positives are tolerable").
// ---------------------------------------------------------------------------

function isTopLevelComponent(node: ts.Node, sourceFile: ts.SourceFile): boolean {
  // Direct children of the SourceFile
  if (node.parent !== sourceFile) return false

  // FunctionDeclaration
  if (ts.isFunctionDeclaration(node) && node.name && /^[A-Z]/.test(node.name.text)) return true

  // const Foo = () => ... or const Foo = function ...
  if (ts.isVariableStatement(node)) {
    for (const decl of node.declarationList.declarations) {
      if (
        ts.isIdentifier(decl.name) &&
        /^[A-Z]/.test(decl.name.text) &&
        decl.initializer &&
        (ts.isArrowFunction(decl.initializer) || ts.isFunctionExpression(decl.initializer))
      ) {
        return true
      }
    }
  }

  // export default function / export const
  if (ts.isExportAssignment(node)) return false  // `export default expr`
  return false
}

function containsAwait(node: ts.Node): ts.AwaitExpression | undefined {
  if (ts.isAwaitExpression(node)) return node
  for (const child of node.getChildren()) {
    const found = containsAwait(child)
    if (found) return found
  }
  return undefined
}

// ---------------------------------------------------------------------------
// Core scanner
// ---------------------------------------------------------------------------

export interface LintFinding extends Finding {
  gate: 'determinism'
  rule: string
}

function scanAstFile(filePath: string, excludeRandom: boolean): LintFinding[] {
  const content = fs.readFileSync(filePath, 'utf8')
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.ES2020,
    /* setParentNodes */ true,
    ts.ScriptKind.TSX,
  )

  const findings: LintFinding[] = []

  function visitNode(node: ts.Node): void {
    // R1: Math.random()
    if (isCallOf(node, 'Math', 'random')) {
      const rule = DETERMINISM_RULES.find(r => r.id === 'R1')!
      findings.push({
        gate: 'determinism',
        severity: rule.severity,
        file: filePath,
        line: getLineNumber(sourceFile, node),
        message: ruleMessage(rule),
        rule: rule.id,
      })
    }

    // R2: Date.now()
    if (isCallOf(node, 'Date', 'now')) {
      const rule = DETERMINISM_RULES.find(r => r.id === 'R2')!
      findings.push({
        gate: 'determinism',
        severity: rule.severity,
        file: filePath,
        line: getLineNumber(sourceFile, node),
        message: ruleMessage(rule),
        rule: rule.id,
      })
    }

    // R3: performance.now()
    if (isCallOf(node, 'performance', 'now')) {
      const rule = DETERMINISM_RULES.find(r => r.id === 'R3')!
      findings.push({
        gate: 'determinism',
        severity: rule.severity,
        file: filePath,
        line: getLineNumber(sourceFile, node),
        message: ruleMessage(rule),
        rule: rule.id,
      })
    }

    // R4: .play() on anything
    if (isCallWithMethod(node, 'play')) {
      const rule = DETERMINISM_RULES.find(r => r.id === 'R4')!
      findings.push({
        gate: 'determinism',
        severity: rule.severity,
        file: filePath,
        line: getLineNumber(sourceFile, node),
        message: ruleMessage(rule),
        rule: rule.id,
      })
    }

    ts.forEachChild(node, visitNode)
  }

  visitNode(sourceFile)

  // R5-heuristic: async `await` inside top-level component bodies.
  // Walk direct children of SourceFile only.
  for (const child of sourceFile.statements) {
    if (!isTopLevelComponent(child, sourceFile)) continue

    // Extract the function body node
    let body: ts.Node | undefined
    if (ts.isFunctionDeclaration(child)) {
      body = child.body
    } else if (ts.isVariableStatement(child)) {
      for (const decl of child.declarationList.declarations) {
        if (decl.initializer && (ts.isArrowFunction(decl.initializer) || ts.isFunctionExpression(decl.initializer))) {
          body = decl.initializer.body
          break
        }
      }
    }
    if (!body) continue

    const awaitNode = containsAwait(body)
    if (awaitNode) {
      findings.push({
        gate: 'determinism',
        severity: 'warning',
        file: filePath,
        line: getLineNumber(sourceFile, awaitNode),
        // R5 is the async-timeline heuristic (issue #28 spec, not in CLAUDE.md table)
        message: '[R5-heuristic] async `await` inside top-level scene component — timeline construction must be synchronous for deterministic frame rendering',
        rule: 'R5',
      })
    }
  }

  return findings
}

// ---------------------------------------------------------------------------
// Transitive import collector
// ---------------------------------------------------------------------------

const TS_EXTS = ['.ts', '.tsx', '.js', '.jsx']

/**
 * Resolve a module specifier relative to `fromFile`.
 * Only resolves relative imports (starts with `.`). Package imports are skipped.
 */
function resolveRelativeImport(specifier: string, fromFile: string): string | undefined {
  if (!specifier.startsWith('.')) return undefined
  const dir = path.dirname(fromFile)
  const base = path.resolve(dir, specifier)

  // Try exact path first
  for (const ext of ['', ...TS_EXTS]) {
    const candidate = base + ext
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate
  }
  // Try index
  for (const ext of TS_EXTS) {
    const candidate = path.join(base, `index${ext}`)
    if (fs.existsSync(candidate)) return candidate
  }
  return undefined
}

/**
 * Collect all .ts/.tsx files reachable from `entryFile` via relative imports.
 * Excludes `core/random.ts` (it IS the approved alternative — no need to scan it).
 */
function collectTransitiveFiles(entryFile: string, exclude: string[]): Set<string> {
  const visited = new Set<string>()
  const queue = [path.resolve(entryFile)]

  while (queue.length > 0) {
    const file = queue.pop()!
    if (visited.has(file)) continue
    if (!fs.existsSync(file)) continue
    if (exclude.some(e => file.endsWith(e))) continue
    visited.add(file)

    const content = fs.readFileSync(file, 'utf8')
    const sourceFile = ts.createSourceFile(file, content, ts.ScriptTarget.ES2020, true, ts.ScriptKind.TSX)

    for (const stmt of sourceFile.statements) {
      if (ts.isImportDeclaration(stmt) && ts.isStringLiteral(stmt.moduleSpecifier)) {
        const resolved = resolveRelativeImport(stmt.moduleSpecifier.text, file)
        if (resolved) queue.push(resolved)
      }
    }
  }
  return visited
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface LintResult {
  findings: LintFinding[]
  exitCode: number
}

/**
 * Run the AST lint gate for a given composition ID.
 *
 * Scans:
 *   - `<root>/showcase/<id>.tsx` and its transitive imports from kits/ and core/
 *     (core/random.ts excluded — it IS the approved alternative)
 *   - If `<root>/showcase/<id>.tsx` does not exist, falls back to scanning
 *     all kits/ and production composition dirs.
 */
export async function runLint(id: string, root: string = process.cwd()): Promise<LintResult> {
  const EXCLUDE = [path.join('core', 'random.ts')]

  let filesToScan: Set<string>

  // Try composition-specific entry first
  const entryFile = path.join(root, 'showcase', `${id}.tsx`)
  if (fs.existsSync(entryFile)) {
    filesToScan = collectTransitiveFiles(entryFile, EXCLUDE)
  } else {
    // Fall back: scan kits/ + all production composition dirs
    filesToScan = new Set<string>()
    const dirs: string[] = [path.join(root, 'kits')]
    for (const entry of listProductionConfigs(root)) {
      dirs.push(entry.dir)
    }
    for (const dir of dirs) {
      if (!fs.existsSync(dir)) continue
      const walk = (d: string): void => {
        for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
          if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue
          const full = path.join(d, entry.name)
          if (entry.isDirectory()) {
            walk(full)
          } else if (TS_EXTS.some(e => entry.name.endsWith(e))) {
            if (!EXCLUDE.some(ex => full.endsWith(ex))) filesToScan.add(full)
          }
        }
      }
      walk(dir)
    }
  }

  const findings: LintFinding[] = []
  for (const file of filesToScan) {
    if (!TS_EXTS.some(e => file.endsWith(e))) continue
    findings.push(...scanAstFile(file, EXCLUDE.some(ex => file.endsWith(ex))))
  }

  return {
    findings,
    exitCode: findings.some(f => f.severity === 'error') ? 1 : 0,
  }
}

/**
 * Scan a specific file with AST (used by tests).
 */
export { scanAstFile }
