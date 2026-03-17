import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "../../core";

export interface NotificationToastProps {
  icon: string;
  app: string;
  message: string;
  delay?: number;
  /** Slide from direction */
  from?: "right" | "left" | "top";
  style?: React.CSSProperties;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  icon,
  app,
  message,
  delay = 0,
  from = "right",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, delay, config: { damping: 12, stiffness: 150 } });

  const slideMap = {
    right: `translateX(${interpolate(p, [0, 1], [30, 0])}px)`,
    left: `translateX(${interpolate(p, [0, 1], [-30, 0])}px)`,
    top: `translateY(${interpolate(p, [0, 1], [-20, 0])}px)`,
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 16px",
        backgroundColor: "rgba(30,30,50,0.95)",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(20px)",
        opacity: p,
        transform: slideMap[from],
        ...style,
      }}
    >
      <span style={{ fontSize: 20 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#aaa", fontFamily: "system-ui" }}>{app}</div>
        <div style={{ fontSize: 13, color: "#ddd", fontFamily: "system-ui" }}>{message}</div>
      </div>
    </div>
  );
};
