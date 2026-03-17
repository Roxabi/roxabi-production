#!/usr/bin/env node
import { render } from './render'

const args = process.argv.slice(2)
const compositionId = args[0]
const outputPath = args[1] || `out/${compositionId}.mp4`

if (!compositionId) {
  console.error('Usage: roxvid render <CompositionId> [output.mp4] [--audio=path]')
  process.exit(1)
}

render({
  compositionId,
  outputPath,
  audioPath: args.find(a => a.startsWith('--audio='))?.split('=')[1],
}).catch(err => {
  console.error('Render failed:', err)
  process.exit(1)
})
