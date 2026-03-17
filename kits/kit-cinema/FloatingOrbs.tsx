import React, { useMemo } from "react";
import { AbsoluteFill, random, useCurrentFrame } from "../../core";

export interface FloatingOrbsProps {
  count?: number;
  color1?: string;
  color2?: string;
  speed?: number;
  /** Max orb size in px */
  maxSize?: number;
  blur?: number;
}

export const FloatingOrbs: React.FC<FloatingOrbsProps> = ({
  count = 5,
  color1 = "#7c5ce7",
  color2 = "#00cec9",
  speed = 1,
  maxSize = 500,
  blur = 40,
}) => {
  const frame = useCurrentFrame();
  const t = frame * 0.005 * speed;

  const orbs = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: random(`orb-x-${i}`) * 100,
        y: random(`orb-y-${i}`) * 100,
        size: 200 + random(`orb-s-${i}`) * (maxSize - 200),
        phase: random(`orb-p-${i}`) * Math.PI * 2,
        color: i % 2 === 0 ? color1 : color2,
      })),
    [count, color1, color2, maxSize],
  );

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {orbs.map((orb, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${orb.x + Math.sin(t + orb.phase) * 15}%`,
            top: `${orb.y + Math.cos(t * 0.7 + orb.phase) * 12}%`,
            width: orb.size,
            height: orb.size,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${orb.color}18 0%, transparent 70%)`,
            transform: "translate(-50%, -50%)",
            filter: `blur(${blur}px)`,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
