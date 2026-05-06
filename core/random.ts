/**
 * Deterministic seeded PRNG (Mulberry32).
 * R1 (CLAUDE.md): `Math.random()` is forbidden in compositions — use this instead.
 * Same seed always produces the same value, ensuring frame-reproducible renders.
 * Replaces Remotion random(seed).
 */
export function random(seed: string | number): number {
  let h = typeof seed === 'number' ? seed : hashString(seed)
  h |= 0
  h = (h + 0x6d2b79f5) | 0
  let t = Math.imul(h ^ (h >>> 15), 1 | h)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash + char) | 0
  }
  return hash
}
