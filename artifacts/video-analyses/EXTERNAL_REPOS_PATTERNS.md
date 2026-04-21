# External Repos Pattern Analysis

Analysis of 6 video-related open-source projects to identify reusable patterns for roxabi-production.

**Date:** 2026-04-20
**Source repos:** `~/projects/external_repos/Rproduction/`

---

## Repositories Analyzed

| Repo | Purpose | Tech Stack |
|------|---------|------------|
| **hyperframes** | HTML-native video rendering for AI agents | TS monorepo, Puppeteer+FFmpeg, GSAP |
| **video-use** | LLM video editing via text transcripts | Python, ffmpeg, ElevenLabs Scribe |
| **AI_Animation** | HTML animation prompt templates | Vanilla HTML/CSS/JS |
| **OpenMontage** | Agentic video production studio | Python tools + Remotion |
| **openscreen** | Screen recorder + editor | Electron + React + PixiJS |
| **radiant** | 94 browser-based visual effects/shaders | SvelteKit, Canvas 2D, WebGL (GLSL) |

---

## Extracted Patterns

### 1. Skills Architecture (3-layer) — from OpenMontage, hyperframes

**Description:** Hierarchical skill organization: meta (user-facing) → pipelines (orchestrators) → providers (implementations).

**Source implementations:**
- OpenMontage: `skills/` with 3-layer hierarchy, stage director skills guide execution
- hyperframes: `/hyperframes`, `/gsap`, `/hyperframes-cli` skills teach agents framework-specific patterns

**Benefits:**
- Skill composition and reusability
- Shared provider context across skills
- Formal pipeline orchestration

---

### 2. EDL Format (Edit Decision List) — from video-use

**Description:** Declarative JSON edit spec with sources, ranges, overlays, subtitles. Enables reproducible renders.

**Source implementation:**
```json
// video-use EDL structure
{
  "sources": [{"path": "clip1.mp4", "start": 0, "end": 10}],
  "ranges": [{"source": 0, "in": 2.5, "out": 8.0}],
  "overlays": [{"type": "text", "start": 3.0, "text": "Hello"}],
  "subtitles": [{"start": 1.0, "end": 3.0, "text": "Welcome"}]
}
```

**Benefits:**
- Version-controlled timeline specs
- External tool interoperability
- Render caching and reproducibility
- LLM-readable composition format

---

### 3. Tool Contract Pattern — from OpenMontage

**Description:** `BaseTool` abstract class enforcing uniform interface with tier/status/cost estimation, health reporting, resume support.

**Source implementation:**
```python
# OpenMontage: tools/base_tool.py
class BaseTool(ABC):
    tier: ToolTier           # core, voice, enhance, generate...
    status: ToolStatus       # stable, beta, experimental
    runtime: ToolRuntime     # local, remote, hybrid

    @abstractmethod
    def estimated_cost(self, params: dict) -> CostEstimate: ...

    @abstractmethod
    def execute(self, params: dict) -> ToolResult: ...
```

**Benefits:**
- Consistent tool interface
- Cost estimation before execution
- Auto-registration via decorator/manifest
- Health monitoring and resume support

---

### 4. Self-Eval Loop — from video-use

**Description:** LLM inspects rendered output before user delivery. Catches visual jumps, audio pops, hidden subtitles.

**Source implementation:**
```
Render → Extract key frames → Analyze waveform → Check subtitles → Report issues → Suggest fixes
```

**Benefits:**
- Automatic quality assurance
- Catches issues before user sees them
- Feedback loop with actionable suggestions
- Frame-level error references

---

### 5. On-Demand Visual Artifacts — from video-use

**Description:** Generate visualization only at decision points. Timeline PNG: filmstrip + waveform + word labels + silence shading.

**Source implementation:**
```
timeline_view.py:
  - Composite filmstrip (sampled frames)
  - Waveform overlay
  - Word-level timestamp labels
  - Silence region shading
```

**Benefits:**
- Debug timing without full render
- LLM-readable visual context
- Efficient: generate only when needed
- Frame-accurate decision support

---

### 6. Data-Attribute Composition — from hyperframes

**Description:** HTML elements with `data-start`, `data-duration`, `data-track-index` define timeline declaratively.

**Source implementation:**
```html
<div data-start="0" data-duration="5" data-track-index="0">
  Opening title
</div>
<div data-start="5" data-duration="3" data-track-index="1">
  Scene transition
</div>
```

**Benefits:**
- Declarative timeline definition
- Framework-agnostic composition
- DOM-queryable timing info
- Potential for visual editors

---

### 7. Registry Auto-Discovery — from OpenMontage

**Description:** Tools auto-register via `pkgutil`/`inspect`. No manual wiring needed.

**Source implementation:**
```python
# OpenMontage: tools/tool_registry.py
for _, name, _ in pkgutil.iter_modules(__path__):
    module = importlib.import_module(f".{name}", package=__name__)
    for _, obj in inspect.getmembers(module, inspect.isclass):
        if issubclass(obj, BaseTool) and obj is not BaseTool:
            registry.register(obj())
```

**Benefits:**
- Zero-config component addition
- Automatic capability menu
- No manual index maintenance
- Extensible via plugins

---

### 8. Self-Contained Shader Pattern — from radiant

**Description:** Each shader = single HTML file with embedded `<style>`, `<canvas>`, `<script>`. Zero dependencies, no build step. Drop into any project via iframe.

**Source implementation:**
```html
<!-- radiant/static/*.html -->
<!DOCTYPE html>
<html>
<head>
  <style>body { margin: 0; overflow: hidden; }</style>
</head>
<body>
  <canvas id="c"></canvas>
  <script>
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    // Animation loop with DPR-aware sizing
    // Visibility-based pause for battery saving
    // postMessage API for runtime param control
  </script>
</body>
</html>
```

**Benefits:**
- Framework-agnostic visual effects
- Easy iframe embedding
- Runtime parameter control via `postMessage`
- Battery-friendly (visibility-aware pause)

---

### 9. Shader Parameter System — from radiant

**Description:** Runtime-controllable shader parameters with UI controls (min/max/step/default). Enables live tweaking without code changes.

**Source implementation:**
```javascript
// Each shader exposes params
const params = {
  speed: { min: 0.1, max: 5, step: 0.1, default: 1 },
  intensity: { min: 0, max: 1, step: 0.01, default: 0.5 },
  color: { type: 'color', default: '#ff6600' }
};

// Runtime control via postMessage
window.addEventListener('message', (e) => {
  if (e.data.type === 'param') {
    params[e.data.name].value = e.data.value;
  }
});
```

**Benefits:**
- Live parameter tweaking
- Consistent control interface
- Easy to port to React props
- Preset system friendly

---

## Component Ideas from radiant

**94 visual effects** organized by tags. Key techniques portable to roxabi-production kit components.

### Animation Techniques

| Technique | Description | Port Complexity |
|-----------|-------------|-----------------|
| **Simplex Noise** | 2D/3D noise for organic flow | Low — port math, wrap in React |
| **FBM (Fractal Brownian Motion)** | Layered noise for natural textures | Medium |
| **Domain Warping** | Distorted coordinate space for fluid effects | Medium |
| **Raymarching** | 3D metaballs, black holes, spheres | High — WebGL required |
| **Reaction-Diffusion** | Turing pattern generation | High — compute intensive |
| **Flow Fields** | Vector field particle steering | Low |
| **Flocking/Boids** | Murmuration simulation | Medium |
| **Physics Simulations** | Lorenz attractors, pendulums, spring meshes | Medium |

### Portable CSS Effects

| Effect | Implementation | kit-cinema candidate |
|--------|----------------|----------------------|
| **AmbientGlow** | Animated radial gradient aurora | ✅ `AuroraGlow` component |
| **Color Scheme Variants** | `filter: hue-rotate()` on parent | ✅ Theme system enhancement |
| **Darkening Layer** | Semi-transparent overlay for hero backgrounds | ✅ `HeroDarken` utility |

### Shader Categories for Kit Extension

```
radiant/static/  (94 effects)
├── fill/        → Full-screen background shaders
├── object/      → Single element effects (metaballs, spheres)
├── particles/   → Particle systems (flocking, trails)
├── physics/     → Simulations (attractors, springs)
├── noise/       → Noise-based textures (FBM, simplex)
├── organic/     → Natural patterns (reaction-diffusion)
└── geometric/   → Shapes and patterns
```

### Top 10 Candidates for kit-cinema Extension

| Shader | Effect | Why Port |
|--------|--------|----------|
| `aurora.html` | Flowing color gradients | Stunning background, pure Canvas 2D |
| `flow-field.html` | Particle flow visualization | Mesmerizing motion, low compute |
| `metaballs.html` | Organic blob shapes | Classic effect, WebGL needed |
| `simplex-waves.html` | Wave distortion | Smooth, versatile |
| `star-field.html` | 3D star zoom | Space/tech aesthetic |
| `plasma.html` | Classic plasma effect | Retro-futuristic |
| `lissajous.html` | Harmonic curves | Elegant math visualization |
| `noise-field.html` | Perlin noise texture | Organic backgrounds |
| `particle-trails.html` | Trailing particles | Dynamic motion |
| `tunnel.html` | Forward zoom effect | Cinematic transitions |

### Implementation Approach

**Option A: Canvas 2D Wrappers (Low effort)**
```tsx
// kits/kit-cinema/CanvasEffect.tsx
interface CanvasEffectProps {
  effect: 'aurora' | 'flowField' | 'plasma';
  params?: Record<string, number>;
}

export const CanvasEffect: React.FC<CanvasEffectProps> = ({ effect, params }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    // Port shader logic here
  }, [effect, params]);

  return <canvas ref={canvasRef} />;
};
```

**Option B: WebGL Shader Components (Medium effort)**
```tsx
// kits/kit-cinema/WebGLEffect.tsx
interface WebGLEffectProps {
  fragmentShader: string;  // GLSL source
  uniforms: Record<string, number | number[]>;
}

export const WebGLEffect: React.FC<WebGLEffectProps> = ({ fragmentShader, uniforms }) => {
  // WebGL setup, uniform binding, render loop
};
```

**Option C: Iframe Sandbox (Low effort, no port)**
```tsx
// kits/kit-cinema/IframeEffect.tsx
export const IframeEffect: React.FC<{ src: string; params?: object }> = ({ src, params }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (params) {
      Object.entries(params).forEach(([name, value]) => {
        iframeRef.current?.contentWindow?.postMessage({ type: 'param', name, value }, '*');
      });
    }
  }, [params]);

  return <iframe ref={iframeRef} src={src} />;
};
```

---

## Value Mapping for roxabi-production

### Current State

| Aspect | Current Implementation |
|--------|------------------------|
| **Skills** | 8 flat SKILL.md files, independent |
| **Components** | 65 React components, manual `index.ts` exports |
| **Pipeline** | React TSX → Puppeteer → FFmpeg → MP4 |
| **Registration** | Manual composition array in `dev/main.tsx` |
| **Format** | Pure React code, not serializable specs |

---

### Pattern Evaluation

| Pattern | What It Enables | What Changes | Effort | Priority |
|--------|-----------------|--------------|--------|----------|
| **Self-Eval Loop** | Auto quality checks: visual jumps, audio pops, subtitle timing. Catches issues *before* user sees them. | Post-render LLM inspection: extract key frames, analyze waveform, verify subtitles. Feedback loop suggests fixes. | Medium | **1** |
| **EDL Format** | Reproducible renders, version-controlled timelines, external tool interoperability, render caching. | JSON schema for sources/ranges/overlays. EDL → TSX transpiler. `.edl.json` as source of truth. | High | **2** |
| **Registry Auto-Discovery** | Zero-config kit/component addition. No manual `index.ts` updates. | `import.meta.glob` scans `kits/kit-*/*.tsx`. Auto-generate manifest at build. | Low | **2** |
| **Skills Architecture (3-layer)** | Skill composition, shared providers, reusable pipeline stages. `/produce` can formally call `/storyboard` → `/compose`. | Restructure: `meta/` (user-facing), `pipelines/` (orchestrators), `providers/` (implementations). Add skill invocation API. | Medium | **3** |
| **On-Demand Visual Artifacts** | Debug timing without full render. Timeline PNG: filmstrip + waveform + word labels. | `timeline_view` generator. Generate at decision points or errors only. | Medium | **3** |
| **Self-Contained Shader Pattern** | 94 ready-made visual effects for backgrounds/cinema. Framework-agnostic. | Add Canvas/WebGL effects to kit-cinema. Iframe sandbox option for zero-port integration. | Low-Medium | **3** |
| **Shader Parameter System** | Runtime-controllable effect params. Live tweaking without code changes. | Add `params` prop pattern to effect components. Enable preset system. | Low | **4** |
| **Tool Contract Pattern** | Tier/status/cost estimation, auto-registration, consistent interface. Governance for skills. | `BaseTool` abstract class. Wrap skills as tools. Decorator/manifest registration. | Low | **4** |
| **Data-Attribute Composition** | Declarative HTML timelines, easier inspection, potential visual editors. | Add `data-start/data-duration` to rendered elements. Hybrid props + attributes mode. | Low | **5** |

---

## Implementation Roadmap

### Phase 1: Quick Wins

#### 1.1 Registry Auto-Discovery

**Goal:** Remove manual `index.ts` maintenance for kits.

**Implementation:**
```typescript
// kits/index.ts
const kits = import.meta.glob('/kits/kit-*/*.tsx', { eager: true });

export const componentRegistry = Object.entries(kits)
  .map(([path, mod]) => ({
    name: basename(path, '.tsx'),
    kit: path.match(/kit-([^/]+)/)?.[1],
    component: (mod as any).default
  }))
  .reduce((acc, { kit, name, component }) => {
    acc[kit] = acc[kit] || {};
    acc[kit][name] = component;
    return acc;
  }, {});
```

**Files to modify:**
- `kits/kit-*/index.ts` → delete
- `kits/index.ts` → add auto-discovery
- `dev/main.tsx` → use registry

---

#### 1.2 Self-Eval Loop

**Goal:** Automatic quality checks post-render.

**Implementation:**
1. Add post-render hook in `renderer/render.ts`
2. Extract key frames (every 10% + scene boundaries)
3. Analyze audio waveform for pops/silence via FFprobe
4. Verify subtitle timing and visibility
5. Report issues with frame references

**Files to modify:**
- `renderer/render.ts` → add `selfEval()` function
- `renderer/evaluator.ts` → new file for frame/audio analysis
- `plugins/video-engine/skills/render/SKILL.md` → document eval step

---

### Phase 2: Foundation

#### 2.1 EDL Format

**Goal:** Serializable composition specs for reproducibility.

**Implementation:**
1. Define JSON schema (adapted from video-use)
2. Create `compositions/<name>/composition.edl.json`
3. Build EDL → TSX code generator
4. Store EDL as source of truth, TSX as compiled output

**Schema draft:**
```json
{
  "$schema": "./edl.schema.json",
  "id": "LyraLaunchTrailer",
  "duration": 30,
  "fps": 30,
  "tracks": [
    {
      "id": "video",
      "clips": [
        {
          "component": "SlideBase",
          "start": 0,
          "duration": 5,
          "props": { "children": "Opening" }
        }
      ]
    },
    {
      "id": "audio",
      "clips": [
        { "type": "vo", "file": "vo.wav", "start": 0 },
        { "type": "bgm", "file": "music.mp3", "volume": 0.2 }
      ]
    }
  ]
}
```

---

#### 2.2 Skills Architecture (3-layer)

**Goal:** Formalize skill hierarchy and composition.

**Structure:**
```
plugins/video-engine/skills/
├── meta/                    # User-facing skills
│   ├── produce/SKILL.md
│   └── storyboard/SKILL.md
├── pipelines/               # Orchestrators
│   ├── render-pipeline/SKILL.md
│   └── audio-pipeline/SKILL.md
└── providers/               # Implementations
    ├── voicecli/SKILL.md
    └── ffmpeg/SKILL.md
```

**Changes:**
- `/produce` calls `/storyboard` → `/compose` → `/voice-over` → `/render`
- Shared context via skill invocation API
- Provider skills for external tools (VoiceCLI, FFmpeg)

---

### Phase 3: DX Enhancement

#### 3.1 On-Demand Visual Artifacts

**Goal:** Timeline visualization without full render.

**Implementation:**
```typescript
// renderer/timeline_view.ts
export async function generateTimelineView(
  composition: Composition,
  timepoints: number[]
): Promise<Buffer> {
  // 1. Sample frames at timepoints
  // 2. Generate waveform from audio
  // 3. Composite: filmstrip + waveform + labels
  // 4. Return PNG buffer
}
```

**Triggers:**
- Debug mode in `/render`
- Error inspection in self-eval loop
- Manual `/timeline` skill

---

## Critical Files

| File | Role | Phase |
|------|------|-------|
| `renderer/render.ts` | Add self-eval hook, timeline view | 1.2, 3.1 |
| `kits/index.ts` | Auto-discovery implementation | 1.1 |
| `dev/main.tsx` | EDL support, registry integration | 2.1 |
| `plugins/video-engine/skills/produce/SKILL.md` | 3-layer restructure | 2.2 |
| `renderer/edl.ts` | EDL → TSX transpiler | 2.1 |
| `renderer/evaluator.ts` | Frame/audio analysis | 1.2 |
| `kits/kit-cinema/CanvasEffect.tsx` | Canvas 2D effect wrapper (radiant port) | 3 |
| `kits/kit-cinema/WebGLEffect.tsx` | WebGL shader component (radiant port) | 3 |

---

## References

- **hyperframes:** `~/projects/external_repos/Rproduction/hyperframes`
- **video-use:** `~/projects/external_repos/Rproduction/video-use`
- **AI_Animation:** `~/projects/external_repos/Rproduction/AI_Animation`
- **OpenMontage:** `~/projects/external_repos/Rproduction/OpenMontage`
- **openscreen:** `~/projects/external_repos/Rproduction/openscreen`
- **radiant:** `~/projects/external_repos/Rproduction/radiant` — 94 visual effects/shaders for kit-cinema extension
