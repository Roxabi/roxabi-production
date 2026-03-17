import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "../../core";

export interface PhoneFrameProps {
  children: React.ReactNode;
  /** Phone width in px */
  width?: number;
  /** Show status bar (time, 5G, battery) */
  showStatusBar?: boolean;
  /** Entrance animation delay */
  delay?: number;
  /** Float animation */
  float?: boolean;
  style?: React.CSSProperties;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  width = 420,
  showStatusBar = true,
  delay = 0,
  float = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrance = spring({ frame, fps, delay, config: { damping: 14, stiffness: 60 } });
  const floatY = float ? Math.sin(frame * 0.025) * 4 : 0;
  const rotY = float ? Math.sin(frame * 0.01) * 2 : 0;

  return (
    <div
      style={{
        width,
        transform: `translateY(${floatY}px) rotateY(${rotY}deg) scale(${interpolate(entrance, [0, 1], [0.85, 1])})`,
        opacity: entrance,
        borderRadius: 28,
        overflow: "hidden",
        border: "3px solid rgba(255,255,255,0.08)",
        boxShadow: "0 30px 100px rgba(124,92,231,0.15), 0 0 0 1px rgba(255,255,255,0.04) inset",
        ...style,
      }}
    >
      {showStatusBar && (
        <div
          style={{
            height: 44,
            backgroundColor: "#0d1117",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 600, color: "#888", fontFamily: "system-ui" }}>9:41</span>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 10, color: "#666" }}>5G</span>
            <span style={{ fontSize: 10, color: "#666" }}>🔋</span>
          </div>
        </div>
      )}
      {children}
    </div>
  );
};
