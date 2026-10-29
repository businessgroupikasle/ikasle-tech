"use client";

import { lazy, Suspense, useState, type PointerEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MessageCircle, X } from "lucide-react";

const ChatWindow = lazy(() => import("./ChatWindow"));

export function ChatbotShell() {
  const [open, setOpen] = useState(false);
  const highlight = (event: PointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };
  return (
    <div className="fixed right-[max(16px,env(safe-area-inset-right))] bottom-[max(16px,env(safe-area-inset-bottom))] z-[80] sm:right-6 sm:bottom-6">
      <AnimatePresence>{open && <Suspense fallback={null}><ChatWindow onClose={() => setOpen(false)} /></Suspense>}</AnimatePresence>
      <motion.button
        type="button"
        aria-label={open ? "Close IKASLE AI Assistant" : "Open IKASLE AI Assistant"}
        aria-expanded={open}
        aria-controls="ikasle-chat-dialog"
        onClick={() => setOpen((value) => !value)}
        onPointerMove={highlight}
        initial={{ opacity: 0, scale: 0.8, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 360, damping: 26 }}
        whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}
        className="chat-launcher relative ml-auto flex size-[60px] items-center justify-center overflow-hidden rounded-full border border-[#4db3ff]/55 bg-[#061c30] text-white shadow-[0_16px_42px_-12px_rgb(0_86_160/0.65)] sm:size-16"
      >
        <span className="chat-launcher-highlight absolute inset-0" aria-hidden="true" />
        <span className="chat-launcher-ring absolute inset-[-2px] rounded-full" aria-hidden="true" />
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={open ? "close" : "open"} initial={{ opacity: 0, rotate: -25, scale: 0.7 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, rotate: 25, scale: 0.7 }} className="relative">
            {open ? <X className="size-6" /> : <MessageCircle className="size-8" aria-hidden="true" />}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
