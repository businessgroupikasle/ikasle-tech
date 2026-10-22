import type { CSSProperties, HTMLAttributes, JSX } from "react";

/** Types for the React Bits <StickerPeel /> component (JavaScript + CSS variant, kept verbatim in StickerPeel.jsx). */
export type StickerPeelProps = Omit<HTMLAttributes<HTMLDivElement>, "style" | "className"> & {
  imageSrc: string;
  width?: number;
  rotate?: number;
  peelDirection?: number;
  peelBackHoverPct?: number;
  peelBackActivePct?: number;
  curlRadius?: number;
  finish?: "gloss" | "matte" | "holo";
  backColor?: string;
  lightingIntensity?: number;
  shadowIntensity?: number;
  followPointer?: boolean;
  draggable?: boolean;
  swing?: number;
  friction?: number;
  bounce?: number;
  intro?: boolean;
  initialPosition?: "center" | { x: number; y: number };
  onDragStart?: () => void;
  onDragEnd?: () => void;
  dpr?: number;
  className?: string;
  style?: CSSProperties;
};

declare function StickerPeel(props: StickerPeelProps): JSX.Element;
export default StickerPeel;
