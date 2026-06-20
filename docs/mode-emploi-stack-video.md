# Mode d'emploi — stack vidéo Roxabi

> Dernière mise à jour : 2026-06-20  
> Périmètre : où placer **roxabi-production**, **HyperFrames** et **OpenMontage** dans l'écosystème Roxabi.

---

## En bref

| Outil | Rôle | Statut recommandé |
|-------|------|-------------------|
| **roxabi-production** | Moteur React maison + kits Roxabi + VoiceCLI + `~/.roxabi/production/` | Garder — périmètre resserré |
| **HyperFrames** | Runtime HTML/GSAP pour motion-graphics (npm) | Adopter pour le **nouveau** contenu HTML |
| **OpenMontage** | Orchestration amont (research → assets → compose) | Consommer en **external** — cas lourds uniquement |
| **FFmpeg scripts** | Montage pur (concat, overlays, encode) | Quand aucun moteur de composition n'ajoute de valeur |

**Règle d'or** : un runtime par livrable, verrouillé dès le storyboard. Ne pas empiler les trois moteurs sur le même projet.

---

## Matrice de décision

| Besoin | Outil | Exemple |
|--------|-------|---------|
| Montage FFmpeg pur (recap OBS, concat, drawtext) | Script FFmpeg | `benchmark/Tetris-Test-Comparaison/video/build-montage.py` |
| Vidéo brandée Roxabi avec kits React existants | **roxabi-production** | `metalyde-launch`, `lyra-launch-trailer`, `qaya-tldr` |
| Nouvelle promo / présentation kinetic type | **HyperFrames** | `~/.roxabi/production/roxabi-presentation/` |
| Explainer avec assets IA + research web | **OpenMontage** | Pipeline `explainer` ou `animation` |
| Documentary montage stock footage | **OpenMontage** | Pipeline `documentary-montage` |
| Website → vidéo | **HyperFrames** | Skill `website-to-hyperframes` |
| Reverse-engineer le style d'une vidéo | OpenMontage **ou** `/reverse-engineer` (plugin) | Selon profondeur d'analyse souhaitée |

### Quand choisir roxabi-production

- La composition réutilise des **kits Roxabi** (`kit-lyra`, `ForgeTerminal`, brand-voice, huashu-design).
- Le pipeline agent Roxabi est requis : `/produce`, `/storyboard`, `/voice-over` via **VoiceCLI**.
- La production vit déjà dans `~/.roxabi/production/<projet>-video/` avec `roxabi.config.ts`.
- Le contrat de **déterminisme** (R1–R7, voir `CLAUDE.md`) et les gates `--strict` sont nécessaires.

### Quand choisir HyperFrames

- Motion-graphics HTML/GSAP, kinetic typography, product promos.
- Présentations longues, website-to-video, registry blocks (`hyperframes add`).
- **Nouveau contenu from scratch** qui n'a pas besoin des kits React Roxabi.

### Quand choisir OpenMontage

- Production **end-to-end** : brief → research → script → assets (TTS, images, clips IA, stock) → compose.
- Besoin de providers multiples (Veo, Kling, Piper, Archive.org, Pexels…).
- Budget governance, quality gates post-render, reference-video analysis.

### Quand choisir FFmpeg seul

- Pas de composition React/HTML — uniquement découpe, overlays texte, mix audio, double encode (HQ + compat).

---

## Architecture cible

```
Agents Roxabi (Claude / Factory)
├── roxabi-production plugin     → /produce · /compose · /render
├── HyperFrames skills           → npx hyperframes (lint · preview · render)
└── OpenMontage skills           → pipeline YAML (external_repos, read-only)

~/.roxabi/production/
├── <projet>-video/              → roxabi.config.ts  (roxabi-production)
├── <projet>-presentation/       → hyperframes.json  (HyperFrames)
└── …/out/*.mp4

Moteurs
├── roxabi-production            → React kits → Puppeteer → FFmpeg
├── HyperFrames (npm)            → HTML/GSAP → Puppeteer → FFmpeg
└── OpenMontage                  → orchestration → Remotion | HyperFrames | FFmpeg
```

Clones upstream (veille, read-only) : `~/projects/external_repos/Rproduction/OpenMontage` et `…/hyperframes`.

---

## Data dirs

| Chemin | Contenu |
|--------|---------|
| Code moteur | `~/projects/roxabi-production/` |
| Productions | `~/.roxabi/production/<projet>-video/` (override : `ROXABI_PRODUCTION_DIR`) |
| Outputs rendus | `<production>/out/*.mp4` |
| Syncthing | M₁↔M₂ — voir `~/projects/docs/data-dirs.md` |

Convention roxabi-production par projet :

```
~/.roxabi/production/<projet>-video/
├── compositions/        # *.tsx (@core, @kits, @lib, @themes)
├── content/             # vo.md, soundtrack.md
├── assets/              # narration.wav, marks/, raw audio
├── out/                 # rendus (gitignored localement)
└── roxabi.config.ts     # registre des compositions
```

Projet HyperFrames (convention parallèle) :

```
~/.roxabi/production/<projet>-presentation/
├── index.html
├── compositions/
├── hyperframes.json
├── meta.json
└── assets/
```

---

## Périmètre long terme de roxabi-production

### Garder

- Moteur React + renderer Puppeteer/FFmpeg.
- Kits Roxabi-specific et plugin Claude (`plugins/video-engine/`).
- Intégration VoiceCLI, brand-voice, huashu-design.
- Rerenders des productions existantes.
- Contrat de déterminisme + gates `--strict`.

### Ne plus investir ici

- Rivaliser avec HyperFrames sur HTML/GSAP (registry, Studio, shaders, website-to-video).
- Rivaliser avec OpenMontage sur orchestration (providers, pipelines, budget governance).
- Porter des features upstream HyperFrames — consommer via `npx hyperframes`.

### Horizon

| Fenêtre | Action |
|---------|--------|
| **0–3 mois** | Nouveau contenu motion → HyperFrames par défaut ; existant Roxabi → rerender ici |
| **3–12 mois** | Port sélectif de kits (`kit-lyra`…) en registry blocks HF si pertinent ; pilote OpenMontage (1 prod lourde) |
| **12–24 mois** | Si ≥ 80 % du nouveau contenu est HF → roxabi-production = legacy engine (rerenders + kits non portés) |

---

## Anti-patterns

| À éviter | Pourquoi |
|----------|----------|
| Abandonner roxabi-production d'un coup | 10+ productions TSX, kits Lyra, VoiceCLI intégré — coût de migration élevé |
| Internaliser OpenMontage | 400+ skills, 57+ tools Python — dette de maintenance disproportionnée |
| Forker HyperFrames | Upstream actif (HeyGen) — consommer npm, pas maintenir un fork |
| Trois runtimes sur un même projet | Confusion agent, triple coût, outputs incohérents |
| OpenMontage pour une vidéo déjà couverte par kits React | Overhead orchestration inutile |

---

## Références

| Ressource | Lien / chemin |
|-----------|---------------|
| README moteur | `README.md` |
| Contrat déterminisme | `CLAUDE.md` |
| Plugin skills | `plugins/video-engine/README.md` |
| HyperFrames (projet Roxabi) | `~/.roxabi/production/roxabi-presentation/` |
| OpenMontage upstream | `~/projects/external_repos/Rproduction/OpenMontage` |
| HyperFrames upstream | `~/projects/external_repos/Rproduction/hyperframes` |
| Data dirs meta | `~/projects/docs/data-dirs.md` |