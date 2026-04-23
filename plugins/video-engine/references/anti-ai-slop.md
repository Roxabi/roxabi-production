# Anti-AI Slop Quick Reference

> AI slop = AI training corpus "visual least common denominator". Not ugly per se, but **carries zero brand information** — dilutes any brand into "another AI-made page".

## Quick-Reference Table

| Element | Why it's slop | When it's OK | Alternative |
|---------|---------------|--------------|-------------|
| **Purple gradients** | AI's default "tech feel" formula — appears in every SaaS/AI/web3 landing | Brand explicitly uses purple gradient (Linear) or task is satirizing slop | Brand color from spec; oklch() for harmonious derivation; single-color accent |
| **Emoji as icons** | AI puts emoji on every bullet — "not pro, use emoji to compensate" syndrome | Brand itself uses emoji (Notion, Slack) or audience is children/casual | Real icon library (Lucide/Heroicons/Phosphor); honest placeholder (gray box + label) |
| **Rounded cards + left border accent** | 2020-2024 Material/Tailwind泛滥 — now visual noise | Brand spec explicitly preserves this pattern | Background contrast; font weight/size contrast; plain dividers; no card at all |
| **SVG hand-drawn imagery** (faces, scenes, objects) | AI SVG always has wrong proportions, uncanny geometry — instantly recognizable as cheap | Almost never | Real photos (Wikimedia/Unsplash); AI-generated images (nano-banana-pro with official reference); honest placeholder |
| **CSS silhouettes for products** | Produces "generic tech animation" — black bg + orange accent + rounded bars; zero brand recognition | Almost never | Follow core asset protocol: find real product renders; use AI generation with official reference as base; mark placeholder with "product image pending" |
| **Inter/Roboto as display fonts** | Too common — reader can't tell if it's "designed product" or "demo page" | Brand spec explicitly uses these (Stripe uses tuned Sohne/Inter variant) | Distinctive display + body pair: serif display + sans body (editorial); mono display + sans body (technical) |
| **Cyber neon / #0D1117 backgrounds** | GitHub dark mode aesthetic copied ad nauseam | Developer tool product with matching brand direction | Brand's own background from spec; warm neutral base; single accent color |
| **Filler stats/quotes** | Invented "10,000+ users", "99.9% uptime", fake testimonials — no real data | Real data exists | Honest placeholder: "<!-- waiting for real data -->"; ask user for actual stats |
| **Decorative icons everywhere** | Every title/feature/section gets icon — interface looks like toy | Icons carry differentiation information (data density for AI products) | Remove; keep only functional icons; one detail at 120%, others at 80% |

## Why AI Slop Matters

1. User hires you for design → expects **their brand recognized**
2. AI default output = training corpus average = all brands mixed = **zero brand recognition**
3. So AI default = dilutes user's brand into "another AI-made page"
4. Anti-slop is not aesthetic snobbery — **protecting brand recognition**

## What to Do Instead

### Typography
```
✅ Serif display + sans body (editorial feel)
✅ Mono display + sans body (technical feel)
✅ Heavy display + light body (contrast)
✅ Variable font for hero weight animation

❌ Inter / Roboto / Arial / system fonts as display
❌ Fraunces / Space Grotesk (AI discovered and overused)
```

### Color
```
✅ Use brand color from spec
✅ Derive missing tokens via oklch() interpolation
✅ Single accent color throughout
✅ Known palette (Radix / Tailwind / Anthropic brand) when from scratch

❌ Invent colors from scratch
❌ Purple/blue/pink rainbow gradients
❌ Dark mode = simple color invert
```

### Images
```
✅ Real photos: Wikimedia Commons, Met Museum Open Access, Unsplash
✅ AI generation with official reference as base (nano-banana-pro)
✅ Product renders from official press kit
✅ Honest placeholder: gray box + "Image placeholder 1200×800"

❌ SVG drawing people/scenes/objects
❌ CSS silhouettes replacing real product images
❌ Stock photo decoration unrelated to content
```

### Layout & Containers
```
✅ Asymmetric card sizes
✅ Some cards with images, some text-only
✅ Background contrast instead of border accents
✅ Composition solves empty space (rhythm, contrast, whitespace)

❌ Every card identical
❌ Card + border-left accent as default
❌ Bento grid by default
❌ Hero + 3-column features + testimonials + CTA template
```

### Content
```
✅ Every element earns its place
✅ "One thousand no's for every yes"
✅ Ask user for real data/quotes before adding
✅ Placeholder + label when content pending

❌ Fillers: stats, quotes, testimonials without real data
❌ Emoji decoration on headings/bullets
❌ Icons for every section regardless of need
```

### CSS Excellence (signals real designer)
```css
/* Typography finesse */
h1, h2, h3 { text-wrap: balance; }
p { text-wrap: pretty; }

/* Color harmony via oklch */
:root {
  --primary: oklch(0.65 0.18 25);
  --primary-light: oklch(0.85 0.08 25);
}

/* Modern layout */
.layout { display: grid; grid-template-areas: "..."; }
.card { display: grid; grid-template-rows: subgrid; }
```

## Decision Heuristics

| When you want to... | Default answer |
|---------------------|----------------|
| Add a gradient | **Don't** |
| Add an emoji | **Don't** |
| Add rounded card + left border | **Don't** — find other emphasis method |
| Draw SVG hero illustration | **Don't** — use placeholder |
| Add quote decoration | Ask user for real quote first |
| Add icon row for features | Ask if icons needed — probably not |
| Use Inter | Switch to distinctive font |
| Use purple gradient | Switch to brand-based color |

> **When you feel "adding this would look better" — that's usually AI slop symptom.** Make the minimal version first; add only when user requests.

## Sources

- `huashu-design/SKILL.md` — Section "反AI slop" (lines 326-368)
- `huashu-design/references/content-guidelines.md` — Full slop checklist
