import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "../../core";

export interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  /** Delay in frames before appearing */
  delay: number;
}

export interface ChatInterfaceProps {
  /** App name displayed in header */
  appName?: string;
  /** Gradient colors for avatar [start, end] */
  avatarColors?: [string, string];
  /** Avatar letter */
  avatarLetter?: string;
  messages: ChatMessage[];
  showTyping?: boolean;
  typingDelay?: number;
  /** Online status text */
  statusText?: string;
  statusColor?: string;
  style?: React.CSSProperties;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  appName = "Assistant",
  avatarColors = ["#7c5ce7", "#00cec9"],
  avatarLetter = "A",
  messages,
  showTyping = false,
  typingDelay = 0,
  statusText = "En ligne",
  statusColor = "#00cec9",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#0d1117",
        borderRadius: 16,
        overflow: "hidden",
        fontFamily: "system-ui",
        ...style,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "14px 20px",
          backgroundColor: "#161b22",
          gap: 12,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: `linear-gradient(135deg, ${avatarColors[0]}, ${avatarColors[1]})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: 18, fontWeight: 800, color: "white" }}>{avatarLetter}</span>
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#e6edf3" }}>{appName}</div>
          <div style={{ fontSize: 11, color: statusColor }}>{statusText}</div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.map((msg, i) => {
          const p = spring({ frame, fps, delay: msg.delay, config: { damping: 14, stiffness: 160 } });
          if (p < 0.01) return null;
          const isUser = msg.role === "user";
          return (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: isUser ? "flex-end" : "flex-start",
                opacity: p,
                transform: `translateY(${interpolate(p, [0, 1], [15, 0])}px) scale(${interpolate(p, [0, 1], [0.95, 1])})`,
              }}
            >
              <div
                style={{
                  maxWidth: "75%",
                  padding: "10px 16px",
                  borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  backgroundColor: isUser ? "#1a3a6a" : "#1c2333",
                  border: isUser ? "1px solid #264a80" : "1px solid rgba(255,255,255,0.06)",
                  fontSize: 14,
                  lineHeight: 1.5,
                  color: "#e0e0e0",
                  whiteSpace: "pre-line",
                }}
              >
                {msg.text}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {showTyping && <TypingDots delay={typingDelay} color={statusColor} />}
      </div>
    </div>
  );
};

const TypingDots: React.FC<{ delay: number; color: string }> = ({ delay, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, delay, config: { damping: 14, stiffness: 160 } });
  if (p < 0.01) return null;

  return (
    <div style={{ display: "flex", justifyContent: "flex-start", opacity: p }}>
      <div
        style={{
          padding: "12px 18px",
          borderRadius: "16px 16px 16px 4px",
          backgroundColor: "#1c2333",
          border: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          gap: 4,
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              backgroundColor: color,
              opacity: 0.3 + Math.sin((frame - delay) * 0.15 + i * 1.2) * 0.4,
            }}
          />
        ))}
      </div>
    </div>
  );
};
