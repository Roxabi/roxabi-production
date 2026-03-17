import React, { useState } from 'react'
import { Player } from './Player'
import type { CompositionConfig } from '../core'

export const Studio: React.FC<{
  compositions: CompositionConfig[]
}> = ({ compositions }) => {
  const [activeIdx, setActiveIdx] = useState(0)
  const active = compositions[activeIdx]

  if (!active) return <div style={{ color: '#fff', padding: 24 }}>No compositions registered.</div>

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#111' }}>
      <div style={{ width: 240, borderRight: '1px solid #333', overflowY: 'auto', padding: 12 }}>
        <h3 style={{ color: '#fff', fontSize: 14, marginBottom: 12 }}>Compositions</h3>
        {compositions.map((comp, i) => (
          <button
            key={comp.id}
            onClick={() => setActiveIdx(i)}
            style={{
              display: 'block', width: '100%', textAlign: 'left',
              padding: '8px 12px', marginBottom: 4, border: 'none', borderRadius: 4,
              background: i === activeIdx ? '#333' : 'transparent',
              color: i === activeIdx ? '#fff' : '#888',
              cursor: 'pointer', fontSize: 13,
            }}
          >
            {comp.id}
            <span style={{ float: 'right', fontSize: 11, opacity: 0.5 }}>
              {(comp.durationInFrames / comp.fps).toFixed(0)}s
            </span>
          </button>
        ))}
      </div>

      <div style={{ flex: 1, padding: 24 }}>
        <Player composition={active} />
      </div>
    </div>
  )
}
