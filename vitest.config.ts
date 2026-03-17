import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, 'core'),
      '@kits': path.resolve(__dirname, 'kits'),
      '@themes': path.resolve(__dirname, 'themes'),
      '@lib': path.resolve(__dirname, 'lib'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
