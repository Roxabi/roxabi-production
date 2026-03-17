import React from 'react'
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { FrameProvider, useCurrentFrame, Sequence, Series } from '../core'
import type { VideoConfig } from '../core'

const testConfig: VideoConfig = { fps: 30, width: 1920, height: 1080, durationInFrames: 900 }

const FrameDisplay: React.FC = () => {
  const frame = useCurrentFrame()
  return <span data-testid="frame">{frame}</span>
}

describe('Sequence', () => {
  it('resets frame to local scope (parent=15, from=10 → child sees 5)', () => {
    const { getByTestId } = render(
      <FrameProvider frame={15} config={testConfig}>
        <Sequence from={10} durationInFrames={20}>
          <FrameDisplay />
        </Sequence>
      </FrameProvider>
    )
    expect(getByTestId('frame').textContent).toBe('5')
  })

  it('renders null when frame is before the sequence', () => {
    const { container } = render(
      <FrameProvider frame={5} config={testConfig}>
        <Sequence from={10} durationInFrames={20}>
          <FrameDisplay />
        </Sequence>
      </FrameProvider>
    )
    expect(container.querySelector('[data-testid="frame"]')).toBeNull()
  })

  it('renders null when frame is past the sequence', () => {
    const { container } = render(
      <FrameProvider frame={35} config={testConfig}>
        <Sequence from={10} durationInFrames={20}>
          <FrameDisplay />
        </Sequence>
      </FrameProvider>
    )
    expect(container.querySelector('[data-testid="frame"]')).toBeNull()
  })

  it('renders at the exact start frame (localFrame=0)', () => {
    const { getByTestId } = render(
      <FrameProvider frame={10} config={testConfig}>
        <Sequence from={10} durationInFrames={20}>
          <FrameDisplay />
        </Sequence>
      </FrameProvider>
    )
    expect(getByTestId('frame').textContent).toBe('0')
  })

  it('renders at the last valid frame', () => {
    const { getByTestId } = render(
      <FrameProvider frame={29} config={testConfig}>
        <Sequence from={10} durationInFrames={20}>
          <FrameDisplay />
        </Sequence>
      </FrameProvider>
    )
    expect(getByTestId('frame').textContent).toBe('19')
  })

  it('defaults to infinite duration when durationInFrames is omitted', () => {
    const { getByTestId } = render(
      <FrameProvider frame={1000} config={testConfig}>
        <Sequence from={10}>
          <FrameDisplay />
        </Sequence>
      </FrameProvider>
    )
    expect(getByTestId('frame').textContent).toBe('990')
  })
})

describe('Series', () => {
  const ChildA: React.FC<{ durationInFrames: number }> = () => {
    const frame = useCurrentFrame()
    return <span data-testid="a">{frame}</span>
  }

  const ChildB: React.FC<{ durationInFrames: number }> = () => {
    const frame = useCurrentFrame()
    return <span data-testid="b">{frame}</span>
  }

  it('shows first child at frame 0', () => {
    const { getByTestId, container } = render(
      <FrameProvider frame={0} config={testConfig}>
        <Series>
          <ChildA durationInFrames={30} />
          <ChildB durationInFrames={30} />
        </Series>
      </FrameProvider>
    )
    expect(getByTestId('a').textContent).toBe('0')
    expect(container.querySelector('[data-testid="b"]')).toBeNull()
  })

  it('shows second child after first ends (frame=31 → child B at local frame 1)', () => {
    const { container, getByTestId } = render(
      <FrameProvider frame={31} config={testConfig}>
        <Series>
          <ChildA durationInFrames={30} />
          <ChildB durationInFrames={30} />
        </Series>
      </FrameProvider>
    )
    expect(container.querySelector('[data-testid="a"]')).toBeNull()
    expect(getByTestId('b').textContent).toBe('1')
  })

  it('shows neither child after both end', () => {
    const { container } = render(
      <FrameProvider frame={61} config={testConfig}>
        <Series>
          <ChildA durationInFrames={30} />
          <ChildB durationInFrames={30} />
        </Series>
      </FrameProvider>
    )
    expect(container.querySelector('[data-testid="a"]')).toBeNull()
    expect(container.querySelector('[data-testid="b"]')).toBeNull()
  })
})
