"use client";

import { motion } from "motion/react";
import { journeyMilestones, type JourneyMilestone } from "@/data/journey";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";
import { RevealGroup, RevealItem } from "./AboutReveal";

/** Seconds the line takes to travel from one milestone to the next. */
const STEP = 0.32;

function Milestone({ milestone, index, wide, reduced }: { milestone: JourneyMilestone; index: number; wide: boolean; reduced: boolean }) {
  const last = index === journeyMilestones.length - 1;
  // Side by side, the milestones appear in sequence as the line reaches them. Stacked, each one
  // is only revealed once it scrolls into view, so a delay would just look like lag.
  const delay = wide ? index * STEP : 0;
  // Read when the reveal starts: the first render can't know this preference, so the hidden start state always applies.
  const instant = { duration: 0 };

  return (
    <motion.li
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.3 }}
      aria-current={last ? "step" : undefined}
      className="relative pb-8 pl-14 last:pb-0 lg:pt-13 lg:pr-3 lg:pb-0 lg:pl-0 xl:pr-5"
    >
      {/* Connector to the next milestone. Clipping from the top-left reveals it in either orientation. */}
      <motion.span
        variants={{ hidden: { clipPath: "inset(0% 100% 100% 0%)" }, shown: { clipPath: "inset(0% 0% 0% 0%)" } }}
        transition={reduced ? instant : { delay, duration: wide ? STEP : 0.5, ease: "linear" }}
        className={cn(
          "absolute top-4.5 -bottom-4.5 left-4.25 w-0.5 bg-accent/60 lg:top-4.25 lg:bottom-auto lg:left-4.5 lg:h-0.5 lg:w-auto",
          last ? "hidden lg:right-0 lg:block lg:bg-linear-to-r lg:from-accent/60 lg:to-transparent" : "lg:-right-4.5",
        )}
        aria-hidden="true"
      />

      <motion.span
        variants={{ hidden: { scale: 0 }, shown: { scale: 1 } }}
        transition={reduced ? instant : { delay, type: "spring", stiffness: 420, damping: 20 }}
        className="absolute top-0 left-0 z-10 grid size-9 place-items-center"
        aria-hidden="true"
      >
        {last && <span className="absolute size-8 animate-ping rounded-full bg-accent/30 motion-reduce:hidden" />}
        <span className={cn("relative grid place-items-center rounded-full border bg-white shadow-[0_4px_12px_-4px_rgb(0_114_209/0.5)]", last ? "size-9 border-accent/60" : "size-7 border-accent/30")}>
          <span className={cn("rounded-full bg-accent", last ? "size-4" : "size-3")} />
        </span>
      </motion.span>

      <motion.div
        variants={{ hidden: { opacity: 0, y: 14 }, shown: { opacity: 1, y: 0 } }}
        transition={reduced ? instant : { delay: delay + 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        // Tablet: the text runs across the width in two columns, so a stacked timeline doesn't leave half the row empty.
        className="md:grid md:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] md:gap-8 lg:block"
      >
        <h3 className="text-base leading-snug font-bold text-balance text-ink-deep lg:text-[15px] xl:text-base">
          <span className={cn("mb-1 block text-[1.375rem] leading-none tracking-[-0.01em] lg:text-xl xl:text-[1.375rem]", last && "text-accent-strong")}>{milestone.year}</span>
          {milestone.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink md:mt-6 lg:mt-2 lg:text-[13px] xl:text-sm">{milestone.description}</p>
      </motion.div>
    </motion.li>
  );
}

export function OurJourney() {
  const reduced = usePrefersReducedMotion();
  const wide = useMediaQuery("(min-width: 1024px)");

  return (
    <section id="our-journey" aria-labelledby="journey-title" className="relative overflow-hidden bg-[linear-gradient(100deg,#f1f8ff_0%,#e6f4ff_100%)] py-14 sm:py-16">
      <svg viewBox="0 0 1000 200" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 size-full" aria-hidden="true" focusable="false">
        <g fill="none" stroke="#008cf8" strokeOpacity=".12">
          <path vectorEffect="non-scaling-stroke" d="M0 130C60 150 90 175 120 200" />
          <path vectorEffect="non-scaling-stroke" d="M760 200C840 110 910 50 1000 20" />
          <path vectorEffect="non-scaling-stroke" d="M820 200C880 130 930 90 1000 62" />
        </g>
      </svg>

      <div className="container-x relative">
        <RevealGroup kind="rise">
          <h2 id="journey-title" className="text-lg font-bold tracking-[0.04em] text-ink-deep uppercase sm:text-xl">
            Our Journey
            <RevealItem as="span" kind="bar" delay={0.2} className="mt-2.5 block h-0.75 w-14 origin-left rounded-full bg-accent" aria-hidden />
          </h2>
        </RevealGroup>

        <ol className="mt-9 grid lg:grid-cols-7">
          {journeyMilestones.map((milestone, index) => (
            <Milestone key={milestone.year} milestone={milestone} index={index} wide={wide} reduced={reduced} />
          ))}
        </ol>
      </div>
    </section>
  );
}
