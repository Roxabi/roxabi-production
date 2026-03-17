import React from 'react'
import { createRoot } from 'react-dom/client'
import { Studio } from '../player/Studio'
import type { CompositionConfig } from '../core/types'

// Placeholder compositions — will be populated as kits are migrated
const compositions: CompositionConfig[] = []

createRoot(document.getElementById('root')!).render(<Studio compositions={compositions} />)
