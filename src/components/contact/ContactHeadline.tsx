"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { cn } from "@/lib/cn";

const LEAD = "Let's Turn Your Vision Into";
const PHRASES = ["Software", "Websites", "CRM Systems", "ERP Solutions", "Mobile Apps"];
/** Seconds each phrase stays fully visible. */
const HOLD = 0.5;

/**
 * Contact page H1: a fixed lead with the final phrase rotating (GSAP).
 *
 * All phrases share one grid cell, so the slot is always as wide and tall as the longest phrase: nothing reflows
 * or shifts as they change. "Software." is the visible default in the server HTML (no-JS, reduced motion) and the
 * only phrase assistive tech reads; the others are decorative. The loop pauses while the heading is offscreen.
 */
export function ContactHeadline({ id }: { id: string }) {
  const root = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const words = gsap.utils.toArray<HTMLElement>("[data-phrase]", root.current);
        // Start from a clean slate (a previous run's transform would otherwise be read back as an offset).
        gsap.set(words, { clearProps: "transform,opacity" });
        gsap.set(words, { yPercent: 60, opacity: 0 });
        gsap.set(words[0]!, { yPercent: 0, opacity: 1 });

        const tl = gsap.timeline({ repeat: -1 });
        words.forEach((word, i) => {
          const next = words[(i + 1) % words.length]!;
          tl.to(word, { yPercent: -60, opacity: 0, duration: 0.35, ease: "power2.in" }, `+=${HOLD}`).fromTo(
            next,
            { yPercent: 60, opacity: 0 },
            // Not rendered at build time: the last step's "from" would otherwise hide the first phrase up front.
            { yPercent: 0, opacity: 1, duration: 0.45, ease: "power3.out", immediateRender: false },
            "<0.2",
          );
        });

        const io = new IntersectionObserver(([entry]) => (entry?.isIntersecting ? tl.play() : tl.pause()));
        io.observe(root.current!);
        return () => io.disconnect();
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <h1 ref={root} id={id} className="text-[2.15rem] leading-[1.06] font-semibold tracking-[-0.035em] text-balance text-ink xs:text-[2.5rem] sm:text-6xl lg:text-[4.5rem]">
      {LEAD}{" "}
      <span className="inline-grid align-bottom whitespace-nowrap text-[#009CFF]">
        {PHRASES.map((phrase, i) => (
          <span
            key={phrase}
            data-phrase
            aria-hidden={i === 0 ? undefined : true}
            className={cn("col-start-1 row-start-1 pb-[0.08em]", i > 0 && "opacity-0")}
          >
            {phrase}.
          </span>
        ))}
      </span>
    </h1>
  );
}
