import type { CSSProperties, JSX, RefObject } from "react";

/** Types for the React Bits <Crosshair /> component (JavaScript + CSS variant, kept verbatim in Crosshair.jsx). */
export type CrosshairProps = {
  color?: string;
  containerRef?: RefObject<HTMLElement | null> | null;
  thickness?: number;
  opacity?: number;
  lineStyle?: "solid" | "dashed" | "dotted";
  gap?: number;
  fade?: number;
  smoothing?: number;
  showCoordinates?: boolean;
  targetEffect?: "lock" | "glitch" | "none";
  targetSelector?: string;
  clickPulse?: boolean;
  hideCursor?: boolean;
  blendMode?: "normal" | "difference";
  className?: string;
  style?: CSSProperties;
};

declare function Crosshair(props: CrosshairProps): JSX.Element;
export default Crosshair;
