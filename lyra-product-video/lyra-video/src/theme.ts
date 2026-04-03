export const COLORS = {
  bg: '#0d0a07',
  bgDark: '#0a0005',
  text: '#e8e4df',
  textSecondary: '#9a9590',
  textMuted: '#5a5550',
  amber: '#f59e0b',
  amberLight: '#fbbf24',
  orange: '#f97316',
  rose: '#f43f5e',
  cyan: '#22d3ee',
} as const

export type AccentColor = 'amber' | 'orange' | 'rose' | 'cyan'

export const ACCENT = {
  amber: { color: COLORS.amber, glow: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)' },
  orange: { color: COLORS.orange, glow: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.25)' },
  rose: { color: COLORS.rose, glow: 'rgba(244,63,94,0.12)', border: 'rgba(244,63,94,0.25)' },
  cyan: { color: COLORS.cyan, glow: 'rgba(34,211,238,0.12)', border: 'rgba(34,211,238,0.25)' },
} as const

export const SECTIONS = [
  { id: 'title', phase: 'INTRO', day: 'D00', accent: 'amber' as AccentColor, dur: 35 },
  { id: 'wrong-bet', phase: 'WRONG_BET', day: 'D01-05', accent: 'rose' as AccentColor, dur: 33 },
  { id: 'pivot-speed', phase: 'PIVOT', day: 'D05', accent: 'orange' as AccentColor, dur: 22 },
  { id: 'kill-darlings', phase: 'KILL_IT', day: 'D12', accent: 'rose' as AccentColor, dur: 22 },
  { id: 'shared-foundation', phase: 'COMPOUND', day: 'D09-12', accent: 'amber' as AccentColor, dur: 28 },
  { id: 'knowledge-radar', phase: 'RADAR', day: 'D22', accent: 'cyan' as AccentColor, dur: 30 },
  { id: 'telegram', phase: 'SHIP_IT', day: 'D22-24', accent: 'orange' as AccentColor, dur: 25 },
  { id: 'industrial-turn', phase: 'PROCESS', day: 'D26-31', accent: 'amber' as AccentColor, dur: 30 },
  { id: 'patch-notes', phase: 'CHANGELOG', day: 'D31', accent: 'amber' as AccentColor, dur: 28 },
  { id: 'the-day', phase: 'EXPLOSION', day: 'D47', accent: 'orange' as AccentColor, dur: 33 },
  { id: 'voice', phase: 'NEW_MODE', day: 'D47', accent: 'cyan' as AccentColor, dur: 30 },
  { id: 'the-night', phase: 'TURNING_PT', day: 'D50', accent: 'rose' as AccentColor, dur: 38 },
  { id: 'lyra-not-solene', phase: 'IDENTITY', day: 'D50', accent: 'amber' as AccentColor, dur: 22 },
  { id: 'the-ecosystem', phase: 'ECOSYSTEM', day: 'D47-54', accent: 'cyan' as AccentColor, dur: 28 },
  { id: 'the-numbers', phase: 'METRICS', day: '—', accent: 'amber' as AccentColor, dur: 22 },
  { id: 'lyra-in-4-days', phase: 'OUTCOME', day: 'D52-55', accent: 'orange' as AccentColor, dur: 30 },
  { id: 'the-lesson', phase: 'LESSON', day: '—', accent: 'amber' as AccentColor, dur: 30 },
  { id: 'closing', phase: 'NEXT', day: '—', accent: 'amber' as AccentColor, dur: 25 },
] as const
