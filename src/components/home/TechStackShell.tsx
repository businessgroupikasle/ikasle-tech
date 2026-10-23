"use client";

import { useRef, type ReactNode } from "react";
import Crosshair from "@/components/react-bits/Crosshair/Crosshair";
import { brand } from "@/lib/brand";

/**
 * Section wrapper that scopes React Bits <Crosshair /> to the tech-stack section.
 * `isolate` creates a stacking context so the crosshair's z-index can't paint over the fixed header.
 * Click pulse is off — the site-wide click effect already marks clicks.
 */
export function TechStackShell({ children, labelledBy }: { children: ReactNode; labelledBy: string }) {
  const ref = useRef<HTMLElement>(null);
  return (
    <section ref={ref} aria-labelledby={labelledBy} data-stack-layer="1" className="stack-sticky stack-sheet relative isolate z-10 flex flex-col justify-center overflow-hidden border-b border-line bg-bg-soft motion-reduce:border-t py-16 md:min-h-svh md:pt-[calc(var(--header-h)+24px)] md:pb-10">
      {children}
      <Crosshair
        containerRef={ref}
        color={brand.blue}
        thickness={1}
        opacity={0.7}
        fade={0.55}
        smoothing={0.3}
        showCoordinates
        targetEffect="lock"
        targetSelector=".orbit-item"
        clickPulse={false}
      />
    </section>
  );
}
