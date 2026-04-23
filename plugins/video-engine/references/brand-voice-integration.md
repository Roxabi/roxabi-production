# Brand-Voice Integration Pattern

## Pipeline

```
/brand-voice:discover-brand → brand-voice-guidelines.md
        ↓
/video-engine:storyboard ← reads brand-voice-guidelines.md
        ↓
/video-engine:compose ← enforces brand constraints
        ↓
/video-engine:render ← uses brand assets
```

## Integration Points

### 1. Storyboard Phase
If `.claude/brand-voice-guidelines.md` exists:
- Extract color palette → storyboard color section
- Extract typography → font choices
- Extract "We Are / We Are Not" → visual constraint checklist
- Extract terminology → VO script alignment

### 2. Compose Phase
- Check brand-voice-guidelines.md for voice attributes
- Apply tone parameters to text components
- Ensure visuals match "We Are" descriptions
- Avoid "We Are Not" patterns

### 3. Voice-Over Phase
- Use brand voice attributes for narration style
- Match terminology from guidelines
- Apply tone flex by scene context

### 4. Soundtrack Phase
- Match audio mood to brand personality keywords

## Fallback
If no brand-voice-guidelines.md exists, run `/brand-voice:discover-brand` first (if brand-specific work).
