import { describe, it, expect } from 'vitest'
import { interpolate, spring, Easing, clamp, random } from '../core'

describe('interpolate', () => {
  it('maps linearly', () => {
    expect(interpolate(5, [0, 10], [0, 100])).toBe(50)
  })

  it('clamps right', () => {
    expect(interpolate(15, [0, 10], [0, 100], { extrapolateRight: 'clamp' })).toBe(100)
  })

  it('clamps left', () => {
    expect(interpolate(-5, [0, 10], [0, 100], { extrapolateLeft: 'clamp' })).toBe(0)
  })

  it('handles multi-segment', () => {
    expect(interpolate(15, [0, 10, 20], [0, 100, 200])).toBe(150)
  })

  it('applies easing', () => {
    const result = interpolate(5, [0, 10], [0, 100], { easing: Easing.quad })
    expect(result).toBe(25) // 0.5^2 = 0.25 → 25
  })

  it('handles zero-length range', () => {
    expect(interpolate(5, [5, 5], [0, 100])).toBe(0)
  })
})

describe('spring', () => {
  it('returns 0 at frame 0', () => {
    expect(spring({ frame: 0, fps: 30 })).toBe(0)
  })

  it('returns 0 before delay', () => {
    expect(spring({ frame: 5, fps: 30, delay: 10 })).toBe(0)
  })

  it('converges to ~1', () => {
    const s = spring({ frame: 100, fps: 30 })
    expect(Math.abs(s - 1)).toBeLessThan(0.01)
  })

  it('respects config', () => {
    const s = spring({ frame: 50, fps: 30, config: { damping: 20, stiffness: 200 } })
    expect(Math.abs(s - 1)).toBeLessThan(0.05)
  })
})

describe('Easing', () => {
  it('linear is identity', () => {
    expect(Easing.linear(0.5)).toBe(0.5)
  })

  it('out reverses easing', () => {
    expect(Easing.out(Easing.cubic)(1)).toBe(1)
    expect(Easing.out(Easing.cubic)(0)).toBe(0)
  })

  it('bezier returns correct endpoints', () => {
    const ease = Easing.bezier(0.25, 0.1, 0.25, 1)
    expect(Math.abs(ease(0))).toBeLessThan(0.01)
    expect(Math.abs(ease(1) - 1)).toBeLessThan(0.01)
  })
})

describe('clamp', () => {
  it('clamps below', () => {
    expect(clamp(-5, 0, 10)).toBe(0)
  })

  it('clamps above', () => {
    expect(clamp(15, 0, 10)).toBe(10)
  })

  it('passes through', () => {
    expect(clamp(5, 0, 10)).toBe(5)
  })
})

describe('random', () => {
  it('is deterministic with string seed', () => {
    expect(random('test')).toBe(random('test'))
  })

  it('is deterministic with number seed', () => {
    expect(random(42)).toBe(random(42))
  })

  it('returns different values for different seeds', () => {
    expect(random('a')).not.toBe(random('b'))
  })

  it('returns value in [0, 1)', () => {
    const val = random('particle-3')
    expect(val).toBeGreaterThanOrEqual(0)
    expect(val).toBeLessThan(1)
  })
})
