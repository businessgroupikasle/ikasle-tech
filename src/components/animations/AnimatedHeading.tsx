"use client";

import { Fragment, useRef, type ElementType } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

type Props = {
  text: string;
  id?: string;
  as?: ElementType;
  className?: string;
  /** Animate on mount instead of when scrolled into view (use for above-the-fold headings). */
  immediate?: boolean;
  delay?: number;
  /** Words (exact match, punctuation included) to render with the accent gradient. */
  highlight?: string[];
};

/**
 * GSAP-owned word-stagger reveal. Words remain real text nodes, so the heading
 * is fully readable by assistive tech and visible when JS or motion is off.
 */
export function AnimatedHeading({ text, id, as: Tag = "h2", className, immediate = false, delay = 0, highlight = [] }: Props) {
  const ref = useRef<HTMLElement>(null);
  const words = text.split(" ");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const targets = ref.current?.querySelectorAll<HTMLElement>("[data-word]");
        if (!targets?.length) return;
        gsap.from(targets, {
          yPercent: 110,
          opacity: 0,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.06,
          delay,
          scrollTrigger: immediate ? undefined : { trigger: ref.current, start: "top 88%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={className}>
      {words.map((word, i) => (
        // The space must sit outside the inline-block mask, or it collapses.
        <Fragment key={`${word}-${i}`}>
          <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <span data-word className={highlight.includes(word) ? "text-gradient inline-block" : "inline-block"}>
              {word}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}
