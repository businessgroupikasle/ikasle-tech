"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { useInViewport } from "@/hooks/useInViewport";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";
import { useWebGL2Support } from "@/hooks/useWebGL2Support";
import { brand } from "@/lib/brand";

// WebGL effect: its code loads only once the footer is about to be seen.
const MetaBalls = dynamic(() => import("@/components/react-bits/MetaBalls/MetaBalls"), { ssr: false });

/**
 * React Bits <MetaBalls /> as a soft, decorative footer background (every page, via the shared Footer).
 * Mounts only when the footer nears the viewport; skipped with reduced motion or without WebGL2, which
 * leaves the plain footer. Click-through and faded at the edges so the links stay readable and usable.
 */
export function FooterMetaBalls() {
  const ref = useRef<HTMLDivElement>(null);
  const near = useInViewport(ref, { rootMargin: "300px", once: true });
  const webgl2 = useWebGL2Support();
  const reduced = usePrefersReducedMotion();
  const on = near && Boolean(webgl2) && !reduced;

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 opacity-[0.22] [mask-image:radial-gradient(ellipse_75%_90%_at_50%_50%,#000_45%,transparent_100%)]"
      aria-hidden="true"
    >
      {on && (
        <MetaBalls
          color={brand.blue}
          cursorBallColor={brand.blueTint}
          variant="solid"
          motion="drift"
          speed={0.25}
          ballCount={12}
          animationSize={30}
          gooeyness={0.5}
          stretch={0.5}
          wobble={0.5}
          cursorBallSize={2.5}
          enableTransparency
        />
      )}
    </div>
  );
}
