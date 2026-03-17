import React, { useId } from "react";
import { useCurrentFrame } from "../../core";

export interface ChromaticAberrationProps {
  /** Split amount in px — how far R and B channels offset */
  intensity?: number;
  /** 0–1 opacity of the effect */
  opacity?: number;
  /** If true, intensity pulses slightly with frame */
  animated?: boolean;
  children?: React.ReactNode;
}

export const ChromaticAberration: React.FC<ChromaticAberrationProps> = ({
  intensity = 3,
  opacity = 1,
  animated = false,
  children,
}) => {
  const frame = useCurrentFrame();
  const uid = useId().replace(/:/g, "");

  const filterId = `chroma-${uid}`;

  const effectiveIntensity = animated
    ? intensity * (Math.sin(frame * 0.05) * 0.5 + 0.5)
    : intensity;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Hidden SVG that declares the filter */}
      <svg
        style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
        aria-hidden="true"
      >
        <defs>
          <filter
            id={filterId}
            x="-10%"
            y="-10%"
            width="120%"
            height="120%"
            colorInterpolationFilters="sRGB"
          >
            {/* Extract R channel, shift left */}
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="red"
            />
            <feOffset
              in="red"
              dx={-effectiveIntensity}
              dy={0}
              result="redShifted"
            />

            {/* Extract G channel, no shift */}
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="green"
            />

            {/* Extract B channel, shift right */}
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
              result="blue"
            />
            <feOffset
              in="blue"
              dx={effectiveIntensity}
              dy={0}
              result="blueShifted"
            />

            {/* Blend R + G with screen, then blend result + B with screen */}
            <feBlend in="redShifted" in2="green" mode="screen" result="rg" />
            <feBlend in="rg" in2="blueShifted" mode="screen" result="rgb" />
          </filter>
        </defs>
      </svg>

      {/* At opacity=1 render the filtered version; at opacity=0 render plain children.
          We composite both layers: filtered on top with `opacity`, unfiltered beneath. */}
      <div style={{ position: "absolute", inset: 0 }}>{children}</div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          filter: `url(#${filterId})`,
          opacity,
        }}
      >
        {children}
      </div>
    </div>
  );
};
