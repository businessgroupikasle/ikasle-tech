"use client";

import { animate, useInView } from "motion/react";
import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Counts up to `value` once visible. Used only for sample numbers inside
 * illustrative dashboards — never for business metrics.
 */
export function AnimatedCounter({ value, decimals = 0, prefix = "", suffix = "", duration = 1.4, className }: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5% 0px" });
  const reduced = usePrefersReducedMotion();
  const format = (n: number) => `${prefix}${n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    if (reduced) {
      el.textContent = format(value);
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        el.textContent = format(v);
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- format is derived from the listed props
  }, [inView, reduced, value, duration]);

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}
