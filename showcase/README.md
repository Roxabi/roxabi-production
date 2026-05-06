# Showcase — Engine Demo

A 56-second composition that exercises the full kit library. Ships with the
engine as a runnable example of the composition format.

## Render

Start the dev server in one terminal:

```bash
bun run dev
```

Render in another:

```bash
bun run render showcase
```

Default output: `showcase/out/showcase.mp4` (gitignored).

Render with custom output path or quality:

```bash
bun run render showcase out/showcase-hq.mp4 --quality=high
```

Run pre-render gates (determinism, contrast, overflow):

```bash
bun run render showcase --strict
```

## Layout

```
showcase/
├── ShowcaseVideo.tsx      # composition (uses ../core, ../kits — engine-local imports)
├── roxabi.config.ts       # registers the composition with the engine
├── vo.md                  # narration script
├── soundtrack.md          # music + SFX cue notes
└── out/                   # rendered mp4 (gitignored)
```

## User productions

For your own video productions, follow the convention at
`~/.roxabi/production/<projet>-video/` — see `~/.roxabi/production/qaya-tldr/`
for a reference layout.
