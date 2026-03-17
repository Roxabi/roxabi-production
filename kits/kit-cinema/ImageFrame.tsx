import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "../../core";
import { KenBurns } from "./KenBurns";

export interface ImageFrameProps {
  src: string;
  /** "cover" | "contain" | "fill" */
  fit?: "cover" | "contain" | "fill";
  /** Apply greyscale filter */
  grayscale?: boolean;
  /** Apply sepia + contrast for vintage look */
  vintage?: boolean;
  /** Apply KenBurns zoom+pan animation */
  kenBurns?: boolean;
  /** Direction for KenBurns: "in" | "out" */
  kenBurnsDirection?: "in" | "out";
  /** Optional caption at bottom */
  caption?: string;
  /** Fade in duration in frames */
  fadeIn?: number;
}

export const ImageFrame: React.FC<ImageFrameProps> = ({
  src,
  fit = "cover",
  grayscale = false,
  vintage = false,
  kenBurns = false,
  kenBurnsDirection = "in",
  caption,
  fadeIn = 0,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const opacity =
    fadeIn > 0
      ? interpolate(frame, [0, fadeIn], [0, 1], { extrapolateRight: "clamp" })
      : 1;

  const filterParts: string[] = [];
  if (grayscale) filterParts.push("grayscale(100%)");
  if (vintage) {
    filterParts.push("sepia(60%)");
    filterParts.push("contrast(110%)");
  }
  const filter = filterParts.length > 0 ? filterParts.join(" ") : undefined;

  const zoomFrom = kenBurnsDirection === "in" ? 1.0 : 1.12;
  const zoomTo = kenBurnsDirection === "in" ? 1.12 : 1.0;

  const image = (
    <img
      src={src}
      style={{
        width: "100%",
        height: "100%",
        objectFit: fit,
        display: "block",
        filter,
      }}
      alt=""
    />
  );

  return (
    <AbsoluteFill style={{ opacity }}>
      {kenBurns ? (
        <KenBurns zoomFrom={zoomFrom} zoomTo={zoomTo}>
          {image}
        </KenBurns>
      ) : (
        <AbsoluteFill>{image}</AbsoluteFill>
      )}
      {caption ? (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "12px 20px",
            background: "rgba(0, 0, 0, 0.45)",
            color: "rgba(255, 255, 255, 0.75)",
            fontSize: 14,
            fontFamily: "sans-serif",
            letterSpacing: "0.03em",
          }}
        >
          {caption}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
