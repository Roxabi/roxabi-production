import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "../../core";

export interface ImpactTextProps {
  text: string;
  subtext?: string;
  color?: string;
  delay?: number;
  fontSize?: number;
  /** 3D entrance with perspective tilt */
  perspective?: boolean;
  style?: React.CSSProperties;
}

export const ImpactText: React.FC<ImpactTextProps> = ({
  text,
  subtext,
  color = "#e17055",
  delay = 0,
  fontSize = 120,
  perspective = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, delay, config: { damping: 10, stiffness: 120 } });

  const perspTransform = perspective
    ? `perspective(600px) rotateX(${interpolate(pop, [0, 1], [15, 0])}deg)`
    : "";

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: `translate(-50%, -50%) scale(${interpolate(pop, [0, 1], [0.6, 1])}) ${perspTransform}`,
        opacity: pop,
        textAlign: "center",
        ...style,
      }}
    >
      <div
        style={{
          fontSize,
          fontWeight: 900,
          color,
          fontFamily: "'Inter', system-ui",
          letterSpacing: "-0.04em",
          textShadow: `0 0 60px ${color}60, 0 4px 20px rgba(0,0,0,0.8)`,
          lineHeight: 1,
        }}
      >
        {text}
      </div>
      {subtext && (
        <div
          style={{
            fontSize: fontSize * 0.3,
            fontWeight: 600,
            color: "rgba(255,255,255,0.6)",
            marginTop: 8,
          }}
        >
          {subtext}
        </div>
      )}
    </div>
  );
};
