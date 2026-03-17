# Lyra — Pitch Video Production Recap

## Objectif

Créer une narration vocale de 2-3 minutes pour présenter Lyra en mode product marketing / PMF. Cible : audience francophone large (pas tech). Style : Apple/Spotify — faire rêver, rendre Lyra indispensable.

## Cadrage

| | Décision |
|--|----------|
| **Audience** | Francophone large — gens débordés au quotidien, pas des développeurs |
| **Positionnement** | "Ton IA personnelle, dans ta poche" |
| **Durée** | 2 min, pitch simple et efficace |
| **Ton** | Narratif, positif, concret. Tutoiement. Zéro jargon technique |
| **Voix** | Sohee, Qwen-fast |
| **Diffusion** | Démo privée early adopters |
| **Pattern** | Douleur → solution, douleur → solution (en boucle) |

## Ressources utilisées

| Ressource | Usage |
|-----------|-------|
| 4 analyses vidéo (vault `~/.roxabi-vault/content-lab/analyses/`) | Techniques narratives : hook K, stat shock, branded concepts, sandwich K→Ad→K |
| Narration v1 existante (`narration.md`) | Inspiration pour le ton — mais angle trop technique/builder, pas réutilisé directement |
| voicecli | Génération TTS (engine qwen-fast, voix Sohee) |

## VAKOG cible

**K38-V22-Ad25-A15** — Dominante kinesthésique (frustration, soulagement) + logique pour crédibilité.

## Techniques narratives

| Technique | Source (analyse vidéo) | Application |
|-----------|----------------------|-------------|
| Hook K (ouverture viscérale) | EGO, Lacrimosophia | Ouvrir sur une situation quotidienne frustrante |
| Repetition shock (anaphore) | Alex so yes | "Avec Lyra..." en refrain |
| Branded concepts | Alex so yes | "Mémoire étendue, temps libéré, intelligence amplifiée" |
| Sandwich K→Ad→K | EGO | Émotion → ce que Lyra fait → émotion |
| Callback | Lacrimosophia | "Dans ta poche" en close |

## Itérations

| Version | Changement | Durée | Résultat |
|---------|-----------|-------|----------|
| **v1** | Narrative profonde, vouvoiement, douleur longue → solution longue | 2:12 | Trop triste, trop intense |
| **v2** | Punchy marketing, douleur/solution en boucle | 1:37 | Trop saccadé, robotique (phrases trop courtes) |
| **v3** | Phrases plus longues, fluides, transitions naturelles | 2:05 | Bon jusqu'à 0:58, puis changement de voix |
| **v4** | Émotions lissées entre segments (même registre "complice") | 2:21 | Mieux mais toujours une rupture au point de coupure |
| **v5** | Suppression de toutes les directives `<!-- emotion -->`, frontmatter seul | 2:08 | Plus cohérent, mais encore 2 segments |
| **v6** | Tutoiement au lieu du vouvoiement | 2:10 | Bon, plus proche de la cible |
| **v7** | `--chunk-size 5000` pour forcer un seul segment TTS | 2:26 | Voix 100% cohérente, un seul appel TTS |
| **v8** | Suppression personality/speed/emotion du frontmatter, accent seul | 1:50 | Bonne dynamique, voix naturelle |
| **v9** | Texte joyeux, exemples poussés (idée → proposition le matin), accent "joyeuse" | 2:14 | Moins bonne dynamique que v8, accent trop différent |
| **v10** | Accent v8 ("grave et enveloppante"), zéro négatif dans le texte, "vingt-trois heures" en lettres | 1:52 | **Version actuelle** |

## Apprentissages voicecli

| Découverte | Impact |
|-----------|--------|
| Les directives `<!-- emotion -->` créent des segments séparés, chacun = un appel TTS indépendant | Changement de voix entre segments |
| Sans directives, `smart_chunk()` coupe à ~500 chars par défaut | Toujours 2 segments pour un texte de ~1100 chars |
| `--chunk-size 5000` force tout le texte en un seul appel TTS | Voix 100% cohérente |
| Moins de directives frontmatter = voix plus naturelle | personality/speed/emotion en trop rendent le résultat artificiel |
| Les phrases courtes ("Cinq minutes. Dix onglets.") sonnent robotiques en TTS | Préférer des phrases longues et fluides |

## Règles de copywriting retenues

1. **Jamais de négatif** — ne jamais dire ce que Lyra ne fait pas, uniquement ce qu'elle fait bien
2. **Tutoiement** — plus proche, plus complice
3. **Douleur → solution** en boucle, pas un bloc douleur puis un bloc solution
4. **Exemples concrets poussés** — pas "elle se souvient" mais "elle t'a préparé une proposition pendant la nuit"
5. **Pas creepy** — focus sur ce qu'elle FAIT, pas sur ce qu'elle SAIT de toi
6. **Zéro jargon** — pas de "hub", "5-level memory", "asyncio"
7. **Écrire les nombres en lettres** — "vingt-trois heures" pas "23h" (pour le TTS)

## Fichiers

```
lyra-product-video/
├── RECAP.md                  ← ce document
├── pitch-v1.md / v1-full.mp3   narrative profonde (vouvoiement)
├── pitch-v2.md / v2-full.mp3   punchy saccadé
├── pitch-v3.md / v3-full.mp3   fluide (rupture de voix)
├── pitch-v4.md / v4-full.mp3   émotions lissées
├── pitch-v5.md / v5-full.mp3   frontmatter seul
├── pitch-v6.md / v6-full.mp3   tutoiement
├── pitch-v7-full.mp3            single chunk (v6 texte)
├── pitch-v8.md / v8-full.mp3   accent seul, bonne dynamique
├── pitch-v9.md / v9-full.mp3   joyeux (trop différent)
├── pitch-v10.md / v10-full.mp3  version actuelle
└── pitch-v1-brief.md            cadrage initial
```

## Pour reprendre

1. Partir de `pitch-v10.md` comme base
2. Garder le frontmatter minimal (accent seul, pas de personality/speed/emotion)
3. Toujours générer avec `--chunk-size 5000` pour un seul segment
4. Appliquer les règles de copywriting ci-dessus
5. Commande de génération :
   ```bash
   voicecli generate pitch-vXX.md --mp3 --chunk-size 5000 -o pitch-vXX.wav
   ```
