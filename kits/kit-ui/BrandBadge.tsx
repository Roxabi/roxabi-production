import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "../../core";

export interface BrandBadgeProps {
  /** Icon emoji or single character */
  icon?: string;
  /** Brand/product name */
  name: string;
  /** Badge color scheme */
  color?: string;
  /** Background style */
  variant?: "solid" | "outline" | "glass";
  delay?: number;
  /** Size preset */
  size?: "sm" | "md" | "lg";
  style?: React.CSSProperties;
}

export const BrandBadge: React.FC<BrandBadgeProps> = ({
  icon,
  name,
  color = "#7c5ce7",
  variant = "glass",
  delay = 0,
  size = "md",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, delay, config: { damping: 10, stiffness: 150 } });

  const sizeMap = {
    sm: { fontSize: 14, padding: "6px 14px", iconSize: 16, gap: 6, radius: 8 },
    md: { fontSize: 18, padding: "10px 20px", iconSize: 22, gap: 8, radius: 12 },
    lg: { fontSize: 24, padding: "14px 28px", iconSize: 28, gap: 10, radius: 16 },
  };
  const s = sizeMap[size];

  const bgMap = {
    solid: { backgroundColor: color, border: "none" },
    outline: { backgroundColor: "transparent", border: `2px solid ${color}` },
    glass: {
      backgroundColor: `${color}18`,
      border: `1px solid ${color}35`,
      backdropFilter: "blur(12px)",
    },
  };

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: s.gap,
        padding: s.padding,
        borderRadius: s.radius,
        ...bgMap[variant],
        opacity: pop,
        transform: `scale(${interpolate(pop, [0, 1], [0.7, 1])})`,
        boxShadow: variant === "solid" ? `0 4px 20px ${color}40` : "none",
        ...style,
      }}
    >
      {icon && (
        <span style={{ fontSize: s.iconSize, lineHeight: 1 }}>{icon}</span>
      )}
      <span
        style={{
          fontSize: s.fontSize,
          fontWeight: 700,
          color: variant === "solid" ? "white" : color,
          fontFamily: "system-ui, sans-serif",
          letterSpacing: "-0.01em",
        }}
      >
        {name}
      </span>
    </div>
  );
};
