import { motion } from "motion/react";
import { cn } from "@/lib/cn";

export function ChatAvatar({ state = "idle", className }: { state?: "idle" | "thinking" | "responding" | "error"; className?: string }) {
  return (
    <span className={cn("chat-core relative inline-flex size-10 shrink-0 items-center justify-center rounded-[14px]", className)} data-state={state} aria-hidden="true">
      <motion.span className="chat-core-ring absolute inset-1 rounded-full border border-[#4db3ff]/60" animate={state === "thinking" ? { rotate: 360 } : undefined} transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }} />
      <span className="relative font-mono text-[15px] font-semibold tracking-[-0.14em] text-white">{"<·>"}</span>
    </span>
  );
}

