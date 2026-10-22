"use client";

import { Click, type ClickVariant } from "@animate-ui/react/primitives/effects/click";
import { brand } from "@/lib/brand";

/**
 * Site-wide click feedback (Animate UI `Click`, built on Motion).
 * Listens on the document and draws the effect in a fixed, pointer-events-none
 * portal, so it never blocks or changes any interaction. Animate UI skips it
 * entirely when the user prefers reduced motion.
 *
 * Variants: "ring" | "ripple" | "crosshair" | "burst" | "particles".
 */
const VARIANT: Exclude<ClickVariant, "ripple"> = "ring";

export function ClickEffect() {
  // `color` is applied as an SVG stroke attribute, where CSS variables aren't reliable — use the hex token.
  return <Click variant={VARIANT} color={brand.blue} size={90} duration={450} />;
}
