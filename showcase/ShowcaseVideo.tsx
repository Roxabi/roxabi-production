import React from 'react'
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from '../core'

// Backgrounds
import { GradientBackground } from '../kits/kit-backgrounds/GradientBackground'
import { ParticleField } from '../kits/kit-backgrounds/ParticleField'
import { GridPattern } from '../kits/kit-backgrounds/GridPattern'
import { BokehBackground } from '../kits/kit-backgrounds/BokehBackground'

// Cinema
import { ChromaticAberration } from '../kits/kit-cinema/ChromaticAberration'
import { FilmGrain } from '../kits/kit-cinema/FilmGrain'
import { FloatingOrbs } from '../kits/kit-cinema/FloatingOrbs'
import { FogLayer } from '../kits/kit-cinema/FogLayer'
import { LightSweep } from '../kits/kit-cinema/LightSweep'
import { TunnelEffect } from '../kits/kit-cinema/TunnelEffect'
import { Vignette } from '../kits/kit-cinema/Vignette'

// Text
import { GlitchText } from '../kits/kit-text/GlitchText'
import { Typewriter } from '../kits/kit-text/Typewriter'
import { StaggeredWords } from '../kits/kit-text/StaggeredWords'

// Layout
import { TextCard } from '../kits/kit-layout/TextCard'
import { TerminalBox } from '../kits/kit-layout/TerminalBox'
import { Chrome } from '../kits/kit-layout/Chrome'
import { AccentBadge } from '../kits/kit-layout/AccentBadge'

// Motion
import { FadeIn } from '../kits/kit-motion/FadeIn'
import { ScalePop } from '../kits/kit-motion/ScalePop'
import { PulseGlow } from '../kits/kit-motion/PulseGlow'

// UI
import { ChatInterface } from '../kits/kit-ui/ChatInterface'
import { GitHubCard } from '../kits/kit-ui/GitHubCard'
import { PhoneFrame } from '../kits/kit-ui/PhoneFrame'
import { BrandBadge } from '../kits/kit-ui/BrandBadge'

// DataViz
import { AnimatedBar } from '../kits/kit-dataviz/AnimatedBar'
import { AnimatedCounter } from '../kits/kit-dataviz/AnimatedCounter'
import { NeuralNetworkGraph } from '../kits/kit-dataviz/NeuralNetworkGraph'
import { ProgressRing } from '../kits/kit-dataviz/ProgressRing'

// Overlays & Social
import { ImpactText } from '../kits/kit-overlays/ImpactText'
import { LowerThird } from '../kits/kit-social/LowerThird'

// Shapes & 3D
import { AnimatedShape } from '../kits/kit-shapes/AnimatedShape'
import { FloatingObject } from '../kits/kit-3d/FloatingObject'

// Transitions
import { SceneTransition } from '../kits/kit-transitions/SceneTransition'

// ─── Shared helpers ───────────────────────────────────────────────────────────

const KitLabel: React.FC<{ label: string; sub?: string }> = ({ label, sub }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = spring({ frame, fps, config: { damping: 18, stiffness: 80 } })

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 56,
        right: 80,
        textAlign: 'right',
        opacity: s,
        transform: `translateY(${interpolate(s, [0, 1], [20, 0])}px)`,
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      <div
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 13,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: '#f59e0b',
          opacity: 0.75,
        }}
      >
        {label}
      </div>
      {sub && (
        <div
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 11,
            color: '#5a5550',
            marginTop: 4,
          }}
        >
          {sub}
        </div>
      )}
    </div>
  )
}

// ─── Scene 1: OPENING ────────────────────────────────────────────────────────

const SceneOpening: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const badgeS = spring({ frame, fps, delay: 60, config: { damping: 12, stiffness: 100 } })

  return (
    <AbsoluteFill style={{ background: '#050308', overflow: 'hidden' }}>
      <GradientBackground colors={['#0d0a14', '#1a0a2e', '#050308']} type="radial" animate={false} />
      <FloatingOrbs count={4} color1="#f59e0b" color2="#d97706" maxSize={700} blur={90} speed={0.4} />
      <FilmGrain opacity={0.03} />
      <Chrome phase="roxabi-production" day="v1.0" accent="amber" />

      <AbsoluteFill
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32 }}
      >
        <ChromaticAberration intensity={8} animated>
          <div style={{ textAlign: 'center' }}>
            <GlitchText
              text="ROXABI"
              intensity={0.92}
              settleAt={40}
              color="#e8e4df"
              style={{ fontSize: 128, fontWeight: 900, letterSpacing: '0.1em', display: 'block' }}
            />
          </div>
        </ChromaticAberration>

        <FadeIn delay={20} direction="up">
          <div
            style={{
              fontFamily: 'IBM Plex Sans, sans-serif',
              fontSize: 26,
              color: '#9a9590',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
            }}
          >
            Production Studio
          </div>
        </FadeIn>

        <div
          style={{
            opacity: badgeS,
            transform: `scale(${interpolate(badgeS, [0, 1], [0.7, 1])})`,
          }}
        >
          <AccentBadge accent="amber">65 Components · 12 Kits · Custom Video Engine</AccentBadge>
        </div>
      </AbsoluteFill>

      <Vignette intensity={0.6} />
    </AbsoluteFill>
  )
}

// ─── Scene 2: KIT-TEXT ───────────────────────────────────────────────────────

const SceneText: React.FC = () => (
  <AbsoluteFill style={{ background: '#080a0d', overflow: 'hidden' }}>
    <GridPattern cellSize={48} color="rgba(34,211,238,0.05)" animate />
    <FilmGrain opacity={0.02} />

    <AbsoluteFill
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 44 }}
    >
      <ScalePop delay={0}>
        <GlitchText
          text="TYPOGRAPHY"
          intensity={0.65}
          settleAt={22}
          color="#22d3ee"
          style={{ fontSize: 88, fontWeight: 900, letterSpacing: '0.12em', display: 'block' }}
        />
      </ScalePop>

      <StaggeredWords
        text="Every word. Animated. Precisely."
        delayPerWord={8}
        startAt={18}
        variant="fade-up"
        style={{
          fontSize: 34,
          color: '#e8e4df',
          fontFamily: 'Cormorant, serif',
          textAlign: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      />

      <FadeIn delay={55} direction="up">
        <TerminalBox accent="cyan">
          <Typewriter
            text="$ bun render --composition showcase --fps 30 --codec h264"
            delay={60}
            speed={2}
            style={{ color: '#e8e4df', fontSize: 15 }}
          />
        </TerminalBox>
      </FadeIn>
    </AbsoluteFill>

    <KitLabel label="kit-text" sub="7 components — GlitchText · Typewriter · StaggeredWords · WordByWord · FadeText · StaggerLines · CountUp" />
    <Vignette />
  </AbsoluteFill>
)

// ─── Scene 3: KIT-CINEMA + KIT-BACKGROUNDS ───────────────────────────────────

const SceneCinema: React.FC = () => (
  <AbsoluteFill style={{ background: '#050308', overflow: 'hidden' }}>
    <BokehBackground
      count={12}
      colors={['#f59e0b44', '#d9770633', '#fbbf2444']}
      minSize={80}
      maxSize={350}
    />
    <FloatingOrbs count={4} color1="#f59e0b" color2="#d97706" maxSize={500} blur={70} speed={0.3} />
    <FogLayer position="bottom" color="rgba(245,158,11" intensity={0.3} animated />
    <LightSweep delay={20} color="rgba(245,158,11,0.12)" width={20} />
    <FilmGrain opacity={0.04} />

    <AbsoluteFill
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32 }}
    >
      <FadeIn delay={0} direction="up">
        <h2
          style={{
            fontFamily: 'Cormorant, serif',
            fontSize: 76,
            fontWeight: 600,
            color: '#e8e4df',
            margin: 0,
            textAlign: 'center',
            lineHeight: 1.15,
          }}
        >
          Atmosphere.
          <br />
          <span style={{ color: '#f59e0b' }}>Built in.</span>
        </h2>
      </FadeIn>

      <FadeIn delay={25} direction="up">
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 900 }}>
          {[
            'BokehBackground', 'GradientBackground', 'GridPattern', 'ParticleField',
            'FogLayer', 'FloatingOrbs', 'LightSweep', 'FilmGrain',
            'ChromaticAberration', 'GlitchOverlay', 'KenBurns', 'TunnelEffect', 'Vignette',
          ].map((name, i) => (
            <ScalePop key={name} delay={35 + i * 6}>
              <AccentBadge accent="amber">{name}</AccentBadge>
            </ScalePop>
          ))}
        </div>
      </FadeIn>
    </AbsoluteFill>

    <KitLabel label="kit-cinema · kit-backgrounds" sub="15 components" />
    <Vignette />
  </AbsoluteFill>
)

// ─── Scene 4: KIT-UI ─────────────────────────────────────────────────────────

const SceneUI: React.FC = () => (
  <AbsoluteFill style={{ background: '#0d1117', overflow: 'hidden' }}>
    <GradientBackground colors={['#0d1117', '#161b22', '#0d1117']} type="radial" animate={false} />
    <FilmGrain opacity={0.02} />

    <AbsoluteFill
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 56 }}
    >
      {/* Phone with live chat */}
      <PhoneFrame width={350} delay={0} float>
        <ChatInterface
          appName="Lyra"
          avatarColors={['#f59e0b', '#00cec9']}
          avatarLetter="L"
          statusText="En ligne"
          messages={[
            { role: 'user', text: 'Build me a product video.', delay: 20 },
            { role: 'assistant', text: 'On it — 65 components, ready to render.', delay: 55 },
            { role: 'user', text: 'Ship it.', delay: 90 },
          ]}
          showTyping
          typingDelay={120}
        />
      </PhoneFrame>

      {/* Right column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <ScalePop delay={18}>
          <GitHubCard
            owner="roxabi"
            repo="production"
            description="Custom React video engine — 65 animated components across 12 kits"
            language="TypeScript"
            languageColor="#3178c6"
            stars={2048}
            forks={134}
            activity={[20, 45, 30, 80, 60, 90, 75, 100, 85, 40, 70, 95]}
          />
        </ScalePop>

        <FadeIn delay={45} direction="up">
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <PulseGlow accent="cyan">
              <BrandBadge name="Roxabi" color="#22d3ee" variant="glass" size="md" delay={0} />
            </PulseGlow>
            <BrandBadge name="Production" color="#f59e0b" variant="outline" size="md" delay={20} />
            <BrandBadge name="Lyra AI" color="#f59e0b" variant="solid" size="md" delay={35} />
          </div>
        </FadeIn>
      </div>
    </AbsoluteFill>

    <KitLabel label="kit-ui" sub="10 components — ChatInterface · GitHubCard · PhoneFrame · LaptopFrame · BrowserTabs · EmailInbox · FlowDiagram · BrandBadge · NotificationToast · Timer" />
    <Vignette />
  </AbsoluteFill>
)

// ─── Scene 5: KIT-DATAVIZ ────────────────────────────────────────────────────

const SceneDataViz: React.FC = () => (
  <AbsoluteFill style={{ background: '#050610', overflow: 'hidden' }}>
    {/* Neural net as atmospheric background */}
    <AbsoluteFill style={{ opacity: 0.22 }}>
      <NeuralNetworkGraph
        layout="layered"
        layers={[4, 7, 7, 4]}
        color="#22d3ee"
        width={1920}
        height={1080}
        nodeRadius={7}
        pulseDuration={32}
      />
    </AbsoluteFill>
    <FilmGrain opacity={0.025} />

    <AbsoluteFill
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 100 }}
    >
      {/* Big stats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
        {[
          { value: 1946, label: 'frames analyzed', color: '#22d3ee', delay: 0 },
          { value: 12,   label: 'videos studied',  color: '#f59e0b', delay: 20 },
          { value: 65,   label: 'components built', color: '#d97706', delay: 40 },
        ].map(({ value, label, color, delay }) => (
          <FadeIn key={label} delay={delay} direction="left">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <AnimatedCounter value={value} duration={55} color={color} size={76} />
              <span
                style={{ color: '#5a5550', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 15 }}
              >
                {label}
              </span>
            </div>
          </FadeIn>
        ))}
      </div>

      {/* Rings + bar chart */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 36, alignItems: 'center' }}>
        <FadeIn delay={28} direction="right">
          <div style={{ display: 'flex', gap: 28 }}>
            <ProgressRing value={87} size={140} color="#22d3ee" label="Coverage" />
            <ProgressRing value={94} size={140} color="#f59e0b" label="Quality" />
            <ProgressRing value={100} size={140} color="#d97706" label="Shipped" />
          </div>
        </FadeIn>

        <FadeIn delay={60} direction="right">
          <AnimatedBar
            data={[
              { label: 'Glow',     value: 4385, color: '#22d3ee' },
              { label: 'Chroma',   value: 2083, color: '#d97706' },
              { label: 'TextCard', value: 1148, color: '#f59e0b' },
              { label: 'FogLayer', value: 1681, color: '#f97316' },
            ]}
            maxWidth={420}
            barHeight={30}
            showValues
          />
        </FadeIn>
      </div>
    </AbsoluteFill>

    <KitLabel label="kit-dataviz" sub="6 components — AnimatedBar · AnimatedLine · AnimatedCounter · NeuralNetworkGraph · ProgressBar · ProgressRing" />
    <Vignette />
  </AbsoluteFill>
)

// ─── Scene 6: KIT-MOTION ─────────────────────────────────────────────────────

const SceneMotion: React.FC = () => (
  <AbsoluteFill style={{ background: '#080508', overflow: 'hidden' }}>
    <ParticleField count={90} color="#f59e0b" speed={0.7} direction="float" maxSize={5} />
    <FilmGrain opacity={0.025} />

    <AbsoluteFill
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 52 }}
    >
      <FadeIn delay={0} direction="up">
        <h2
          style={{
            fontFamily: 'Cormorant, serif',
            fontSize: 80,
            fontWeight: 600,
            color: '#e8e4df',
            margin: 0,
            textAlign: 'center',
          }}
        >
          Motion. <span style={{ color: '#f59e0b' }}>Refined.</span>
        </h2>
      </FadeIn>

      {/* Animated shapes showcase */}
      <div style={{ display: 'flex', gap: 52, alignItems: 'center' }}>
        {(
          [
            { shape: 'circle',  color: '#f59e0b', accent: 'amber', anim: 'pulse' },
            { shape: 'hexagon', color: '#22d3ee', accent: 'cyan',  anim: 'rotate' },
            { shape: 'star',    color: '#fbbf24', accent: 'amber',  anim: 'morph' },
            { shape: 'triangle',color: '#f97316', accent: 'orange',anim: 'grow' },
            { shape: 'square',  color: '#fbbf24', accent: 'amber', anim: 'rotate' },
          ] as const
        ).map(({ shape, color, accent, anim }, i) => (
          <ScalePop key={shape} delay={15 + i * 14}>
            <PulseGlow accent={accent as any} speed={30 + i * 8}>
              <AnimatedShape type={shape} size={88} color={color} animation={anim as any} />
            </PulseGlow>
          </ScalePop>
        ))}
      </div>

      {/* Motion kit badge row */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
        {['FadeIn', 'SlideIn', 'ScalePop', 'FlickerReveal', 'CameraShake', 'PulseGlow', 'NumberReveal'].map(
          (name, i) => (
            <FadeIn key={name} delay={70 + i * 10} direction="up">
              <AccentBadge accent="cyan">{name}</AccentBadge>
            </FadeIn>
          ),
        )}
      </div>
    </AbsoluteFill>

    <KitLabel label="kit-motion · kit-shapes · kit-3d" sub="10 components" />
    <Vignette />
  </AbsoluteFill>
)

// ─── Scene 7: KIT-LAYOUT + OVERLAYS ──────────────────────────────────────────

const SceneLayout: React.FC = () => (
  <AbsoluteFill style={{ overflow: 'hidden' }}>
    <TextCard
      title="Layouts that speak."
      subtitle="Compose any scene from atomic building blocks."
      body="TextCard · SlideBase · Quote · Title · Body · AccentBadge · Chrome · TerminalBox · ImpactText · IconBadge · LowerThird · SyncedCaptions · FloatingCards · CaptionOverlay · SocialCard"
      align="center"
      accent="#f59e0b"
    />

    <LowerThird
      name="Mickael Schoentgen"
      title="Roxabi · Director of Production"
      accentColor="#f59e0b"
      delay={30}
    />

    <KitLabel label="kit-layout · kit-overlays · kit-social" sub="15 components" />
  </AbsoluteFill>
)

// ─── Scene 8: THE ENGINE ─────────────────────────────────────────────────────

const SceneEngine: React.FC = () => (
  <AbsoluteFill style={{ background: '#000', overflow: 'hidden' }}>
    <TunnelEffect ringCount={16} color="#f59e0b" background="#000" speed={0.013} shape="elliptical" />
    <FilmGrain opacity={0.04} />

    <AbsoluteFill
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 48 }}
    >
      <FadeIn delay={0} direction="up">
        <ImpactText
          text="THE ENGINE"
          subtext="React → Puppeteer → FFmpeg → MP4"
          color="#f59e0b"
          fontSize={100}
          perspective
          delay={0}
        />
      </FadeIn>

      <FadeIn delay={35} direction="up">
        <TerminalBox accent="amber">
          <div style={{ color: '#5a5550', fontSize: 13, marginBottom: 4 }}>
            # render a composition to MP4
          </div>
          <div>
            <span style={{ color: '#f59e0b' }}>$ </span>
            <Typewriter
              text="bun render --composition showcase --fps 30 --codec h264"
              delay={50}
              speed={1.8}
              style={{ color: '#e8e4df', fontSize: 15 }}
            />
          </div>
        </TerminalBox>
      </FadeIn>
    </AbsoluteFill>

    {/* Floating hex in the corner */}
    <div style={{ position: 'absolute', right: 180, top: '50%', transform: 'translateY(-50%)' }}>
      <FloatingObject amplitude={22} speed={0.8} delay={10}>
        <PulseGlow accent="amber" speed={45}>
          <AnimatedShape type="hexagon" size={150} color="#f59e0b" animation="rotate" />
        </PulseGlow>
      </FloatingObject>
    </div>

    <Chrome phase="pipeline" day="React → Puppeteer → FFmpeg" accent="amber" />
    <Vignette />
  </AbsoluteFill>
)

// ─── Scene 9: CLOSING ────────────────────────────────────────────────────────

const SceneClosing: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const kitsSpring = spring({ frame, fps, delay: 80, config: { damping: 14, stiffness: 80 } })

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <ChromaticAberration intensity={4} animated>
        <GradientBackground colors={['#1a0a2e', '#0d0a14', '#050308']} type="conic" animate />
      </ChromaticAberration>

      <FloatingOrbs count={6} color1="#f59e0b" color2="#d97706" maxSize={550} blur={85} speed={0.25} />
      <FilmGrain opacity={0.03} />

      <AbsoluteFill
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 36 }}
      >
        <ImpactText text="BUILD ANYTHING." color="#f59e0b" fontSize={104} perspective delay={0} />

        <FadeIn delay={30} direction="up">
          <p
            style={{
              fontFamily: 'IBM Plex Sans, sans-serif',
              fontSize: 22,
              color: '#9a9590',
              textAlign: 'center',
              maxWidth: 680,
              margin: 0,
              lineHeight: 1.65,
            }}
          >
            65 animated components. 12 kits. One custom video engine.
            <br />
            Built for the Roxabi ecosystem.
          </p>
        </FadeIn>

        <div
          style={{
            opacity: kitsSpring,
            transform: `translateY(${interpolate(kitsSpring, [0, 1], [24, 0])}px)`,
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
            justifyContent: 'center',
            maxWidth: 900,
          }}
        >
          {[
            'kit-backgrounds', 'kit-cinema', 'kit-text', 'kit-layout',
            'kit-motion', 'kit-ui', 'kit-dataviz', 'kit-overlays',
            'kit-social', 'kit-shapes', 'kit-3d', 'kit-transitions',
          ].map((kit) => (
            <AccentBadge key={kit} accent="amber">
              {kit}
            </AccentBadge>
          ))}
        </div>
      </AbsoluteFill>

      <Chrome phase="roxabi-production" day="v1.0 · 2026" accent="amber" />
      <Vignette intensity={0.65} />
    </AbsoluteFill>
  )
}

// ─── Root composition ─────────────────────────────────────────────────────────

const OPEN  = 210  // 7s
const SCENE = 180  // 6s each
const CLOSE = 210  // 7s
// Total: 210 + 7×180 + 210 = 1680 frames = 56s @ 30fps

export const ShowcaseVideo: React.FC = () => (
  <AbsoluteFill style={{ background: '#050308' }}>
    <Sequence from={0}                           durationInFrames={OPEN}>
      <SceneTransition type="fade"         duration={20}><SceneOpening /></SceneTransition>
    </Sequence>

    <Sequence from={OPEN}                        durationInFrames={SCENE}>
      <SceneTransition type="wipe-left"    duration={20}><SceneText /></SceneTransition>
    </Sequence>

    <Sequence from={OPEN + SCENE}                durationInFrames={SCENE}>
      <SceneTransition type="zoom-in"      duration={20}><SceneCinema /></SceneTransition>
    </Sequence>

    <Sequence from={OPEN + SCENE * 2}            durationInFrames={SCENE}>
      <SceneTransition type="slide-left"   duration={20}><SceneUI /></SceneTransition>
    </Sequence>

    <Sequence from={OPEN + SCENE * 3}            durationInFrames={SCENE}>
      <SceneTransition type="wipe-right"   duration={20}><SceneDataViz /></SceneTransition>
    </Sequence>

    <Sequence from={OPEN + SCENE * 4}            durationInFrames={SCENE}>
      <SceneTransition type="circle-reveal" duration={20}><SceneMotion /></SceneTransition>
    </Sequence>

    <Sequence from={OPEN + SCENE * 5}            durationInFrames={SCENE}>
      <SceneTransition type="wipe-up"      duration={20}><SceneLayout /></SceneTransition>
    </Sequence>

    <Sequence from={OPEN + SCENE * 6}            durationInFrames={SCENE}>
      <SceneTransition type="zoom-out"     duration={20}><SceneEngine /></SceneTransition>
    </Sequence>

    <Sequence from={OPEN + SCENE * 7}            durationInFrames={CLOSE}>
      <SceneTransition type="fade"         duration={20}><SceneClosing /></SceneTransition>
    </Sequence>
  </AbsoluteFill>
)
