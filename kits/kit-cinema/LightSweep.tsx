import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "../../core";

export interface LightSweepProps {
  delay?: number;
  color?: string;
  /** Width of the sweep band as % */
  width?: number;
  /** Skew angle */
  skew?: number;
}

export const LightSweep: React.FC<LightSweepProps> = ({
  delay = 0,
  color = "#a29bfe",
  width = 15,
  skew = -15,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, delay, config: { damping: 30, stiffness: 40 } });
  const x = interpolate(p, [0, 1], [-30, 130]);

  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: `${x}%`,
          width: `${width}%`,
          height: "100%",
          background: `linear-gradient(90deg, transparent, ${color}15, ${color}08, transparent)`,
          transform: `skewX(${skew}deg)`,
        }}
      />
    </AbsoluteFill>
  );
};
