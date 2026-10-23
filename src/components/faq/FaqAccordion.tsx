"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export type FaqItem = { id: string; question: string; answer: ReactNode };

/**
 * Accessible accordion: each question is a button with aria-expanded/aria-controls; answers are labelled
 * regions. Items open independently. Motion animates height/opacity (reduced motion is respected through
 * the site's MotionConfig).
 */
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<Set<string>>(() => new Set());
  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="divide-y divide-line overflow-hidden rounded-[24px] border border-line bg-white shadow-soft">
      {items.map((item, i) => {
        const isOpen = open.has(item.id);
        const buttonId = `faq-q-${item.id}`;
        const panelId = `faq-a-${item.id}`;
        return (
          <div key={item.id}>
            <h2 className="m-0">
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="group flex w-full items-center gap-4 px-5 py-5 text-left transition-colors hover:bg-bg-soft focus-visible:bg-bg-soft focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent sm:px-7"
              >
                <span className="font-mono text-[12px] text-accent-strong">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1 text-[17px] leading-snug font-semibold text-ink">{item.question}</span>
                <span
                  className={cn(
                    "inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-line text-ink-soft transition-[transform,background-color,color,border-color] duration-300",
                    isOpen && "rotate-180 border-transparent bg-accent-strong text-white",
                  )}
                  aria-hidden="true"
                >
                  <ChevronDown className="size-4" />
                </span>
              </button>
            </h2>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  key="panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-6 pl-[3.25rem] text-[16px] leading-relaxed text-ink-soft sm:px-7 sm:pl-[3.75rem]">{item.answer}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
