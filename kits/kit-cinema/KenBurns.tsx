import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "../../core";

export interface KenBurnsProps {
  children: React.ReactNode;
  zoomFrom?: number;
  zoomTo?: number;
  /** Horizontal pan in px */
  panX?: number;
  /** Vertical pan in px */
  panY?: number;
}

export const KenBurns: React.FC<KenBurnsProps> = ({
  children,
  zoomFrom = 1.0,
  zoomTo = 1.12,
  panX = 0,
  panY = 0,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${interpolate(p, [0, 1], [zoomFrom, zoomTo])}) translate(${interpolate(p, [0, 1], [0, panX])}px, ${interpolate(p, [0, 1], [0, panY])}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
