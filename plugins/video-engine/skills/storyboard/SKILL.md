---
name: storyboard
description: 'Plan a video with scenes, timing, narrative arc, VO script, and visual direction before building. Triggers: "storyboard" | "plan a video" | "video plan" | "scene breakdown" | "video brief".'
version: 1.0.0
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# Storyboard

**Goal:** Plan a composition before building — define scenes, timing, narrative arc, VO draft, visual direction. Output a spec `/compose` and `/voice-over` consume directly.

Let: P = `compositions/<name>`, W = ~2.5w/s VO pacing

## Steps

1. **Gather brief** — ask what's missing: Subject | Audience (developers/investors/users/general) | Duration (default 30–60s) | Tone (cinematic/energetic/professional/playful/dramatic) | Key messages (3–5 bullets) | CTA | Reference (existing compositions or external videos).

2. **Choose narrative structure:**

   | Structure | Best for | Pattern |
   |-----------|----------|---------|
   | Hook → Problem → Solution → CTA | Product launches, demos | Attention → Pain → Relief → Action |
   | Before → After → Bridge | Transformations, upgrades | Old → New → How |
   | Story arc | Brand films, case studies | Setup → Rising → Climax → Resolution |
   | Feature showcase | Demos, tutorials | Intro → Feature 1 → … → Wrap |
   | Countdown/listicle | Social, short-form | N → N-1 → … → 1 → CTA |

3. **Plan scenes** — ∀ scene define:

   ```markdown
   ### Scene N — <Title> [Xs, frames F1–F2]

   **Visual:**
   - Background: <component> with <props>
   - Main element: <component>
   - Effects: <components>
   - Transition in: <type>

   **Text on screen:**
   > The text the viewer sees

   **Narration (VO):**
   > What the narrator says

   **Mood:** <emotion> — <color palette hint>

   **Kit components:**
   - `GradientBackground` (kit-backgrounds)
   - `FadeIn` > `Title` (kit-motion, kit-layout)
   - `Vignette` (kit-cinema)
   ```

4. **Timing budget** — verify total ≤ target:

   | Scene | Duration | Cumulative | VO words (W) |
   |-------|---------|------------|--------------|
   | Opening | 5s | 0:05 | ~12 |
   | Scene 2 | 8s | 0:13 | ~20 |
   | Scene 3 | 8s | 0:21 | ~20 |
   | Closing | 5s | 0:26 | ~12 |
   | **Total** | **26s** | | **~64** |

   Total exceeds target → flag, adjust lengths or cut scenes.

5. **Color palette** — define or extract from reference:
   ```
   BG: #0a0a0f  Primary: #e85d04  Accent: #3b82f6  Text: #fafafa  Muted: #6b7280
   ```

6. **Write storyboard file** — save to `P/storyboard.md`:

   ```markdown
   # Storyboard: <Name>

   ## Brief
   - Subject: ...  Audience: ...  Duration: Xs  Tone: ...  Format: 1920x1080

   ## Narrative Structure
   Hook → Problem → Solution → CTA

   ## Color Palette
   | Role | Hex | Usage |
   |------|-----|-------|
   | BG | #0a0a0f | All scenes |
   | Primary | #e85d04 | Accents, highlights |
   | Text | #fafafa | All text |

   ## Scenes

   ### Scene 1 — Hook [5s, 0–150]
   **Visual:** GradientBackground + GlitchText entrance
   **Text:** "Your AI assistant knows nothing about you."
   **VO:** "Your AI assistant knows nothing about you. Tomorrow, it will know nothing again."
   **Mood:** Tension — dark palette, subtle grain
   **Transition in:** fade
   **Components:** GradientBackground, GlitchText, FilmGrain, Vignette

   ### Scene 2 — Problem [8s, 150–390]
   ...

   ## Audio Plan
   - **VO:** Yes — Sohee, qwen, measured pace
   - **BGM:** Ambient electronic, vol 0.2
   - **SFX:** Glitch on S1, whoosh on transitions, impact on reveal

   ## Deliverables
   - [ ] Composition TSX (`/compose`)
   - [ ] Voice-over script + WAV (`/voice-over`)
   - [ ] Soundtrack mix (`/soundtrack`)
   - [ ] Final MP4 (`/render`)
   ```

7. **Present for approval** — user can adjust scene order/duration/content, visual direction, VO tone, scenes.

8. **Hand off** — approved storyboard feeds: `/compose` (scene breakdown + components) | `/voice-over` (VO draft + voice profile) | `/soundtrack` (audio plan) | `/produce` (full pipeline).
