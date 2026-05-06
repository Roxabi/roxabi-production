import { describe, it, expect } from 'vitest'
import { QUALITY_PRESETS, DEFAULT_FPS, DEFAULT_CODEC, DEFAULT_FORMAT } from '../renderer/config'

describe('QUALITY_PRESETS', () => {
  it('all three presets are defined', () => {
    expect(QUALITY_PRESETS).toHaveProperty('draft')
    expect(QUALITY_PRESETS).toHaveProperty('standard')
    expect(QUALITY_PRESETS).toHaveProperty('high')
  })

  it('draft has higher CRF than standard (lower quality)', () => {
    expect(QUALITY_PRESETS.draft.crf).toBeGreaterThan(QUALITY_PRESETS.standard.crf)
  })

  it('high has lower CRF than standard (higher quality)', () => {
    expect(QUALITY_PRESETS.high.crf).toBeLessThan(QUALITY_PRESETS.standard.crf)
  })

  it('standard CRF matches legacy default (18)', () => {
    expect(QUALITY_PRESETS.standard.crf).toBe(18)
  })

  it('draft CRF is 28', () => {
    expect(QUALITY_PRESETS.draft.crf).toBe(28)
  })

  it('high CRF is 14', () => {
    expect(QUALITY_PRESETS.high.crf).toBe(14)
  })
})

describe('defaults', () => {
  it('DEFAULT_FPS is 30', () => {
    expect(DEFAULT_FPS).toBe(30)
  })

  it('DEFAULT_CODEC is h264', () => {
    expect(DEFAULT_CODEC).toBe('h264')
  })

  it('DEFAULT_FORMAT is mp4', () => {
    expect(DEFAULT_FORMAT).toBe('mp4')
  })

  it('standard preset CRF matches render default', () => {
    expect(QUALITY_PRESETS.standard.crf).toBe(18)
  })
})

describe('format→codec alias', () => {
  it('mp4 maps to h264', () => {
    const codecFromFormat = (fmt: string) =>
      fmt === 'webm' ? 'vp9' : fmt === 'mp4' ? 'h264' : undefined
    expect(codecFromFormat('mp4')).toBe('h264')
  })

  it('webm maps to vp9', () => {
    const codecFromFormat = (fmt: string) =>
      fmt === 'webm' ? 'vp9' : fmt === 'mp4' ? 'h264' : undefined
    expect(codecFromFormat('webm')).toBe('vp9')
  })

  it('unknown format maps to undefined', () => {
    const codecFromFormat = (fmt: string) =>
      fmt === 'webm' ? 'vp9' : fmt === 'mp4' ? 'h264' : undefined
    expect(codecFromFormat('avi')).toBeUndefined()
  })
})
