import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "../../core";

export interface BrowserTabsProps {
  /** Tab labels — if not provided, uses realistic defaults */
  tabs?: string[];
  /** Number of tabs (used if tabs[] not provided) */
  tabCount?: number;
  activeTab?: number;
  /** Tabs appear one by one over time */
  animateAppearance?: boolean;
  /** Frames between each tab appearing */
  staggerDelay?: number;
  style?: React.CSSProperties;
}

const DEFAULT_TABS = [
  "Gmail - Inbox (247)", "Slack | #general", "Google Drive", "Notion - Project...",
  "Calendar - March", "LinkedIn", "Jira Board", "Figma - Design...",
  "GitHub - Pull req...", "Zoom Meeting", "Trello", "HubSpot CRM",
  "Google Docs - Q...", "Confluence", "Teams - Chat", "Asana Tasks",
  "Dropbox", "Monday.com", "Stack Overflow", "ChatGPT",
];

export const BrowserTabs: React.FC<BrowserTabsProps> = ({
  tabs,
  tabCount = 15,
  activeTab = 0,
  animateAppearance = true,
  staggerDelay = 3,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const labels = tabs || DEFAULT_TABS;
  const count = tabs ? tabs.length : tabCount;
  const tabWidth = Math.min(140, 900 / count);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        height: 36,
        backgroundColor: "#202124",
        borderRadius: "8px 8px 0 0",
        padding: "6px 8px 0",
        overflow: "hidden",
        ...style,
      }}
    >
      {Array.from({ length: count }, (_, i) => {
        const delay = animateAppearance ? i * staggerDelay : 0;
        const p = spring({ frame, fps, delay, config: { damping: 15, stiffness: 200 } });
        const isActive = i === activeTab;
        return (
          <div
            key={i}
            style={{
              width: tabWidth * p,
              height: 30,
              backgroundColor: isActive ? "#35363a" : "#292a2d",
              borderRadius: "8px 8px 0 0",
              marginRight: 1,
              padding: "0 8px",
              display: "flex",
              alignItems: "center",
              opacity: p,
              flexShrink: 0,
              border: isActive ? "1px solid #444" : "1px solid transparent",
              borderBottom: "none",
            }}
          >
            <span
              style={{
                fontSize: 10,
                color: isActive ? "#e8eaed" : "#9aa0a6",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontFamily: "system-ui",
              }}
            >
              {labels[i % labels.length]}
            </span>
          </div>
        );
      })}
    </div>
  );
};
