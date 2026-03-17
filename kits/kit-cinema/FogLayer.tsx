import React from "react";
import { AbsoluteFill, useCurrentFrame } from "../../core";

export interface FogLayerProps {
  /** Where the fog is thickest: "bottom" | "top" | "edges" | "full" */
  position?: "bottom" | "top" | "edges" | "full";
  /** Color of the fog (use an rgb/rgba base without the closing paren, e.g. "rgba(255,255,255") */
  color?: string;
  /** 0–1 opacity */
  intensity?: number;
  /** Whether the fog slowly drifts/undulates */
  animated?: boolean;
}

function buildGradient(
  position: NonNullable<FogLayerProps["position"]>,
  color: string,
  opacity: number
): string {
  switch (position) {
    case "bottom":
      return `linear-gradient(to top, ${color},${opacity}) 0%, ${color},0) 60%)`;
    case "top":
      return `linear-gradient(to bottom, ${color},${opacity}) 0%, ${color},0) 60%)`;
    case "edges":
      return `radial-gradient(ellipse at 50% 50%, transparent 30%, ${color},${opacity}) 100%)`;
    case "full":
      return `radial-gradient(ellipse at 50% 50%, ${color},${opacity * 0.5}) 0%, ${color},${opacity}) 100%)`;
  }
}

export const FogLayer: React.FC<FogLayerProps> = ({
  position = "bottom",
  color = "rgba(255,255,255",
  intensity = 0.4,
  animated = true,
}) => {
  const frame = useCurrentFrame();

  // Slow sine wave oscillation for the two layers when animated
  const wave1 = animated ? Math.sin(frame * 0.02) * 0.15 : 0;
  const wave2 = animated ? Math.sin(frame * 0.02 + 1.2) * 0.1 : 0;

  const opacity1 = Math.max(0, Math.min(1, intensity + wave1));
  const opacity2 = Math.max(0, Math.min(1, intensity * 0.6 + wave2));

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* Primary fog layer */}
      <AbsoluteFill
        style={{
          background: buildGradient(position, color, opacity1),
        }}
      />
      {/* Secondary layer at a slightly different speed for depth */}
      <AbsoluteFill
        style={{
          background: buildGradient(position, color, opacity2),
          transform: position === "bottom" || position === "top"
            ? `scaleX(1.05)`
            : `scale(0.95)`,
        }}
      />
    </AbsoluteFill>
  );
};
