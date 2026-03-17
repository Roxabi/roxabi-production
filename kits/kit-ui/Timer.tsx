import React from "react";
import { useCurrentFrame, interpolate } from "../../core";

export interface TimerProps {
  maxSeconds: number;
  /** Frames to reach maxSeconds */
  duration: number;
  delay?: number;
  color?: string;
  size?: number;
  /** "digital" = 00:00, "seconds" = 42s, "minimal" = just the number */
  format?: "digital" | "seconds" | "minimal";
  style?: React.CSSProperties;
}

export const Timer: React.FC<TimerProps> = ({
  maxSeconds,
  duration,
  delay = 0,
  color = "#e17055",
  size = 80,
  format = "digital",
  style,
}) => {
  const frame = useCurrentFrame();
  const elapsed = interpolate(frame, [delay, delay + duration], [0, maxSeconds], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const mins = Math.floor(elapsed / 60);
  const secs = Math.floor(elapsed % 60);

  const display =
    format === "digital"
      ? `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
      : format === "seconds"
        ? `${Math.floor(elapsed)}s`
        : String(Math.floor(elapsed));

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontFamily: "monospace",
        fontSize: size * 0.4,
        fontWeight: 800,
        color,
        textShadow: `0 0 20px ${color}60`,
        ...style,
      }}
    >
      <span style={{ fontSize: size * 0.25, opacity: 0.7 }}>⏱</span>
      {display}
    </div>
  );
};
