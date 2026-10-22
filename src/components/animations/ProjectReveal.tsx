"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { cn } from "@/lib/cn";

/**
 * GSAP ScrollTrigger reveal for project media: a clip-path wipe on the wrapper plus
 * a scrubbed parallax on `[data-parallax]` children. GSAP owns clip-path and the
 * children's `y`; Motion is free to animate hover states on other descendants.
 */
export function ProjectReveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          ref.current,
          { clipPath: "inset(12% 8% 12% 8% round 28px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 28px)",
            ease: "power3.out",
            duration: 1.2,
            scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
          },
        );
        gsap.utils.toArray<HTMLElement>("[data-parallax]", ref.current).forEach((el) => {
          const depth = Number(el.dataset.parallax) || 1;
          gsap.fromTo(
            el,
            { y: 30 * depth },
            {
              y: -30 * depth,
              ease: "none",
              scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: 0.6 },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn("relative", className)}>
      {children}
    </div>
  );
}
