import path from 'path'
import os from 'os'
import fs from 'fs'

export const PRODUCTION_CONFIG_FILE = 'roxabi.config.ts'

/**
 * Engine-local subdirectories that may host a `roxabi.config.ts` and ship as
 * built-in demos with the engine repo (not user productions).
 */
const ENGINE_LOCAL_DIRS = ['showcase']

export interface ProductionConfigEntry {
  configPath: string
  dir: string
  origin: 'engine-local' | 'user'
}

export function getProductionDir(): string {
  return path.resolve(
    process.env.ROXABI_PRODUCTION_DIR ?? path.join(os.homedir(), '.roxabi/production'),
  )
}

export function listProductionConfigs(engineRoot: string): ProductionConfigEntry[] {
  const entries: ProductionConfigEntry[] = []

  for (const name of ENGINE_LOCAL_DIRS) {
    const cfg = path.join(engineRoot, name, PRODUCTION_CONFIG_FILE)
    if (fs.existsSync(cfg)) {
      entries.push({ configPath: cfg, dir: path.dirname(cfg), origin: 'engine-local' })
    }
  }

  const userRoot = getProductionDir()
  if (fs.existsSync(userRoot)) {
    for (const entry of fs.readdirSync(userRoot, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue
      const cfg = path.join(userRoot, entry.name, PRODUCTION_CONFIG_FILE)
      if (fs.existsSync(cfg)) {
        entries.push({ configPath: cfg, dir: path.dirname(cfg), origin: 'user' })
      }
    }
  }

  return entries
}

/**
 * Find the production directory that registers the given compositionId.
 * Scans each `<dir>/roxabi.config.ts` for `id: '<compositionId>'`.
 */
export function findProductionDir(compositionId: string, engineRoot: string = process.cwd()): string | undefined {
  const idLiteral = compositionId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp(`id\\s*:\\s*['"\`]${idLiteral}['"\`]`)

  for (const entry of listProductionConfigs(engineRoot)) {
    if (re.test(fs.readFileSync(entry.configPath, 'utf8'))) {
      return entry.dir
    }
  }
  return undefined
}
