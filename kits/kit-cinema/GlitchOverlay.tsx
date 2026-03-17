import React from "react";
import { random, useCurrentFrame } from "../../core";

export interface GlitchOverlayProps {
  /** 0–1: how often glitch triggers (0=never, 1=every frame) */
  frequency?: number;
  /** Max horizontal shift in px for glitch strips */
  intensity?: number;
  /** Number of horizontal strips */
  strips?: number;
  /** Overall opacity of the effect */
  opacity?: number;
  children?: React.ReactNode;
}

export const GlitchOverlay: React.FC<GlitchOverlayProps> = ({
  frequency = 0.1,
  intensity = 20,
  strips = 4,
  opacity = 1,
  children,
}) => {
  const frame = useCurrentFrame();
  const isActive = random(`glitch-trigger-${frame}`) < frequency;

  if (!isActive) {
    return <>{children}</>;
  }

  const stripCount = Math.round(
    3 + random(`glitch-strip-count-${frame}`) * (strips - 3)
  );

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", opacity }}>
      {children}
      {Array.from({ length: stripCount }, (_, i) => {
        const topPct = random(`glitch-top-${frame}-${i}`) * 90;
        const heightPct = 3 + random(`glitch-h-${frame}-${i}`) * 12;
        const shiftX =
          (random(`glitch-shift-${frame}-${i}`) * 2 - 1) * intensity;
        const stripOpacity = 0.3 + random(`glitch-op-${frame}-${i}`) * 0.4;
        const useBlendMode = i === 0;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              overflow: "hidden",
              clipPath: `inset(${topPct}% 0 ${Math.max(0, 100 - topPct - heightPct)}% 0)`,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                transform: `translateX(${shiftX}px)`,
                opacity: stripOpacity,
                mixBlendMode: useBlendMode ? "difference" : "normal",
              }}
            >
              {children}
            </div>
          </div>
        );
      })}
    </div>
  );
};
