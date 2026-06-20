# roxabi-production — Project Rules

## Stack vidéo Roxabi

Ce repo est le **moteur React maison** de l'écosystème Roxabi — pas l'unique outil vidéo.

→ **[Mode d'emploi — stack vidéo](docs/mode-emploi-stack-video.md)** : quand utiliser roxabi-production vs HyperFrames vs OpenMontage vs FFmpeg, matrice de décision, data dirs, périmètre long terme.

Avant de choisir un runtime ou de scaffolder une nouvelle production, lire ce fichier.

## Video Engine Determinism Contract

The Puppeteer frame-capture pipeline requires fully deterministic compositions.
Violations cause frame jitter, broken audio sync, and unreproducible bugs.

| # | Rule | Rationale | Approved alternative |
|---|---|---|---|
| R1 | No `Math.random()` | Non-deterministic across renders | `random(seed)` from `core/random.ts` |
| R2 | No `Date.now()` | Wall-clock varies between runs | Derive seconds: `frame / fps` |
| R3 | No `performance.now()` | Same as `Date.now()` | `frame / fps` |
| R4 | No `.play()` on `<video>` / `<audio>` | Autoplay is blocked headless; audio via FFmpeg | Pass `--audio=` to renderer CLI |
| R5 | No `<video>` without `muted` | Causes playback errors in headless Chromium | `<video muted>` + separate audio track |
| R6 | Caption groups must reset opacity at boundary | Bleeds into next scene | `opacity: frame >= groupEnd ? 0 : 1` |
| R7 | No infinite loops in animations | Capture engine needs a finite `durationInFrames` | Calculate finite repeat counts from `durationInFrames` |

### Enforcement

| Layer | Command | Scope |
|---|---|---|
| Author-time (IDE / CI) | `npm run lint` | `eslint.config.js` — `no-restricted-syntax` |
| Pre-render (gate) | `npm run render <id> --strict` | `renderer/gates/determinism.ts` static scan |
| Pre-render (Puppeteer) | `npm run render <id> --strict` | `renderer/gates/validate.ts` · `renderer/gates/inspect.ts` |

### Quick reference

```ts
// ✅ deterministic random
import { random } from '../core/random'
const x = random('my-seed')          // always same value for same seed

// ✅ frame-based time
import { useCurrentFrame, useVideoConfig } from '../core'
const frame = useCurrentFrame()
const { fps } = useVideoConfig()
const seconds = frame / fps
```

### References

- Seeded PRNG: `core/random.ts`
- Gate runner: `renderer/gates/index.ts`
- Pattern origin: [HyperFrames skill](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/creative/hyperframes/SKILL.md)
