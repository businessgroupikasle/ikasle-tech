"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { ChatbotShell } from "@/components/chatbot/ChatbotShell";
import { FloatingActions } from "@/components/layout/FloatingActions";
import "@/components/chatbot/chatbot.css";

/** `reducedMotion="user"` makes every Motion animation honour prefers-reduced-motion. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      {children}
      <FloatingActions />
      <ChatbotShell />
    </MotionConfig>
  );
}
