"use client";

import { motion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";

/** Becomes true after the first page has mounted; later mounts are client-side navigations. */
let hasNavigated = false;

/**
 * Route-enter transition, mounted from app/template.tsx so it re-runs on every navigation.
 * The first load renders with no initial hidden state, so server HTML is visible immediately
 * (otherwise the whole page would wait for hydration, wrecking LCP).
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const [animateIn] = useState(() => hasNavigated);

  useEffect(() => {
    hasNavigated = true;
  }, []);

  return (
    <motion.div
      initial={animateIn ? { opacity: 0, y: 12 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
