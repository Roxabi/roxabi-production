# DESIGN.md — Roxabi Presentation Video

**Source of truth:** `~/.roxabi/forge/roxabi-site/brand/DESIGN.md` (Roxabi v1.5) + `~/.roxabi/forge/mickael/brand/BRAND-BOOK.md` v1.2 (smith register, earned).

**Subject layering (locked from DP-3):** smith (Mickael) → forges → blades → guild. Roxabi creed is the destination; Mickael is the bridge into it.

## Style Prompt

Cool-dark editorial — GitHub-dark elevation ladder, warm off-white text, single amber accent doing all the interaction work. Motion is restrained: type-in, mark-reveal, crossfade. No parallax theatrics, no equalizer-bar clichés. Density over decoration. Earned mythic register only on the smith opener and the final guild line.

## Colors

| Token | Hex | Role |
|---|---|---|
| `--bg` | `#0d1117` | Page ground (all scenes) |
| `--panel` | `#13191f` | Cards, scene panels |
| `--surface` | `#161b22` | Inner card surface |
| `--accent` | `#f0b429` | Amber — single signal (key words, dot, slash, CTA) |
| `--accent-hover` | `#fbbf24` | Pulse / motion accent |
| `--text` | `#f0ede6` | Body, headings (warm on cool — signature) |
| `--text-muted` | `#9ca3af` | Sub-labels, captions |
| `--text-dim` | `#6b7280` | Timestamps, scene meta |
| `--border` | `#21262d` | Dividers |
| `--border-hi` | `#30363d` | Active dividers |

## Typography

| Role | Family | Weight | Size | Notes |
|---|---|---|---|---|
| Display | Inter | 900 | 4rem | Hero numbers ("14", "M₁ · M₂"), final CTA |
| H1 | Inter | 850 | 2.5rem | Scene titles |
| H2 | Inter | 700 | 1.75rem | Blade names |
| Body | Inter | 400 | 1rem | Scene body, narration captions |
| Label-caps | Inter | 500 | 0.75rem · 0.15em tracking | UPPERCASE scene meta ("SCENE 02 — THE FORGE") |
| Mono | ui-monospace | 400 | 0.875rem | Service IDs (`lyra_telegram`), paths |

Letter-spacing: `-0.04em` on display, `-0.03em` on H1. Per Roxabi DESIGN.md.

## Motion Character

- **Entrances:** `opacity 0→1` with `y: 24→0`, `duration: 0.6`, `ease: power2.out`. Stagger 0.08s where multiple.
- **Exits:** none — scene transition IS the exit (per hyperframes rule).
- **Transition between scenes:** **blur crossfade** (CSS primitive) — `filter: blur(0)→blur(12px)` outgoing, fade in fresh. 0.5s overlap.
- **Amber accent reveals:** word highlight uses background-clip on the word itself, not a separate underline tween — keeps it deterministic.
- **Slash mark `/`:** the Roxabi mark. Animates as a single 45° draw (`clipPath: inset(0 100% 0 0)→inset(0)`), 0.4s ease-out, on scene transitions where the slash is the bridge.

## What NOT to do

1. **No equalizer bars or audio-reactive scope.** Narration drives nothing visually — captions only.
2. **No `#3b82f6`, no `#333`, no Roboto.** Tells of skipped identity gate.
3. **No exit animations on intermediate scenes.** Transition is the exit.
4. **No "ex-PM" / "journey" / "pivot" / "10x" / "game-changer".** Banned per brand book.
5. **No more than one amber element animating at a time.** Amber is the single signal — multiple amber pulses dilute it.
6. **No `<br>` for content wrapping.** Use `max-width`. `<br>` only for deliberate display titles where each word wants its own line.
7. **No Roboto, Helvetica fallback. Inter is the brand face.**
8. **No infinite repeats (`repeat: -1`).** Breaks capture.

## Scene → palette role

| Scene | Title | Background | Amber role | Mood |
|---|---|---|---|---|
| 01 | THE SMITH | `--bg` | "14" hero number; key verb highlights | mythic-earned, restrained |
| 02 | THE FORGE | `--bg` w/ subtle `--panel` band | M₁/M₂ status dots; "OPEN" pulse | technical-peer |
| 03 | THE BLADES | `--bg` w/ 4 `--panel` cards | per-blade status `●`; compound-stair line | dense, kinetic |
| 04 | THE GUILD | `--bg` | final slash + URL + "OPEN" | mythic-earned close |
