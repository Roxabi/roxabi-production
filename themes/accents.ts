export type AccentColor = 'amber' | 'orange' | 'rose' | 'cyan'

export const ACCENT: Record<AccentColor, { color: string; glow: string; border: string }> = {
  amber:  { color: '#f59e0b', glow: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)' },
  orange: { color: '#f97316', glow: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.25)' },
  rose:   { color: '#f43f5e', glow: 'rgba(244,63,94,0.12)',  border: 'rgba(244,63,94,0.25)' },
  cyan:   { color: '#22d3ee', glow: 'rgba(34,211,238,0.12)', border: 'rgba(34,211,238,0.25)' },
} as const
