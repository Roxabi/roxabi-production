import React from "react";
import { AbsoluteFill, useCurrentFrame } from "../../core";

export interface TunnelEffectProps {
  /** Number of rings */
  ringCount?: number;
  /** Accent color for rings */
  color?: string;
  /** Background color */
  background?: string;
  /** Speed of zoom (higher = faster) */
  speed?: number;
  /** "rectangular" | "elliptical" */
  shape?: "rectangular" | "elliptical";
  /** Optional children overlaid on top (e.g. a centered object) */
  children?: React.ReactNode;
}

export const TunnelEffect: React.FC<TunnelEffectProps> = ({
  ringCount = 12,
  color = "#ffffff",
  background = "#000000",
  speed = 0.015,
  shape = "elliptical",
  children,
}) => {
  const frame = useCurrentFrame();

  const rings = Array.from({ length: ringCount }, (_, i) => {
    const offset = i / ringCount;
    const scale = ((frame * speed + offset) % 1.0);
    const opacity = 1 - scale;
    const strokeWidth = 4 * (1 - scale);

    // cx/cy at 50%, rx/ry driven by scale
    const cx = 50;
    const cy = 50;
    // max extents slightly beyond 100% so rings reach the edges
    const rx = scale * 75;
    const ry = scale * 75;

    return { scale, opacity, strokeWidth, cx, cy, rx, ry };
  });

  return (
    <AbsoluteFill style={{ background, overflow: "hidden" }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0 }}
      >
        {rings.map((ring, i) => {
          if (shape === "rectangular") {
            const x = ring.cx - ring.rx;
            const y = ring.cy - ring.ry;
            const w = ring.rx * 2;
            const h = ring.ry * 2;
            return (
              <rect
                key={i}
                x={x}
                y={y}
                width={w}
                height={h}
                fill="none"
                stroke={color}
                strokeWidth={ring.strokeWidth}
                opacity={ring.opacity}
              />
            );
          }

          return (
            <ellipse
              key={i}
              cx={ring.cx}
              cy={ring.cy}
              rx={ring.rx}
              ry={ring.ry}
              fill="none"
              stroke={color}
              strokeWidth={ring.strokeWidth}
              opacity={ring.opacity}
            />
          );
        })}
      </svg>
      {children && (
        <AbsoluteFill style={{ pointerEvents: "none" }}>{children}</AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
