---
name: analyze
description: 'Analyze a video composition for quality, timing, and visual completeness. Triggers: "analyze video" | "review composition" | "video feedback" | "improve video" | "video quality check".'
version: 0.1.0
argument-hint: '[composition file path or ID]'
allowed-tools: Read, Glob, Grep, AskUserQuestion
---

# Analyze Video Composition

Review a video composition for quality, timing, visual variety, and best practices.

## Context

Uses `lib/video-analyzer.ts` analysis framework and knowledge of the 13 kits (55 components) to evaluate compositions.

## Phases

**1 — Locate the composition.** If the user provides a file path or composition ID, use it. Otherwise, scan for `.tsx` files containing `useCurrentFrame` or `Sequence` imports.

**2 — Read the composition.** Read the full source file and all imported scene components.

**3 — Analyze.** Evaluate against these criteria:

**Timing & Pacing:**
- Scene durations — are they appropriate for the content? (too fast < 60 frames, too slow > 300 frames per scene for simple content)
- Total duration — reasonable for the content type?
- Transition gaps — are there frame gaps between Sequences?
- Stagger delays — do animations overlap or feel rushed?

**Visual Variety:**
- Kit diversity — how many different kits are used? (aim for 3+ for any video > 15s)
- Component repetition — same component reused too often?
- Background variation — same background across all scenes?
- Layout patterns — all scenes using the same structure?

**Technical Quality:**
- Are `Sequence` components used with explicit `from` and `durationInFrames`?
- Is `AbsoluteFill` used as scene root?
- Are animations frame-based (not time-based)?
- Is `random()` used with seeds for deterministic rendering?
- Are interpolations clamped to avoid extrapolation?
- Are spring configs reasonable (damping 10-30, stiffness 100-300)?

**Completeness:**
- Missing transitions between scenes?
- Text without entrance animations?
- Data visualizations without labels?
- UI mockups without context?
- Audio referenced but no SyncedCaptions?

**4 — Report findings.** Present a structured report:

```
## Composition Analysis: <name>

### Summary
- Scenes: N | Duration: Xs (N frames @ 30fps)
- Kits used: kit-text, kit-motion, ...
- Components: N unique / N total uses

### Strengths
- ...

### Issues
| # | Severity | Category | Finding | Suggestion |
|---|----------|----------|---------|------------|
| 1 | high     | timing   | Scene 3 is 15 frames (0.5s) — too fast to read | Extend to 90+ frames |

### Recommended Improvements
1. ...
```

## Edge Cases

| Scenario | Behavior |
|----------|----------|
| No compositions found | Inform user — suggest using the `generate` skill |
| Composition imports external dependencies | Flag but don't fail — note the dependency |
| Single-scene composition | Valid — skip variety checks, focus on quality |

$ARGUMENTS
