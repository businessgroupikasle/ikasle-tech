import type { JSX } from "react";

export type FlexCarouselItem = { src: string; alt?: string; title?: string; subtitle?: string; href?: string };
export type FlexCarouselProps = {
  items: FlexCarouselItem[];
  preset?: "liquid" | "ribbon" | "vortex" | "arch";
  intro?: "rise" | "bloom" | "spin" | "deal" | "none";
  fit?: "natural" | "portrait" | "square" | "landscape";
  cardHeight?: number;
  gap?: number;
  radius?: number;
  squeeze?: number;
  focusOnClick?: boolean;
  captions?: boolean;
  captureWheel?: boolean;
  autoplay?: boolean;
  interval?: number;
};
declare function FlexCarousel(props: FlexCarouselProps): JSX.Element;
export default FlexCarousel;
