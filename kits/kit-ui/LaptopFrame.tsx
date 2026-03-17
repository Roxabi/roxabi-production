import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "../../core";

export interface LaptopFrameProps {
  children: React.ReactNode;
  /** Screen width in px */
  width?: number;
  /** 3D perspective angle */
  angle?: "flat" | "slight" | "angled";
  delay?: number;
  /** Float gently */
  float?: boolean;
  /** Bezel color */
  bezelColor?: string;
  style?: React.CSSProperties;
}

export const LaptopFrame: React.FC<LaptopFrameProps> = ({
  children,
  width = 700,
  angle = "slight",
  delay = 0,
  float = true,
  bezelColor = "#1a1a1a",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrance = spring({ frame, fps, delay, config: { damping: 14, stiffness: 50 } });
  const floatY = float ? Math.sin(frame * 0.02) * 4 : 0;

  const angleMap = {
    flat: "rotateX(0deg) rotateY(0deg)",
    slight: "rotateX(2deg) rotateY(-3deg)",
    angled: "rotateX(8deg) rotateY(-12deg)",
  };

  const screenHeight = width * 0.625; // 16:10 ratio
  const bezelW = 12;
  const bezelBottom = 24;

  return (
    <div
      style={{
        perspective: 1200,
        display: "inline-block",
        ...style,
      }}
    >
      <div
        style={{
          transform: `${angleMap[angle]} translateY(${floatY}px) scale(${interpolate(entrance, [0, 1], [0.85, 1])})`,
          opacity: entrance,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Screen bezel */}
        <div
          style={{
            width: width + bezelW * 2,
            padding: `${bezelW}px ${bezelW}px ${bezelBottom}px`,
            backgroundColor: bezelColor,
            borderRadius: 12,
            boxShadow: "0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05) inset",
          }}
        >
          {/* Camera dot */}
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: "#333",
              margin: "0 auto 6px",
            }}
          />

          {/* Screen content */}
          <div
            style={{
              width,
              height: screenHeight,
              backgroundColor: "#0d1117",
              borderRadius: 4,
              overflow: "hidden",
              position: "relative",
            }}
          >
            {children}
          </div>
        </div>

        {/* Keyboard base */}
        <div
          style={{
            width: width + bezelW * 2 + 40,
            height: 10,
            backgroundColor: bezelColor,
            borderRadius: "0 0 4px 4px",
            margin: "0 auto",
            marginTop: -1,
            background: `linear-gradient(to bottom, ${bezelColor}, #111)`,
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        />

        {/* Hinge shadow */}
        <div
          style={{
            width: width + bezelW * 2 + 60,
            height: 4,
            margin: "0 auto",
            borderRadius: "0 0 8px 8px",
            background: "rgba(0,0,0,0.15)",
            filter: "blur(2px)",
          }}
        />
      </div>
    </div>
  );
};
