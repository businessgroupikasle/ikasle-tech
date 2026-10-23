import type { CSSProperties, JSX } from "react";

/** Types for the React Bits <MetaBalls /> component (JavaScript + CSS variant, kept verbatim in MetaBalls.jsx). */
export type MetaBallsProps = {
  color?: string;
  cursorBallColor?: string;
  variant?: "solid" | "outline" | "contour";
  motion?: "orbit" | "drift" | "lava";
  speed?: number;
  animationSize?: number;
  ballCount?: number;
  clumpFactor?: number;
  gooeyness?: number;
  stickiness?: number;
  stretch?: number;
  wobble?: number;
  enableMouseInteraction?: boolean;
  cursorBallSize?: number;
  hoverSmoothness?: number;
  clickBurst?: boolean;
  lineWidth?: number;
  rings?: number;
  intro?: boolean;
  enableTransparency?: boolean;
  paused?: boolean;
  dpr?: number;
  className?: string;
  style?: CSSProperties;
};

declare function MetaBalls(props: MetaBallsProps): JSX.Element;
export default MetaBalls;
