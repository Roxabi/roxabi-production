import React from "react";
import { useCurrentFrame, useVideoConfig, spring, random } from "../../core";

export interface CardItem {
  label: string;
  icon?: string;
}

export interface FloatingCardsProps {
  cards?: CardItem[];
  /** Frames between each card appearing */
  stagger?: number;
  /** Initial delay */
  delay?: number;
  style?: React.CSSProperties;
}

const DEFAULT_CARDS: CardItem[] = [
  { label: "Gmail — Inbox (247)", icon: "📧" },
  { label: "Slack — #product", icon: "💬" },
  { label: "Jira — Sprint 14", icon: "📋" },
  { label: "Google Sheets", icon: "📊" },
  { label: "Calendar", icon: "📅" },
  { label: "Notion", icon: "📝" },
  { label: "12 notifications", icon: "🔔" },
  { label: "Drive — Contrats", icon: "📎" },
];

export const FloatingCards: React.FC<FloatingCardsProps> = ({
  cards = DEFAULT_CARDS,
  stagger = 8,
  delay = 15,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  return (
    <div style={{ position: "absolute", inset: 0, perspective: 800, pointerEvents: "none", ...style }}>
      {cards.map((card, i) => {
        const entrance = spring({
          frame,
          fps,
          delay: delay + i * stagger,
          config: { damping: 14, stiffness: 80 },
        });
        const x = random(`cx-${i}`) * (width - 300) + 50;
        const y = random(`cy-${i}`) * (height - 200) + 80;
        const z = random(`cz-${i}`) * 200 - 100;
        const rotX = random(`crx-${i}`) * 20 - 10;
        const rotY = random(`cry-${i}`) * 30 - 15;
        const driftX = Math.sin(frame * 0.01 + i) * 20;
        const driftY = Math.cos(frame * 0.008 + i * 0.7) * 15;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + driftX,
              top: y + driftY,
              transform: `translateZ(${z}px) rotateX(${rotX + Math.sin(frame * 0.005) * 3}deg) rotateY(${rotY + Math.cos(frame * 0.007) * 3}deg) scale(${entrance})`,
              padding: "8px 14px",
              backgroundColor: "rgba(20,20,35,0.85)",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(8px)",
              opacity: entrance * 0.8,
              boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
            }}
          >
            <span style={{ fontSize: 13, color: "#ccc", fontFamily: "system-ui", whiteSpace: "nowrap" }}>
              {card.icon && `${card.icon} `}{card.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
