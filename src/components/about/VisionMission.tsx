"use client";

import { motion, type Transition } from "motion/react";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";

const INK = "#0b2e4a";
const BLUE = "#008cf8";
const EASE = [0.16, 1, 0.3, 1] as const;
const ICON_CLASS = "size-11 sm:size-13";

type IconProps = { timing: (delay: number, transition: Transition) => Transition };

/** The arrow flies in from the top-right and lands in the bullseye with a small overshoot. */
function TargetIcon({ timing }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={ICON_CLASS} aria-hidden="true" focusable="false">
      <g stroke={INK} strokeWidth="2.4">
        <circle cx="22" cy="26" r="18" />
        <circle cx="22" cy="26" r="11" stroke={BLUE} />
      </g>
      <circle cx="22" cy="26" r="4" fill={BLUE} />
      <motion.g
        variants={{ hidden: { x: 16, y: -16, opacity: 0 }, shown: { x: 0, y: 0, opacity: 1 } }}
        transition={timing(0.35, { type: "spring", stiffness: 300, damping: 15 })}
        stroke={INK}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 26 37 11" />
        <path d="M37 11V6l5-5v5h5l-5 5Z" fill="#fff" />
      </motion.g>
    </svg>
  );
}

/** The rocket climbs in along its own diagonal, then its speed lines draw out behind it. */
function RocketIcon({ timing }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={ICON_CLASS} aria-hidden="true" focusable="false">
      <motion.g
        variants={{ hidden: { x: -14, y: 14, opacity: 0 }, shown: { x: 0, y: 0, opacity: 1 } }}
        transition={timing(0.35, { duration: 0.65, ease: EASE })}
      >
        <g transform="rotate(45 24 24)" stroke={INK} strokeWidth="2.4" strokeLinejoin="round">
          <path d="M24 1c7 6 9 14 9 22v9H15v-9c0-8 2-16 9-22Z" fill="#fff" />
          <path d="m15 21-7 8v6l7-3M33 21l7 8v6l-7-3" />
          <circle cx="24" cy="15" r="4" stroke={BLUE} />
        </g>
      </motion.g>
      <g stroke={BLUE} strokeWidth="2.4" strokeLinecap="round">
        {["M15 33 8 40", "M19 37 8 48", "M11 29 4 36"].map((d, i) => (
          <motion.path
            key={d}
            d={d}
            variants={{ hidden: { pathLength: 0, opacity: 0 }, shown: { pathLength: 1, opacity: 1 } }}
            transition={timing(0.75 + i * 0.08, { duration: 0.35, ease: "easeOut" })}
          />
        ))}
      </g>
    </svg>
  );
}

const CARDS: { title: string; text: string; Icon: (props: IconProps) => ReactNode }[] = [
  {
    title: "Our Vision",
    text: "To make technology accessible and impactful, helping businesses grow through thoughtful digital innovation.",
    Icon: TargetIcon,
  },
  {
    title: "Our Mission",
    text: "To combine creative thinking, reliable engineering and close collaboration to build solutions that solve real business challenges.",
    Icon: RocketIcon,
  },
];

export function VisionMission() {
  const reduced = usePrefersReducedMotion();
  // Read when each reveal starts: the first render can't know the preference, so the hidden start state always applies.
  const timing = (delay: number, transition: Transition): Transition => (reduced ? { duration: 0 } : { ...transition, delay });

  return (
    <section aria-label="Our vision and mission" className="bg-bg-soft py-10 sm:py-14">
      <div className="container-x grid gap-5 lg:grid-cols-2 lg:gap-6">
        {CARDS.map(({ title, text, Icon }, index) => {
          const start = index * 0.14;
          const iconTiming: IconProps["timing"] = (delay, transition) => timing(start + delay, transition);
          return (
            <motion.article
              key={title}
              initial="hidden"
              whileInView="shown"
              viewport={{ once: true, amount: 0.4 }}
              variants={{ hidden: { opacity: 0, y: 24 }, shown: { opacity: 1, y: 0 } }}
              transition={timing(start, { duration: 0.6, ease: EASE })}
              className="flex items-center gap-4 rounded-2xl border border-line bg-white p-4 shadow-[0_18px_40px_-30px_rgb(8_40_60/0.35)] transition-[translate,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-accent/35 hover:shadow-[0_24px_46px_-26px_rgb(0_114_209/0.4)] motion-reduce:hover:translate-y-0 sm:gap-6 sm:p-6"
            >
              <motion.div
                variants={{ hidden: { scale: 0.7, opacity: 0 }, shown: { scale: 1, opacity: 1 } }}
                transition={timing(start + 0.15, { type: "spring", stiffness: 320, damping: 20 })}
                className="grid size-16 shrink-0 place-items-center rounded-2xl bg-bg-blue sm:size-20"
              >
                <Icon timing={iconTiming} />
              </motion.div>
              <motion.span
                variants={{ hidden: { scaleY: 0 }, shown: { scaleY: 1 } }}
                transition={timing(start + 0.25, { duration: 0.5, ease: EASE })}
                className="w-px self-stretch bg-accent/30"
                aria-hidden="true"
              />
              <motion.div
                variants={{ hidden: { opacity: 0, x: 12 }, shown: { opacity: 1, x: 0 } }}
                transition={timing(start + 0.3, { duration: 0.5, ease: EASE })}
                className="min-w-0"
              >
                <h2 className="text-xl font-bold tracking-[-0.015em] text-ink-deep sm:text-2xl">{title}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-ink sm:text-[15px]">{text}</p>
              </motion.div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
