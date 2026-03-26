#!/usr/bin/env tsx
/**
 * dev/freesound.ts — Freesound CC0 SFX search + download
 *
 * Usage:
 *   npx tsx dev/freesound.ts search "whoosh"
 *   npx tsx dev/freesound.ts search "digital glitch" --max=10
 *   npx tsx dev/freesound.ts download 123456 whoosh-01
 *   npx tsx dev/freesound.ts batch                       ← download the Lyra cue list
 *
 * Downloads go to: assets/sfx/<name>.mp3
 * Requires FREESOUND_API_KEY in .env
 */

import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const ENV_PATH = path.resolve(process.cwd(), '.env')
const SFX_DIR  = path.resolve(process.cwd(), 'assets/sfx')

function loadEnv() {
  if (!fs.existsSync(ENV_PATH)) return
  for (const line of fs.readFileSync(ENV_PATH, 'utf8').split('\n')) {
    const [k, ...v] = line.split('=')
    if (k && !k.startsWith('#') && v.length) process.env[k.trim()] = v.join('=').trim()
  }
}
loadEnv()

// Freesound uses the API key (client secret) as the request token
const API_KEY = process.env.FREESOUND_API_SECRET || process.env.FREESOUND_API_KEY
if (!API_KEY) {
  console.error('Missing FREESOUND_API_SECRET — add it to .env (https://freesound.org/apiv2/apply/)')
  process.exit(1)
}

fs.mkdirSync(SFX_DIR, { recursive: true })

// ---------------------------------------------------------------------------
// Lyra launch cue list — edit freely
// ---------------------------------------------------------------------------

const LYRA_CUES = [
  { query: 'whoosh swoosh fast',          name: 'whoosh-intro',    scene: 'S01 — title reveal'    },
  { query: 'digital glitch texture',      name: 'glitch-digital',  scene: 'S02 — system boot'     },
  { query: 'cinematic impact boom',       name: 'impact-boom',     scene: 'S03 — Lyra wordmark'   },
  { query: 'notification ding chime',     name: 'ding-notify',     scene: 'S04 — features list'   },
  { query: 'keyboard typing fast',        name: 'keyboard-typing', scene: 'S05 — terminal'        },
  { query: 'data processing sci-fi',      name: 'data-process',    scene: 'S06 — forge diamond'   },
  { query: 'whoosh transition swoosh',    name: 'whoosh-trans',    scene: 'S07 — transition out'  },
  { query: 'success completion positive', name: 'success-end',     scene: 'S08 — closing'         },
]

// ---------------------------------------------------------------------------
// HTTP helpers
// ---------------------------------------------------------------------------

function get(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return get(res.headers.location!).then(resolve).catch(reject)
      }
      let data = ''
      res.on('data', c => data += c)
      res.on('end', () => resolve(data))
      res.on('error', reject)
    }).on('error', reject)
  })
}

function download(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const follow = (u: string) => {
      https.get(u, res => {
        if (res.statusCode === 301 || res.statusCode === 302) return follow(res.headers.location!)
        const file = fs.createWriteStream(dest)
        res.pipe(file)
        file.on('finish', () => { file.close(); resolve() })
        file.on('error', reject)
      }).on('error', reject)
    }
    follow(url)
  })
}

// ---------------------------------------------------------------------------
// API
// ---------------------------------------------------------------------------

interface FreesoundResult {
  id: number
  name: string
  duration: number
  avg_rating: number
  license: string
  tags: string[]
  previews: { 'preview-hq-mp3': string; 'preview-lq-mp3': string }
  description: string
}

async function search(query: string, max = 8): Promise<FreesoundResult[]> {
  const params = new URLSearchParams({
    query,
    filter: 'license:"Creative Commons 0"',
    fields: 'id,name,duration,avg_rating,license,tags,previews,description',
    page_size: String(max),
    sort: 'rating_desc',
    token: API_KEY!,
  })
  const url = `https://freesound.org/apiv2/search/text/?${params}`
  const body = await get(url)
  const json = JSON.parse(body)
  if (json.detail) throw new Error(`Freesound API error: ${json.detail}`)
  return json.results ?? []
}

function printResults(results: FreesoundResult[]) {
  if (!results.length) { console.log('  No results.'); return }
  for (const r of results) {
    const dur  = r.duration.toFixed(1).padStart(5)
    const rate = r.avg_rating.toFixed(1)
    const tags = r.tags.slice(0, 5).join(', ')
    console.log(`  [${r.id}] ${r.name}`)
    console.log(`         ${dur}s  ★${rate}  ${tags}`)
  }
}

async function downloadSound(id: number, name: string) {
  const results = await search(`id:${id}`, 1).catch(() => null)
  // fetch by ID directly
  const params = new URLSearchParams({ fields: 'id,name,previews', token: API_KEY! })
  const body = await get(`https://freesound.org/apiv2/sounds/${id}/?${params}`)
  const sound: FreesoundResult = JSON.parse(body)
  const previewUrl = sound.previews['preview-hq-mp3']
  const dest = path.join(SFX_DIR, `${name}.mp3`)
  process.stdout.write(`  Downloading [${id}] → assets/sfx/${name}.mp3 ... `)
  await download(previewUrl, dest)
  const size = (fs.statSync(dest).size / 1024).toFixed(0)
  console.log(`${size} KB`)
}

// ---------------------------------------------------------------------------
// Commands
// ---------------------------------------------------------------------------

const [,, cmd, ...rest] = process.argv

if (cmd === 'search') {
  const query = rest.filter(r => !r.startsWith('--')).join(' ')
  const max   = parseInt(rest.find(r => r.startsWith('--max='))?.split('=')[1] ?? '8')
  if (!query) { console.error('Usage: freesound.ts search "<query>" [--max=8]'); process.exit(1) }
  console.log(`\nSearching Freesound CC0: "${query}" (top ${max})\n`)
  search(query, max)
    .then(r => { printResults(r); console.log(`\nTo download: npx tsx dev/freesound.ts download <id> <name>`) })
    .catch(err => { console.error(err.message); process.exit(1) })

} else if (cmd === 'download') {
  const id   = parseInt(rest[0])
  const name = rest[1]
  if (!id || !name) { console.error('Usage: freesound.ts download <id> <name>'); process.exit(1) }
  downloadSound(id, name)
    .then(() => console.log('Done.'))
    .catch(err => { console.error(err.message); process.exit(1) })

} else if (cmd === 'batch') {
  // Search each Lyra cue, pick the top result, download it
  ;(async () => {
    console.log('\nBatch download — Lyra launch SFX cues\n')
    for (const cue of LYRA_CUES) {
      process.stdout.write(`  [${cue.scene}]  searching "${cue.query}" ... `)
      const results = await search(cue.query, 3)
      if (!results.length) { console.log('no results, skipping'); continue }
      const top = results[0]
      console.log(`found [${top.id}] "${top.name}" (${top.duration.toFixed(1)}s ★${top.avg_rating.toFixed(1)})`)
      const dest = path.join(SFX_DIR, `${cue.name}.mp3`)
      process.stdout.write(`         downloading → assets/sfx/${cue.name}.mp3 ... `)
      await download(top.previews['preview-hq-mp3'], dest)
      const size = (fs.statSync(dest).size / 1024).toFixed(0)
      console.log(`${size} KB`)
    }
    console.log('\nAll cues downloaded to assets/sfx/')
    console.log('Review, rename if needed, then wire into the composition config.')
  })().catch(err => { console.error(err.message); process.exit(1) })

} else {
  console.log(`
Freesound CC0 SFX tool

Commands:
  search "<query>" [--max=8]     Search and list results
  download <id> <name>           Download a specific sound by ID
  batch                          Auto-download all Lyra launch cues

Examples:
  npx tsx dev/freesound.ts search "whoosh"
  npx tsx dev/freesound.ts search "digital glitch" --max=12
  npx tsx dev/freesound.ts download 123456 whoosh-intro
  npx tsx dev/freesound.ts batch
`)
}
