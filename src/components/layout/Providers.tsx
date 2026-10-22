"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { ClickEffect } from "@/components/effects/ClickEffect";

/** `reducedMotion="user"` makes every Motion animation honour prefers-reduced-motion. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      {children}
      <ClickEffect />
    </MotionConfig>
  );
}
