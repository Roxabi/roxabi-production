export const palettes = {
  neon:   ['#ff006e', '#8338ec', '#3a86ff', '#06d6a0', '#ffbe0b'],
  mono:   ['#ffffff', '#e0e0e0', '#a0a0a0', '#606060', '#202020'],
  sunset: ['#ff6b35', '#f7c59f', '#efefd0', '#004e89', '#1a659e'],
  ocean:  ['#0077b6', '#00b4d8', '#90e0ef', '#caf0f8', '#03045e'],
  forest: ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#b7e4c7'],
  candy:  ['#ff0a54', '#ff477e', '#ff7096', '#ff85a1', '#fbb1bd'],
  cyber:  ['#0d0221', '#0f084b', '#26408b', '#a6d9f7', '#f72585'],
} as const

export type PaletteName = keyof typeof palettes
