# Roxabi Trailer — Soundtrack

Duration: 110s (3300 frames @ 30fps)
Style: Manifesto. Restrained SFX (~1.8 cues/10s vs ~3.4 for product launch).
The voice carries the meaning; SFX punctuates animation beats only.

## VO chunk timing → cue map

Each VO chunk targets a specific frame in the timeline. Breath gaps between chunks
are implicit (NATS satellite returns one WAV per chunk; we adelay-stitch them).

| Chunk | Scene | Start (s) | Start (f@30) | End approx (s) | Notes |
|-------|-------|-----------|--------------|----------------|-------|
| c01 | S01a hook | 1.0  | 30   | ~3.0  | Lands as path-fragments settle |
| c02 | S01b hook | 4.0  | 120  | ~7.0  | Knowing punch on "five times" |
| c03 | S02a gap  | 11.0 | 330  | ~15.5 | Over team-of-50 cluster |
| c04 | S02b gap  | 16.0 | 480  | ~18.5 | Over scaffold rebuild |
| c05 | S02c gap  | 20.0 | 600  | ~24.0 | Lands "isn't skill / foundations" |
| c06 | S03a smith| 26.5 | 795  | ~28.5 | After LAYER 01 badge slam |
| c07 | S03b smith| 29.5 | 885  | ~33.0 | Biographical fact |
| c08 | S03c smith| 34.5 | 1035 | ~37.5 | "Same craft. New material" |
| c09 | S04a creed| 43.5 | 1305 | ~46.5 | After LAYER 02 badge |
| c10 | S04b creed| 47.5 | 1425 | ~50.5 | "doesn't change" |
| c11 | S04c creed| 51.5 | 1545 | ~53.0 | Quiet "six lines" — setup |
| c12 | S04d creed| 53.5 | 1605 | ~58.5 | First 3 principles cadence |
| c13 | S04e creed| 59.0 | 1770 | ~64.0 | Last 3 + "Yours the moment you clone" |
| c14 | S05a prim | 69.5 | 2085 | ~71.0 | "Not a framework. Primitives." |
| c15 | S05b prim | 72.0 | 2160 | ~76.0 | List as nodes appear |
| c16 | S05c prim | 76.5 | 2295 | ~79.5 | Edges form on "compound" |
| c17 | S06a guild| 83.0 | 2490 | ~84.5 | After LAYER 03 badge |
| c18 | S06b guild| 85.0 | 2550 | ~88.5 | Forks essaime |
| c19 | S06c guild| 89.5 | 2685 | ~93.5 | Compounding mirror tagline |
| c20 | S07 close | 100.5| 3015 | ~104.5| Hero — wordmark visible |

## SFX cue map

| Time (s) | Frame | File | Vol | Sync target |
|----------|-------|------|-----|-------------|
| 0.5  | 15   | glitch-digital   | 0.6  | S01 path-fragments enter (glitch chaos) |
| 3.5  | 105  | whoosh-intro     | 0.5  | S01 settle to "five times" line |
| 10.0 | 300  | whoosh-trans     | 0.7  | S01→S02 transition |
| 12.0 | 360  | data-process     | 0.5  | S02 team-of-50 cluster forms |
| 16.0 | 480  | keyboard-typing  | 0.4  | S02 scaffold rebuild (low under VO) |
| 22.0 | 660  | impact-boom      | 0.7  | "gap isn't skill" lands |
| 25.0 | 750  | whoosh-trans     | 0.7  | S02→S03 transition |
| 26.0 | 780  | impact-boom      | 0.55 | LAYER 01 badge slam |
| 42.0 | 1260 | whoosh-trans     | 0.7  | S03→S04 transition |
| 43.0 | 1290 | impact-boom      | 0.55 | LAYER 02 badge slam |
| 47.0 | 1410 | keyboard-typing  | 0.5  | Creed terminal typewrites in |
| 64.5 | 1935 | success-end      | 0.4  | "Yours the moment you clone" lands |
| 68.0 | 2040 | whoosh-trans     | 0.7  | S04→S05 transition |
| 71.0 | 2130 | data-process     | 0.45 | Primitive nodes appear |
| 76.5 | 2295 | success-end      | 0.35 | Edges compound visually |
| 82.0 | 2460 | whoosh-trans     | 0.7  | S05→S06 transition |
| 83.0 | 2490 | impact-boom      | 0.55 | LAYER 03 badge slam |
| 88.0 | 2640 | data-process     | 0.4  | Guild forks essaime |
| 92.0 | 2760 | success-end      | 0.35 | Compounding mirror lands |
| 96.0 | 2880 | whoosh-trans     | 0.7  | S06→S07 transition |
| 100.5| 3015 | impact-boom      | 0.85 | ROXABI wordmark reveal — biggest hit |

**Total: 21 cues** · density 1.9/10s. Manifesto-restrained.

## BGM

| Source | `assets/bgm/bgm-tech.mp3` |
|---|---|
| Volume | 0.30 |
| Lowpass | 4000 Hz |
| Fade in | 0.5s |
| Fade out | 2.5s (start at 107.5s) |
| Sidechain duck | -6 dB under VO (compress when VO present) |

## Mix order

```
narration.wav  (vol 1.0, no filter — the lead)
   +
sfx-track.m4a  (vol 1.0, highpass 800Hz to leave room for VO body)
   +
bgm-tech.mp3   (vol 0.30, lowpass 4000Hz, sidechaincompress against narration)
   ↓
final mix → composite onto roxabi-trailer-v0.1-noaudio.mp4
   ↓
roxabi-trailer-v0.1.mp4
```

## Quality checklist

- [ ] All 20 VO chunks generated and saved as `roxabi-vo/cNN.wav`
- [ ] narration.wav stitched at exact frame timings, total ~110s
- [ ] sfx-track.m4a built with 21 cues at exact times
- [ ] BGM ducked under VO via sidechaincompress
- [ ] No SFX clashes with VO key landings (gap=foundations / yours / compound / Roxabi reveal)
- [ ] Listen with VO muted: SFX has rhythm
- [ ] Listen with SFX muted: BGM flows under VO without competing
