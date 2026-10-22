"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

type Chapter = { id: string; label: string; title: string; body: string };

/**
 * GSAP scroll storytelling for case studies: chapter labels stay sticky while
 * the body copy reveals line-block by line-block, and a rail tracks progress.
 */
export function CaseStory({ chapters }: { chapters: Chapter[] }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>("[data-chapter]").forEach((ch) => {
          gsap.from(ch.querySelectorAll("[data-reveal]"), {
            y: 36,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: { trigger: ch, start: "top 78%", once: true },
          });
        });
        gsap.fromTo(
          "[data-story-rail]",
          { scaleY: 0 },
          { scaleY: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top 60%", end: "bottom 60%", scrub: 0.5 } },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative">
      <span className="absolute top-0 bottom-0 left-0 hidden w-px bg-line lg:block" aria-hidden="true" />
      <span data-story-rail className="absolute top-0 bottom-0 left-0 hidden w-px origin-top bg-gradient-to-b from-accent to-accent-2 lg:block" aria-hidden="true" />
      <div className="flex flex-col gap-16 sm:gap-24">
        {chapters.map((c, i) => (
          <section key={c.id} id={c.id} data-chapter aria-labelledby={`${c.id}-title`} className="grid gap-6 lg:grid-cols-[220px_1fr] lg:gap-16 lg:pl-10">
            <div>
              <p className="font-mono text-[12px] text-accent-strong lg:sticky lg:top-[calc(var(--header-h)+32px)]">
                {String(i + 1).padStart(2, "0")} / {c.label}
              </p>
            </div>
            <div className="max-w-2xl">
              <h2 id={`${c.id}-title`} data-reveal className="text-2xl font-semibold tracking-tight text-ink sm:text-[2rem] sm:leading-tight">
                {c.title}
              </h2>
              <p data-reveal className="mt-5 text-[17px] leading-relaxed text-ink-soft">
                {c.body}
              </p>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
