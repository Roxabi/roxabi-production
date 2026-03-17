import React from "react";
import { AbsoluteFill } from "../../core";

export interface VignetteProps {
  /** 0 = no vignette, 1 = heavy vignette */
  intensity?: number;
  /** Center clear radius as % */
  innerRadius?: number;
  color?: string;
}

export const Vignette: React.FC<VignetteProps> = ({
  intensity = 0.5,
  innerRadius = 45,
  color = "rgba(0,0,0",
}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse at 50% 50%, transparent ${innerRadius}%, ${color},${intensity}) 100%)`,
      pointerEvents: "none",
    }}
  />
);
