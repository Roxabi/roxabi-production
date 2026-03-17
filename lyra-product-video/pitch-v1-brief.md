# Lyra — Pitch Video v1 (Product Marketing)

## Cadrage

| | Choix |
|--|-------|
| **Audience** | Francophone large — gens débordés, pas des techs |
| **Positionnement** | "Votre IA personnelle, dans votre poche" (Apple-style) |
| **Durée** | 2-3 min (~280 mots, débit calme avec pauses) |
| **Ton** | Narratif, intime, aspirationnel. Zéro jargon technique |
| **Voix** | Sohee, Qwen-fast — posée, calme, grave, introvertie |
| **Diffusion** | Démo privée early adopters |

## VAKOG cible

**K38-V22-Ad25-A15** — Dominante kinesthésique (on touche les émotions, la frustration, le soulagement) + assez de logique pour la crédibilité.

## Techniques empruntées aux analyses vidéo

| Technique | Source | Usage |
|-----------|--------|-------|
| **Hook K** (ouverture viscérale) | EGO, Lacrimosophia | Ouvrir sur la sensation de surcharge |
| **Repetition shock** (anaphore) | Alex so yes (stat shock adapté) | "Trop de... Trop de... Trop de..." |
| **Branded concepts** | Alex so yes | "Mémoire étendue, temps libéré, intelligence amplifiée" |
| **Sandwich K→Ad→K** | EGO | Émotion → ce que Lyra fait → émotion |
| **Callback** | Lacrimosophia | "Dans votre poche" revient en close |
| **CTA intégré** | Alex so yes | Pas de "abonnez-vous", juste la marque qui reste |

## Structure narrative

```
1. LE POIDS       (0:00-0:30) — Hook kinesthésique, frustration universelle
2. LE MENSONGE    (0:30-0:50) — Les fausses solutions (apps, notifications)
3. LE BASCULEMENT (0:50-1:05) — "Et si..."
4. LYRA           (1:05-1:50) — Présentation simple, bénéfices concrets
5. LA VISION      (1:50-2:15) — "Imaginez" — la vie avec Lyra
6. LA PROMESSE    (2:15-2:35) — Triptyque de marque
7. CLOSE          (2:35-2:45) — Signature
```

## Config TTS

| Param | Valeur |
|-------|--------|
| Engine | qwen-fast |
| Voice | Sohee |
| Accent | Voix française naturelle, légèrement grave |
| Personality | Posée, calme, introvertie, réfléchie, profonde |
| Speed | Débit lent et mesuré, silences entre les phrases |
| Emotion | Calme et empathique, douce intensité |
| Segment gap | 600ms |
| Crossfade | 80ms |

## Fichiers

| Fichier | Contenu |
|---------|---------|
| `pitch-v1.md` | Script TTS avec frontmatter + emotion markers |
| `pitch-v1-brief.md` | Ce document (cadrage + structure) |
| `pitch-v1.wav` / `.mp3` | Audio généré |
