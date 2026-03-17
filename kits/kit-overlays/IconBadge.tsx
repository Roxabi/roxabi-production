import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "../../core";

export interface IconBadgeProps {
  icon?: string;
  text: string;
  color?: string;
  delay?: number;
  style?: React.CSSProperties;
}

export const IconBadge: React.FC<IconBadgeProps> = ({
  icon = "⚡",
  text,
  color = "#00cec9",
  delay = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, delay, config: { damping: 8, stiffness: 180 } });

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 18px",
        backgroundColor: `${color}15`,
        border: `1px solid ${color}40`,
        borderRadius: 10,
        opacity: pop,
        transform: `scale(${pop})`,
        ...style,
      }}
    >
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span
        style={{
          fontSize: 15,
          fontWeight: 700,
          color,
          fontFamily: "system-ui",
          textShadow: `0 0 20px ${color}40`,
        }}
      >
        {text}
      </span>
    </div>
  );
};
