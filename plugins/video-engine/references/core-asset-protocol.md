# Core Asset Protocol

> Adapted from huashu-design SKILL.md v1.1 (2026-04-20)
> Video production context: brand asset acquisition for video/animation projects

## Asset Priority

Recognition = identity. Order matters:

| Asset Type | Recognition Value | Requirement |
|------------|-------------------|-------------|
| **Logo** | Highest — instant brand recognition | **Any brand: mandatory** |
| **Product Images** | Extreme — physical product "hero" | **Physical products: mandatory** |
| **UI Screenshots** | Extreme — digital product "hero" | **Digital products: mandatory** |
| **Colors** | Medium — auxiliary, often duplicated across brands | Auxiliary |
| **Fonts** | Low — needs context to establish recognition | Auxiliary |

## 5-Step Process

### Step 1 — Ask (Complete Asset Checklist)

Single prompt to user:

```
For <brand/product>, which assets do you have? Priority order:
1. Logo (SVG / high-res PNG) — mandatory for any brand
2. Product images / official renders — mandatory for physical products
3. UI screenshots / interface assets — mandatory for digital products
4. Color palette (HEX / RGB)
5. Font list (Display / Body)
6. Brand guidelines PDF / Figma / website link

Send what you have; I'll search/generate the rest.
```

### Step 2 — Search Official Channels

| Asset | Search Paths |
|-------|--------------|
| **Logo** | `<brand>.com/brand` · `<brand>.com/press` · `<brand>.com/press-kit` · `brand.<brand>.com` · Website header inline SVG |
| **Product Images** | `<brand>.com/<product>` hero image + gallery · Official YouTube launch film frames · Press release images |
| **UI Screenshots** | App Store / Google Play product screenshots · Website screenshots section · Demo video frames |
| **Colors** | Website inline CSS / Tailwind config / brand guidelines PDF |
| **Fonts** | Website `<link>` imports · Google Fonts tracking · Brand guidelines |

Fallback search terms:
- Logo: `<brand> logo download SVG`, `<brand> press kit`
- Product: `<brand> <product> official renders`, `<brand> <product> product photography`
- UI: `<brand> app screenshots`, `<brand> dashboard UI`

### Step 3 — Download by Type

**3.1 Logo (mandatory)**

Priority order:
1. Standalone SVG/PNG: `curl -o assets/<brand>-brand/logo.svg https://<brand>.com/logo.svg`
2. Extract inline SVG from homepage HTML: `curl -A "Mozilla/5.0" -L https://<brand>.com -o assets/<brand>-brand/homepage.html` then grep `<svg>...</svg>`
3. Social media avatar (GitHub/Twitter/LinkedIn) — 400x400 or 800x800 transparent PNG

**3.2 Product Images (physical products)**

Priority:
1. Official product page hero image (2000px+)
2. Official press kit
3. Launch video frames (yt-dlp + ffmpeg)
4. Wikimedia Commons
5. AI generation (nano-banana-pro) with official reference as base

**3.3 UI Screenshots (digital products)**

- App Store / Google Play screenshots (verify: mockup vs real UI)
- Website screenshots section
- Demo video frames
- Official social media posts
- User account screenshots (if available)

### Step 4 — "5-10-2-8" Quality Principle

> **Logo exception**: If logo exists, use it — no quality threshold. Logo = recognition foundation.

For other assets (product images, UI, reference images):

| Dimension | Standard |
|-----------|----------|
| **5 search rounds** | Multiple channels (official site / press kit / social media / YouTube frames / Wikimedia), not just first page |
| **10 candidates** | Collect at least 10 options before filtering |
| **Select 2 best** | From 10, pick exactly 2 as final assets |
| **Each 8/10+ score** | Below 8 = don't use. Use honest placeholder (gray block + label) or AI generation instead |

**8/10 Scoring dimensions**:
1. Resolution — >=2000px (print/large screen: >=3000px)
2. Copyright clarity — Official > Public domain > Free stock > Suspected unauthorized (0 points)
3. Brand fit — Matches brand personality keywords
4. Consistency — Style/lighting/composition matches between assets
5. Narrative independence — Can stand alone as storytelling element

### Step 5 — Write brand-spec.md

Template:

```markdown
# <Brand> · Brand Spec
> Collection date: YYYY-MM-DD
> Sources: <list download sources>
> Completeness: <Complete / Partial / Inferred>

## Core Assets

### Logo
- Primary: `assets/<brand>-brand/logo.svg`
- Inverse (light bg): `assets/<brand>-brand/logo-white.svg`
- Use case: <intro/outro/corner watermark/global>
- Prohibited: <no stretch/color change/outline>

### Product Images (physical products)
- Hero: `assets/<brand>-brand/product-hero.png` (2000x1500)
- Details: `assets/<brand>-brand/product-detail-1.png`
- Scene: `assets/<brand>-brand/product-scene.png`
- Use case: <closeup/rotation/comparison>

### UI Screenshots (digital products)
- Home: `assets/<brand>-brand/ui-home.png`
- Core feature: `assets/<brand>-brand/ui-feature-<name>.png`
- Use case: <product reveal/dashboard fade/comparison demo>

## Auxiliary Assets

### Colors
- Primary: #XXXXXX <source>
- Background: #XXXXXX
- Text: #XXXXXX
- Accent: #XXXXXX
- Prohibited: <explicitly unused color ranges>

### Fonts
- Display: <font stack>
- Body: <font stack>
- Mono (HUD/data): <font stack>

### Brand Traits
- <3-5 adjectives>

### No-Go Zone
- <Explicit restrictions: e.g., "no blue for Lovart", "no warm low-saturation for Stripe">
```

## Hard Rules

1. **Never use CSS silhouettes for product images** — produces "generic tech animation", any brand looks identical
2. **All HTML must reference brand-spec.md asset paths** — no inline CSS inventing new colors
3. **Logo as `<img>` with real file** — never redraw
4. **CSS variables from spec only**: `:root { --brand-primary: ...; }`
5. **Missing logo = stop and ask user** — don't proceed without it

## Fallback Protocol

| Missing Asset | Action |
|---------------|--------|
| **Logo not found** | **Stop and ask user** — logo is recognition foundation |
| **Product images (physical)** | AI generation with official reference → ask user → honest placeholder |
| **UI screenshots (digital)** | Ask user for account screenshots → demo video frames |
| **Colors not found** | Recommend 3 directions via design consultation, label as assumption |

## Time Cost

| Path | Time |
|------|------|
| Full protocol | Download logo (5 min) + product/UI images (10 min) + extract colors (5 min) + write spec (10 min) = **30 min** |
| Skip protocol | Generic unrecognizable output → 1-2 hour rework |

30 minutes is the cheapest stability investment for commercial/launch/important client projects.
