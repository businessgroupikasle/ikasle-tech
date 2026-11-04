"use client";

import { motion, type Transition, type Variants } from "motion/react";
import type { CSSProperties, ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";

const EASE = [0.16, 1, 0.3, 1] as const;

type Kind = "rise" | "left" | "right" | "pop" | "zoom" | "bar" | "wipe";

const VARIANTS: Record<Kind, Variants> = {
  rise: { hidden: { opacity: 0, y: 22 }, shown: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: -28 }, shown: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 36 }, shown: { opacity: 1, x: 0 } },
  pop: { hidden: { opacity: 0, scale: 0.6 }, shown: { opacity: 1, scale: 1 } },
  zoom: { hidden: { scale: 1.12 }, shown: { scale: 1 } },
  bar: { hidden: { scaleX: 0 }, shown: { scaleX: 1 } },
  // Opens from the middle outwards, so it suits lines that sit at both edges.
  wipe: { hidden: { clipPath: "inset(0% 50% 0% 50%)" }, shown: { clipPath: "inset(0% 0% 0% 0%)" } },
};

const TRANSITIONS: Record<Kind, Transition> = {
  rise: { duration: 0.7, ease: EASE },
  left: { duration: 0.6, ease: EASE },
  right: { duration: 0.85, ease: EASE },
  pop: { type: "spring", stiffness: 320, damping: 18 },
  zoom: { duration: 1.3, ease: EASE },
  bar: { duration: 0.6, ease: EASE },
  wipe: { duration: 1.2, ease: EASE },
};

const TAGS = { div: motion.div, span: motion.span, li: motion.li };

type ItemProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  kind?: Kind;
  /** Seconds after the group comes into view. */
  delay?: number;
  as?: keyof typeof TAGS;
  "aria-hidden"?: boolean;
};

function useRevealTransition(kind: Kind, delay: number): Transition {
  const reduced = usePrefersReducedMotion();
  // Read when the reveal starts: the first render can't know this preference, so the hidden start state always applies.
  return reduced ? { duration: 0 } : { ...TRANSITIONS[kind], delay };
}

/** One part of a RevealGroup. It starts when the group scrolls into view, so server components can compose these freely. */
export function RevealItem({ kind = "rise", delay = 0, as = "div", ...rest }: ItemProps) {
  const Tag = TAGS[as];
  const transition = useRevealTransition(kind, delay);
  return <Tag variants={VARIANTS[kind]} transition={transition} {...rest} />;
}

/** Watches the viewport once and reveals every RevealItem inside it. Pass `kind` to animate the group's own box too. */
export function RevealGroup({ kind, className, amount = 0.25, children }: { kind?: Kind; className?: string; amount?: number; children: ReactNode }) {
  const transition = useRevealTransition(kind ?? "rise", 0);
  return (
    <motion.div
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount }}
      variants={kind ? VARIANTS[kind] : undefined}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
}
