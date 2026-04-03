---
name: showcase
description: 'Preview or render the component showcase video — 9 scenes, 56 seconds, all 12 kits on display. Triggers: "showcase" | "demo video" | "component showcase" | "show what we can do".'
version: 1.0.0
allowed-tools: Read, Bash
---

# Showcase

**Goal:** Open the showcase in Studio preview or render it to MP4.

## Steps

1. **Check dev server** — `curl -s http://localhost:3001 > /dev/null 2>&1`.

2. **Open Studio** — server not running → advise `bun dev`, navigate to `http://localhost:3001`, select `showcase`.

3. **Render (MP4):**
   ```bash
   bun render --composition showcase --fps 30 --output dist/showcase.mp4
   ```

## Showcase contents

| Scene | Duration | Components |
|-------|---------|------------|
| Opening | 7s | GlitchText, ChromaticAberration, FloatingOrbs, FilmGrain |
| Typography | 6s | GlitchText, StaggeredWords, Typewriter, GridPattern |
| Cinema & Atmosphere | 6s | BokehBackground, FogLayer, FloatingOrbs, LightSweep — all 15 bg/cinema |
| UI Kit | 6s | PhoneFrame + ChatInterface, GitHubCard, BrandBadge |
| Data Viz | 6s | NeuralNetworkGraph, AnimatedCounter, ProgressRing, AnimatedBar |
| Motion | 6s | 5 AnimatedShapes + PulseGlow + ScalePop, kit-motion badge row |
| Layout + Overlays | 6s | TextCard full frame, LowerThird, all 15 layout/overlay components |
| The Engine | 6s | TunnelEffect, ImpactText, render CLI Typewriter, FloatingObject |
| Closing | 7s | ImpactText "BUILD ANYTHING.", all 12 kit badges spring in |
