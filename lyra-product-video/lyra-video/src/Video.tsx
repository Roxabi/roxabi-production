import React from 'react'
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion'
import { SECTIONS, COLORS } from './theme'

import { TitleSection } from './sections/TitleSection'
import { WrongBetSection } from './sections/WrongBetSection'
import { PivotSection } from './sections/PivotSection'
import { KillDarlingsSection } from './sections/KillDarlingsSection'
import { FoundationSection } from './sections/FoundationSection'
import { RadarSection } from './sections/RadarSection'
import { TelegramSection } from './sections/TelegramSection'
import { IndustrialSection } from './sections/IndustrialSection'
import { PatchNotesSection } from './sections/PatchNotesSection'
import { TheDaySection } from './sections/TheDaySection'
import { VoiceSection } from './sections/VoiceSection'
import { TheNightSection } from './sections/TheNightSection'
import { IdentitySection } from './sections/IdentitySection'
import { EcosystemSection } from './sections/EcosystemSection'
import { NumbersSection } from './sections/NumbersSection'
import { FourDaysSection } from './sections/FourDaysSection'
import { LessonSection } from './sections/LessonSection'
import { ClosingSection } from './sections/ClosingSection'

const SECTION_COMPONENTS = [
  TitleSection,
  WrongBetSection,
  PivotSection,
  KillDarlingsSection,
  FoundationSection,
  RadarSection,
  TelegramSection,
  IndustrialSection,
  PatchNotesSection,
  TheDaySection,
  VoiceSection,
  TheNightSection,
  IdentitySection,
  EcosystemSection,
  NumbersSection,
  FourDaysSection,
  LessonSection,
  ClosingSection,
]

const FPS = 30

export const LyraBirth: React.FC = () => {
  let frameOffset = 0

  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      <Audio src={staticFile('narration.mp3')} />

      {SECTIONS.map((section, i) => {
        const durationFrames = section.dur * FPS
        const Component = SECTION_COMPONENTS[i]
        const from = frameOffset
        frameOffset += durationFrames

        return (
          <Sequence key={section.id} from={from} durationInFrames={durationFrames}>
            <Component />
          </Sequence>
        )
      })}
    </AbsoluteFill>
  )
}
