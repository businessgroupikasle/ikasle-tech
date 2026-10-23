"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  children: ReactNode;
  className?: string;
  /** Entrance delay in seconds. */
  delay?: number;
  /** Idle float amplitude in px. */
  amplitude?: number;
  duration?: number;
};

/**
 * Entrance (opacity/scale) is Motion-owned on the outer element; the endless idle float is a
 * CSS transform animation on the inner one — it runs on the compositor, costs no JS per frame,
 * and the two never animate the same element.
 */
export function FloatingCard({ children, className, delay = 0, amplitude = 8, duration = 6 }: Props) {
  return (
    <motion.div
      className={cn("pointer-events-auto", className)}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="float-idle"
        style={{ "--float-amp": `${-amplitude}px`, animationDuration: `${duration}s`, animationDelay: `${delay + 0.8}s` } as React.CSSProperties}
      >
        {children}
      </div>
    </motion.div>
  );
}
