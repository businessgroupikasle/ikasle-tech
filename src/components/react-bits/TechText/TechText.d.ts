import type { CSSProperties, JSX } from "react";

/** Types for the React Bits <TechText /> component (JavaScript + CSS variant, kept verbatim in TechText.jsx). */
export type TechTextProps = {
  text?: string;
  fontFamily?: string;
  fontWeight?: number;
  fontSize?: number;
  letterSpacing?: number;
  align?: "left" | "center" | "right";
  color?: string;
  accentColor?: string;
  reveal?: "area" | "letter" | "off";
  reach?: number;
  softness?: number;
  dashLength?: number;
  dashGap?: number;
  lineStyle?: "dashed" | "solid";
  strokeWidth?: number;
  specks?: number;
  selection?: boolean;
  labels?: boolean;
  draggable?: boolean;
  bounce?: number;
  clickKick?: boolean;
  intro?: "none" | "type" | "assemble" | "metrics";
  introDuration?: number;
  guides?: boolean;
  sweep?: boolean;
  speed?: number;
  className?: string;
  style?: CSSProperties;
};

declare function TechText(props: TechTextProps): JSX.Element;
export default TechText;
