import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const PORT = parseInt(process.env.ROXVID_PORT || '3002', 10)

export default defineConfig({
  plugins: [react()],
  root: 'dev',
  server: {
    port: PORT,
  },
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, 'core'),
      '@kits': path.resolve(__dirname, 'kits'),
      '@themes': path.resolve(__dirname, 'themes'),
      '@lib': path.resolve(__dirname, 'lib'),
    },
  },
})
