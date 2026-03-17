import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "../../core";

export interface FlowNode {
  id: string;
  label: string;
  icon?: string;
  /** Position as % of container */
  x: number;
  y: number;
  color?: string;
}

export interface FlowEdge {
  from: string;
  to: string;
}

export interface FlowDiagramProps {
  nodes: FlowNode[];
  edges: FlowEdge[];
  /** Stagger delay between nodes appearing */
  stagger?: number;
  /** Initial delay */
  delay?: number;
  /** Line color */
  lineColor?: string;
  /** Line width */
  lineWidth?: number;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

export const FlowDiagram: React.FC<FlowDiagramProps> = ({
  nodes,
  edges,
  stagger = 10,
  delay = 0,
  lineColor = "rgba(255,255,255,0.2)",
  lineWidth = 2,
  width = 900,
  height = 500,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Build node positions map
  const nodePos: Record<string, { x: number; y: number }> = {};
  nodes.forEach((n) => {
    nodePos[n.id] = { x: (n.x / 100) * width, y: (n.y / 100) * height };
  });

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        ...style,
      }}
    >
      {/* SVG edges */}
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
      >
        {edges.map((edge, i) => {
          const from = nodePos[edge.from];
          const to = nodePos[edge.to];
          if (!from || !to) return null;

          // Line draws over time
          const edgeDelay = delay + Math.max(
            nodes.findIndex((n) => n.id === edge.from),
            nodes.findIndex((n) => n.id === edge.to),
          ) * stagger;
          const drawProgress = spring({
            frame,
            fps,
            delay: edgeDelay,
            config: { damping: 20, stiffness: 60 },
          });

          const dx = to.x - from.x;
          const dy = to.y - from.y;
          const len = Math.sqrt(dx * dx + dy * dy);

          return (
            <line
              key={i}
              x1={from.x}
              y1={from.y}
              x2={from.x + dx * drawProgress}
              y2={from.y + dy * drawProgress}
              stroke={lineColor}
              strokeWidth={lineWidth}
              strokeLinecap="round"
              strokeDasharray={`${len}`}
              strokeDashoffset={len * (1 - drawProgress)}
            />
          );
        })}

        {/* Connector dots at edge endpoints */}
        {edges.map((edge, i) => {
          const from = nodePos[edge.from];
          const to = nodePos[edge.to];
          if (!from || !to) return null;

          const edgeDelay = delay + Math.max(
            nodes.findIndex((n) => n.id === edge.from),
            nodes.findIndex((n) => n.id === edge.to),
          ) * stagger;
          const dotProgress = spring({
            frame,
            fps,
            delay: edgeDelay + 5,
            config: { damping: 12, stiffness: 180 },
          });

          return (
            <React.Fragment key={`dots-${i}`}>
              <circle cx={from.x} cy={from.y} r={4 * dotProgress} fill={lineColor} />
              <circle cx={to.x} cy={to.y} r={4 * dotProgress} fill={lineColor} />
            </React.Fragment>
          );
        })}
      </svg>

      {/* Nodes */}
      {nodes.map((node, i) => {
        const nodeDelay = delay + i * stagger;
        const nodeProgress = spring({
          frame,
          fps,
          delay: nodeDelay,
          config: { damping: 12, stiffness: 120 },
        });
        const color = node.color || "#7c5ce7";

        return (
          <div
            key={node.id}
            style={{
              position: "absolute",
              left: nodePos[node.id].x,
              top: nodePos[node.id].y,
              transform: `translate(-50%, -50%) scale(${nodeProgress})`,
              opacity: nodeProgress,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
            }}
          >
            {/* Node circle/box */}
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                backgroundColor: `${color}20`,
                border: `2px solid ${color}50`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 4px 20px ${color}20`,
              }}
            >
              {node.icon && (
                <span style={{ fontSize: 24 }}>{node.icon}</span>
              )}
            </div>
            {/* Label */}
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "rgba(255,255,255,0.8)",
                fontFamily: "system-ui",
                textAlign: "center",
                whiteSpace: "nowrap",
              }}
            >
              {node.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
