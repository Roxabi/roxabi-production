import { describe, it, expect } from 'vitest'
import { QUALITY_PRESETS } from '../renderer/config'

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
