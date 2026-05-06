import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { getProductionDir, listProductionConfigs } from './config/paths'

const PORT = parseInt(process.env.ROXVID_PORT || '3002', 10)
const ENGINE_ROOT = path.resolve(__dirname)
const PRODUCTION_DIR = getProductionDir()

const VIRTUAL_ID = 'virtual:roxabi-productions'
const RESOLVED_VIRTUAL_ID = '\0' + VIRTUAL_ID

function productionsPlugin(): Plugin {
  return {
    name: 'roxabi-productions',
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_VIRTUAL_ID
    },
    load(id) {
      if (id !== RESOLVED_VIRTUAL_ID) return
      const entries = listProductionConfigs(ENGINE_ROOT)
      if (entries.length === 0) {
        return `export const compositions = []\n`
      }
      const paths = entries.map(e => e.configPath.replace(/\\/g, '/'))
      const imports = paths
        .map((p, i) => `import p${i} from ${JSON.stringify(p)}`)
        .join('\n')
      const flat = paths
        .map((_, i) => `...(Array.isArray(p${i}) ? p${i} : [p${i}])`)
        .join(', ')
      return `${imports}\nexport const compositions = [${flat}]\n`
    },
    handleHotUpdate({ file, server }) {
      if (file.startsWith(PRODUCTION_DIR) || file.endsWith('roxabi.config.ts')) {
        const mod = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_ID)
        if (mod) server.moduleGraph.invalidateModule(mod)
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), productionsPlugin()],
  root: 'dev',
  server: {
    port: PORT,
    fs: { allow: [ENGINE_ROOT, PRODUCTION_DIR] },
  },
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, 'core'),
      '@kits': path.resolve(__dirname, 'kits'),
      '@themes': path.resolve(__dirname, 'themes'),
      '@lib': path.resolve(__dirname, 'lib'),
      '@productions': PRODUCTION_DIR,
    },
  },
})
