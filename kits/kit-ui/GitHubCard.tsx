import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "../../core";

export interface GitHubCardProps {
  owner: string;
  repo: string;
  description?: string;
  language?: string;
  /** Hex color for the language dot */
  languageColor?: string;
  stars?: number;
  forks?: number;
  /** 12 numbers 0–100 representing relative commit activity */
  activity?: number[];
  /** "light" | "dark" — GitHub theme */
  theme?: "light" | "dark";
  /** Entry animation delay in frames */
  delay?: number;
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

const BookIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill={color}
    aria-hidden="true"
  >
    <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8Z" />
  </svg>
);

const ForkIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 16 16"
    fill={color}
    aria-hidden="true"
  >
    <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
  </svg>
);

const StarIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 16 16"
    fill={color}
    aria-hidden="true"
  >
    <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
  </svg>
);

export const GitHubCard: React.FC<GitHubCardProps> = ({
  owner,
  repo,
  description,
  language,
  languageColor = "#3178c6",
  stars,
  forks,
  activity,
  theme = "dark",
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = spring({
    frame,
    fps,
    delay,
    config: { damping: 14, stiffness: 140 },
  });

  const isDark = theme === "dark";

  const colors = {
    bg: isDark ? "#0d1117" : "#ffffff",
    border: isDark ? "#30363d" : "#d0d7de",
    repoLink: "#58a6ff",
    description: isDark ? "#8b949e" : "#57606a",
    meta: isDark ? "#8b949e" : "#57606a",
    text: isDark ? "#e6edf3" : "#24292f",
    barAccent: "#58a6ff",
    barBg: isDark ? "#21262d" : "#e6edf3",
    iconMuted: isDark ? "#8b949e" : "#57606a",
  };

  // Normalise activity values to 0–1 for bar heights
  const bars = activity && activity.length > 0 ? activity.slice(0, 12) : null;
  const barMax = bars ? Math.max(...bars, 1) : 1;

  const scale = interpolate(pop, [0, 1], [0.95, 1]);

  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        gap: 8,
        padding: 16,
        borderRadius: 6,
        border: `1px solid ${colors.border}`,
        backgroundColor: colors.bg,
        opacity: pop,
        transform: `scale(${scale})`,
        minWidth: 300,
        maxWidth: 480,
        boxSizing: "border-box",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
      }}
    >
      {/* Row 1: repo icon + owner/repo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <BookIcon color={colors.iconMuted} />
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: colors.repoLink,
            letterSpacing: "0.01em",
          }}
        >
          {owner}
          <span style={{ color: colors.iconMuted, fontWeight: 400 }}>/</span>
          {repo}
        </span>
      </div>

      {/* Row 2: description */}
      {description && (
        <p
          style={{
            margin: 0,
            fontSize: 12,
            lineHeight: 1.5,
            color: colors.description,
          }}
        >
          {description}
        </p>
      )}

      {/* Row 3: language + stars + forks */}
      {(language || stars !== undefined || forks !== undefined) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          {language && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 12,
                color: colors.meta,
              }}
            >
              {/* Language dot */}
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: languageColor,
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              {language}
            </span>
          )}

          {stars !== undefined && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 12,
                color: colors.meta,
              }}
            >
              <StarIcon color={colors.meta} />
              {formatCount(stars)}
            </span>
          )}

          {forks !== undefined && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 12,
                color: colors.meta,
              }}
            >
              <ForkIcon color={colors.meta} />
              {formatCount(forks)}
            </span>
          )}
        </div>
      )}

      {/* Row 4: activity bar chart */}
      {bars && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 2,
            height: 28,
            marginTop: 4,
          }}
          aria-label="Commit activity chart"
        >
          {bars.map((value, i) => {
            const heightPct = value / barMax;
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${Math.max(heightPct * 100, 8)}%`,
                  backgroundColor:
                    heightPct > 0.1 ? colors.barAccent : colors.barBg,
                  borderRadius: 2,
                  opacity: 0.7 + heightPct * 0.3,
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
