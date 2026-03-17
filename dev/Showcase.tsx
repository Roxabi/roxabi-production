import React from 'react'
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from '@core'
import { COLORS, ACCENT } from '@themes'
import { fadeIn } from '@lib'

// Backgrounds
import { GradientBackground, ParticleField, GridPattern, Glow } from '@kits/kit-backgrounds'

// Text
import { Typewriter, FadeText, StaggeredWords, CountUp, GlitchText, WordByWord } from '@kits/kit-text'

// Motion
import { FadeIn, SlideIn, ScalePop, FlickerReveal, PulseGlow, NumberReveal } from '@kits/kit-motion'

// Cinema
import { FilmGrain, Vignette, LightSweep, KenBurns, FloatingOrbs } from '@kits/kit-cinema'

// DataViz
import { AnimatedBar, ProgressRing, AnimatedLine, ProgressBar, AnimatedCounter } from '@kits/kit-dataviz'

// Overlays
import { ImpactText, IconBadge } from '@kits/kit-overlays'

// Layout
import { SlideBase, Title, Body, Quote, TerminalBox, AccentBadge } from '@kits/kit-layout'

// Shapes
import { AnimatedShape } from '@kits/kit-shapes'

// Transitions
import { SceneTransition } from '@kits/kit-transitions'

// Audio
import { WaveformBars } from '@kits/kit-audio'

// 3D
import { FloatingObject } from '@kits/kit-3d'

// UI
import { LaptopFrame, PhoneFrame, NotificationToast, ChatInterface, BrandBadge, FlowDiagram } from '@kits/kit-ui'

// Social
import { LowerThird } from '@kits/kit-social'

/* ─────────────────────────────────────────
   Scene 1 — Title (0-120, 4s)
   ───────────────────────────────────────── */
const SceneTitle: React.FC = () => (
  <AbsoluteFill>
    <GradientBackground
      colors={['#0d0221', '#1a0533', '#0f084b']}
      type="radial"
      animate
    />
    <ParticleField count={50} accent="cyan" speed={0.6} direction="float" />
    <Glow accent="cyan" x="30%" y="40%" size="40vw" />
    <Glow accent="rose" x="70%" y="60%" size="35vw" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', gap: 20 }}>
      <ScalePop delay={10}>
        <Title size={80} color={COLORS.text}>Roxabi Video Engine</Title>
      </ScalePop>
      <FadeIn delay={30} direction="up">
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <AccentBadge accent="cyan">55 COMPONENTS</AccentBadge>
          <AccentBadge accent="amber">13 KITS</AccentBadge>
          <AccentBadge accent="rose">REACT + VITE</AccentBadge>
        </div>
      </FadeIn>
      <FadeIn delay={50} direction="up">
        <Typewriter
          text="A complete motion graphics toolkit"
          delay={15}
          speed={2}
          cursorColor={COLORS.cyan}
          style={{ fontSize: 24, color: COLORS.textSecondary }}
        />
      </FadeIn>
    </AbsoluteFill>
    <Vignette intensity={0.6} />
  </AbsoluteFill>
)

/* ─────────────────────────────────────────
   Scene 2 — Text Effects (120-240, 4s)
   ───────────────────────────────────────── */
const SceneText: React.FC = () => (
  <AbsoluteFill>
    <GradientBackground colors={['#0d0a07', '#1a1520', '#0d0a07']} type="linear" />
    <GridPattern variant="dots" color="rgba(255,255,255,0.05)" cellSize={30} />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 80 }}>
      {/* Top row — StaggeredWords */}
      <div style={{ position: 'absolute', top: 100, width: '100%', textAlign: 'center' }}>
        <StaggeredWords text="Staggered Word Animation" variant="fade-up" delayPerWord={4} />
      </div>

      {/* Center — Glitch effect */}
      <div style={{ display: 'flex', gap: 80, alignItems: 'center' }}>
        <GlitchText text="GLITCH" intensity={0.9} settleAt={40} color="#00ff41" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <FadeText text="Fade In" variant="fade" delay={10} style={{ fontSize: 36, color: COLORS.amber }} />
          <FadeText text="Slide Up" variant="slide-up" delay={20} style={{ fontSize: 36, color: COLORS.cyan }} />
          <FadeText text="Slide Right" variant="slide-right" delay={30} style={{ fontSize: 36, color: COLORS.rose }} />
        </div>
      </div>

      {/* Bottom — WordByWord */}
      <div style={{ position: 'absolute', bottom: 140, width: '100%', textAlign: 'center' }}>
        <WordByWord
          text="Each word appears with its own animation timing"
          delay={15}
          wordGap={3}
          highlight={['own', 'animation']}
          highlightColor={COLORS.amber}
          style={{ fontSize: 32, color: COLORS.text }}
        />
      </div>

      {/* Label */}
      <div style={{ position: 'absolute', top: 40, left: 80 }}>
        <FlickerReveal delay={5} duration={12}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 14, color: COLORS.textMuted, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            kit-text
          </span>
        </FlickerReveal>
      </div>
    </AbsoluteFill>
    <LightSweep delay={20} color="#f59e0b" width={10} />
  </AbsoluteFill>
)

/* ─────────────────────────────────────────
   Scene 3 — Data Visualization (240-360, 4s)
   ───────────────────────────────────────── */
const SceneDataViz: React.FC = () => (
  <AbsoluteFill>
    <GradientBackground colors={['#03045e', '#0077b6', '#03045e']} type="linear" />
    <ParticleField count={30} color="rgba(144,224,239,0.3)" speed={0.3} direction="drift" />
    <AbsoluteFill style={{ padding: '60px 80px', display: 'flex', flexDirection: 'row', gap: 60 }}>
      {/* Left — Bar chart */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <FadeIn delay={5}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 14, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>
            kit-dataviz
          </span>
        </FadeIn>
        <AnimatedBar
          data={[
            { label: 'React', value: 92, color: '#61dafb' },
            { label: 'TypeScript', value: 85, color: '#3178c6' },
            { label: 'Motion', value: 78, color: '#f59e0b' },
            { label: 'Vite', value: 95, color: '#646cff' },
          ]}
          maxWidth={600}
          barHeight={36}
          delayPerBar={8}
        />
      </div>

      {/* Right — Ring + Counter + Line */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 30 }}>
        <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
          <ScalePop delay={15}>
            <ProgressRing value={87} size={160} color="#22d3ee" label="Score" />
          </ScalePop>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <CountUp to={1920} prefix="" suffix="px" duration={50} style={{ fontSize: 48, color: COLORS.text }} />
            <ProgressBar accent="amber" label="Render" delay={20} width={260} />
            <ProgressBar accent="rose" label="Encode" delay={30} width={260} />
          </div>
        </div>
        <FadeIn delay={25}>
          <AnimatedLine
            data={[0.2, 0.35, 0.3, 0.55, 0.45, 0.7, 0.65, 0.85, 0.8, 0.95]}
            width={500}
            height={160}
            color="#f43f5e"
            strokeWidth={3}
          />
        </FadeIn>
      </div>
    </AbsoluteFill>
    <Vignette intensity={0.4} />
  </AbsoluteFill>
)

/* ─────────────────────────────────────────
   Scene 4 — Shapes, Motion & 3D (360-480, 4s)
   ───────────────────────────────────────── */
const SceneMotion: React.FC = () => (
  <AbsoluteFill>
    <GradientBackground colors={['#0d0a07', '#1a0a15', '#0d0a07']} type="radial" />
    <Glow accent="rose" x="50%" y="50%" size="50vw" />

    {/* Shapes scattered */}
    <div style={{ position: 'absolute', top: 100, left: 150 }}>
      <AnimatedShape type="hexagon" size={90} color="#ff006e" animation="rotate" delay={5} />
    </div>
    <div style={{ position: 'absolute', top: 80, right: 200 }}>
      <AnimatedShape type="star" size={80} color="#ffbe0b" animation="pulse" delay={10} />
    </div>
    <div style={{ position: 'absolute', bottom: 120, left: 200 }}>
      <AnimatedShape type="triangle" size={100} color="#3a86ff" animation="grow" delay={15} />
    </div>
    <div style={{ position: 'absolute', bottom: 100, right: 250 }}>
      <AnimatedShape type="circle" size={70} color="#06d6a0" animation="morph" delay={8} />
    </div>
    <div style={{ position: 'absolute', top: 350, left: 80 }}>
      <AnimatedShape type="square" size={60} color="#8338ec" animation="rotate" delay={12} />
    </div>

    {/* Center — NumberReveal */}
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <FloatingObject amplitude={10} rotateAmplitude={3} speed={0.8}>
        <PulseGlow accent="amber" speed={30}>
          <NumberReveal value="42" delay={8} color={COLORS.amber} size={140} />
        </PulseGlow>
      </FloatingObject>
    </AbsoluteFill>

    {/* Label badges */}
    <div style={{ position: 'absolute', bottom: 50, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 12 }}>
      <SlideIn delay={30} from="bottom">
        <IconBadge icon="✦" text="kit-shapes" color="#ff006e" />
      </SlideIn>
      <SlideIn delay={35} from="bottom">
        <IconBadge icon="◈" text="kit-motion" color="#3a86ff" />
      </SlideIn>
      <SlideIn delay={40} from="bottom">
        <IconBadge icon="⬡" text="kit-3d" color="#06d6a0" />
      </SlideIn>
    </div>

    <FilmGrain opacity={0.03} />
  </AbsoluteFill>
)

/* ─────────────────────────────────────────
   Scene 5 — UI Mockups (480-600, 4s)
   ───────────────────────────────────────── */
const SceneUI: React.FC = () => (
  <AbsoluteFill>
    <GradientBackground colors={['#0f0c29', '#302b63', '#24243e']} type="linear" />
    <ParticleField count={20} color="rgba(124,92,231,0.2)" speed={0.4} direction="float" />

    <AbsoluteFill style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 60, padding: 40 }}>
      {/* Laptop with flow diagram */}
      <SlideIn from="left" delay={5} distance={150}>
        <LaptopFrame width={580} angle="slight" delay={5} float={false}>
          <div style={{ background: '#1a1a2e', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FlowDiagram
              nodes={[
                { id: 'src', label: 'Source', icon: '📁', x: 10, y: 50, color: '#3a86ff' },
                { id: 'build', label: 'Build', icon: '⚙️', x: 40, y: 30, color: '#f59e0b' },
                { id: 'test', label: 'Test', icon: '✓', x: 40, y: 70, color: '#06d6a0' },
                { id: 'deploy', label: 'Deploy', icon: '🚀', x: 75, y: 50, color: '#f43f5e' },
              ]}
              edges={[
                { from: 'src', to: 'build' },
                { from: 'src', to: 'test' },
                { from: 'build', to: 'deploy' },
                { from: 'test', to: 'deploy' },
              ]}
              stagger={8}
              delay={15}
              width={540}
              height={280}
            />
          </div>
        </LaptopFrame>
      </SlideIn>

      {/* Phone with chat */}
      <SlideIn from="right" delay={10} distance={150}>
        <PhoneFrame width={320} delay={10} float>
          <ChatInterface
            appName="Lyra"
            avatarLetter="L"
            avatarColors={['#f43f5e', '#f59e0b']}
            messages={[
              { role: 'user', text: 'Generate a video showcase', delay: 15 },
              { role: 'assistant', text: 'Building 7 scenes with 55 components...', delay: 40 },
              { role: 'assistant', text: 'Rendering at 1920×1080 @ 30fps ✨', delay: 65 },
            ]}
            showTyping
            typingDelay={80}
            statusColor="#06d6a0"
          />
        </PhoneFrame>
      </SlideIn>
    </AbsoluteFill>

    {/* Notification toast */}
    <NotificationToast
      icon="🎬"
      app="Roxabi"
      message="Video render complete!"
      delay={60}
      from="right"
      style={{ position: 'absolute', top: 40, right: 40 }}
    />

    {/* Brand badges at bottom */}
    <div style={{ position: 'absolute', bottom: 40, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 16 }}>
      <BrandBadge icon="⚛" name="React" color="#61dafb" variant="glass" delay={40} size="sm" />
      <BrandBadge icon="⚡" name="Vite" color="#646cff" variant="glass" delay={45} size="sm" />
      <BrandBadge icon="🎨" name="Motion" color="#f59e0b" variant="glass" delay={50} size="sm" />
    </div>

    <Vignette intensity={0.3} />
  </AbsoluteFill>
)

/* ─────────────────────────────────────────
   Scene 6 — Cinema & Audio (600-720, 4s)
   ───────────────────────────────────────── */
const SceneCinema: React.FC = () => (
  <AbsoluteFill>
    <KenBurns zoomFrom={1.0} zoomTo={1.15} panX={30} panY={-15}>
      <GradientBackground colors={['#0a0005', '#1a0520', '#0d0221']} type="radial" />
      <FloatingOrbs count={6} color1="#7c5ce7" color2="#f43f5e" speed={0.5} maxSize={400} blur={50} />
    </KenBurns>

    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <ImpactText
        text="CINEMATIC"
        subtext="Film grain • Ken Burns • Light sweep"
        color="#f43f5e"
        delay={10}
        fontSize={110}
        perspective
      />
    </AbsoluteFill>

    {/* Waveform at bottom */}
    <div style={{ position: 'absolute', bottom: 80, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
      <FadeIn delay={25}>
        <WaveformBars bars={48} barWidth={6} maxHeight={80} gap={3} color="#22d3ee" mode="sine" />
      </FadeIn>
    </div>

    <LowerThird name="Roxabi Engine" title="Production-ready motion graphics" accentColor="#22d3ee" delay={40} />

    <LightSweep delay={15} color="#a29bfe" width={12} />
    <FilmGrain opacity={0.05} />
    <Vignette intensity={0.7} />
  </AbsoluteFill>
)

/* ─────────────────────────────────────────
   Scene 7 — Closing (720-810, 3s)
   ───────────────────────────────────────── */
const SceneClosing: React.FC = () => {
  const frame = useCurrentFrame()
  const opacity = fadeIn(frame, 20)

  return (
    <AbsoluteFill>
      <GradientBackground colors={['#0d0221', '#0f084b', '#26408b']} type="conic" animate rotationSpeed={180} />
      <FloatingOrbs count={8} color1="#f59e0b" color2="#22d3ee" speed={0.7} maxSize={350} blur={45} />
      <ParticleField count={40} accent="amber" speed={0.5} direction="float" />

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', gap: 24 }}>
        <ImpactText
          text="ROXABI"
          color={COLORS.amber}
          delay={5}
          fontSize={140}
          perspective
        />
        <FadeIn delay={25} direction="up">
          <Quote accent="amber" size={28}>
            55 components. 13 kits. Infinite possibilities.
          </Quote>
        </FadeIn>
      </AbsoluteFill>

      <Vignette intensity={0.8} />
    </AbsoluteFill>
  )
}

/* ─────────────────────────────────────────
   Main composition — 26s @ 30fps = 780 frames
   ───────────────────────────────────────── */
export const Showcase: React.FC = () => (
  <AbsoluteFill style={{ background: COLORS.bg }}>
    {/* Scene 1: Title (0–120) */}
    <Sequence from={0} durationInFrames={120}>
      <SceneTransition type="fade">
        <SceneTitle />
      </SceneTransition>
    </Sequence>

    {/* Scene 2: Text Effects (120–240) */}
    <Sequence from={120} durationInFrames={120}>
      <SceneTransition type="wipe-left">
        <SceneText />
      </SceneTransition>
    </Sequence>

    {/* Scene 3: Data Viz (240–360) */}
    <Sequence from={240} durationInFrames={120}>
      <SceneTransition type="circle-reveal">
        <SceneDataViz />
      </SceneTransition>
    </Sequence>

    {/* Scene 4: Motion & Shapes (360–480) */}
    <Sequence from={360} durationInFrames={120}>
      <SceneTransition type="zoom-in">
        <SceneMotion />
      </SceneTransition>
    </Sequence>

    {/* Scene 5: UI Mockups (480–600) */}
    <Sequence from={480} durationInFrames={120}>
      <SceneTransition type="slide-left">
        <SceneUI />
      </SceneTransition>
    </Sequence>

    {/* Scene 6: Cinema (600–720) */}
    <Sequence from={600} durationInFrames={120}>
      <SceneTransition type="wipe-up">
        <SceneCinema />
      </SceneTransition>
    </Sequence>

    {/* Scene 7: Closing (720–810) */}
    <Sequence from={720} durationInFrames={90}>
      <SceneTransition type="zoom-out">
        <SceneClosing />
      </SceneTransition>
    </Sequence>
  </AbsoluteFill>
)
