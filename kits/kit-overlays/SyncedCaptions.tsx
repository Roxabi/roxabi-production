import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "../../core";

export interface TimedWord {
  word: string;
  start: number; // seconds
  end: number;
}

export interface SyncedCaptionsProps {
  words: TimedWord[];
  /** Only show words in this time window */
  startTime: number;
  endTime: number;
  /** Color of the currently spoken word */
  activeColor?: string;
  /** Words per visible line */
  wordsPerChunk?: number;
  fontSize?: number;
  position?: "bottom" | "center" | "top";
  style?: React.CSSProperties;
}

const sec = (s: number, fps: number) => Math.round(s * fps);

export const SyncedCaptions: React.FC<SyncedCaptionsProps> = ({
  words,
  startTime,
  endTime,
  activeColor = "#e17055",
  wordsPerChunk = 7,
  fontSize = 38,
  position = "bottom",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const visibleWords = words.filter((w) => w.start >= startTime - 0.5 && w.end <= endTime + 0.5);

  // Group into chunks
  const chunks: TimedWord[][] = [];
  let current: TimedWord[] = [];
  for (const w of visibleWords) {
    current.push(w);
    if (current.length >= wordsPerChunk || w.word.endsWith(".") || (w.word.endsWith(",") && current.length >= 5)) {
      chunks.push(current);
      current = [];
    }
  }
  if (current.length > 0) chunks.push(current);

  const activeIdx = chunks.findIndex((c) => t <= c[c.length - 1].end + 0.3);
  const chunk = chunks[activeIdx >= 0 ? activeIdx : chunks.length - 1];
  if (!chunk) return null;

  const posMap = {
    bottom: { bottom: "5%", top: "auto" },
    center: { bottom: "auto", top: "50%", transform: "translateY(-50%)" },
    top: { bottom: "auto", top: "8%" },
  };

  return (
    <div
      style={{
        position: "absolute",
        left: "8%",
        right: "8%",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0.22em",
        ...posMap[position],
        ...style,
      }}
    >
      {chunk.map((w, i) => {
        const spoken = t >= w.start - 0.05;
        const active = spoken && t <= w.end + 0.12;
        const pop = spoken
          ? spring({
              frame: Math.max(0, frame - sec(w.start, fps)),
              fps,
              config: { damping: 12, stiffness: 220, mass: 0.5 },
            })
          : 0;

        return (
          <span
            key={i}
            style={{
              fontSize,
              fontWeight: active ? 800 : 600,
              color: active ? activeColor : spoken ? "#fff" : "transparent",
              opacity: spoken ? 1 : 0,
              transform: `scale(${spoken ? interpolate(pop, [0, 1], [0.8, active ? 1.06 : 1]) : 0.8})`,
              textShadow: active
                ? `0 0 24px ${activeColor}80, 0 3px 16px rgba(0,0,0,0.9)`
                : "0 3px 16px rgba(0,0,0,0.9)",
              fontFamily: "'Inter', system-ui, sans-serif",
            }}
          >
            {w.word}
          </span>
        );
      })}
    </div>
  );
};
