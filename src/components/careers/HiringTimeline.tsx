"use client";

import { useRef, type CSSProperties } from "react";
import { BadgeCheck, ClipboardCheck, FileSearch, MessagesSquare, Send, type LucideIcon } from "lucide-react";
import { hiringSteps } from "@/data/careers";
import { useInViewport } from "@/hooks/useInViewport";
import { cn } from "@/lib/cn";
import "./careers.css";

const icons: LucideIcon[] = [Send, FileSearch, MessagesSquare, ClipboardCheck, BadgeCheck];

/**
 * The 5-step hiring process. Desktop: a horizontal timeline whose connecting line draws across, with dashes flowing
 * along it, as each step's icon pops in turn. Phones/tablets: the same steps stacked vertically on a vertical line.
 * Pass `assessmentNote` (job pages) to describe that role's assessment under step 4.
 */
export function HiringTimeline({ assessmentNote, className }: { assessmentNote?: string; className?: string }) {
  const root = useRef<HTMLOListElement>(null);
  const loaded = useInViewport(root, { rootMargin: "0px 0px -15% 0px", once: true });
  const inset = `calc(100% / ${hiringSteps.length * 2})`;

  return (
    <ol ref={root} className={cn("relative grid gap-8 lg:grid-cols-5 lg:gap-4", loaded && "is-loaded", className)}>
      {/* Connecting line: horizontal through the icons on desktop, vertical beside them on smaller screens. */}
      <span className="pointer-events-none absolute top-8 hidden h-0.5 lg:block" style={{ left: inset, right: inset }} aria-hidden="true">
        <span className="careers-timeline-line absolute inset-0 rounded-full bg-accent/20" />
        <span className="careers-timeline-line careers-timeline-flow absolute inset-0 opacity-70" />
      </span>
      <span className="pointer-events-none absolute top-8 bottom-8 left-8 w-0.5 -translate-x-1/2 lg:hidden" aria-hidden="true">
        <span className="careers-timeline-flow-y absolute inset-0 opacity-60" />
      </span>

      {hiringSteps.map((step, i) => {
        const Icon = icons[i] ?? Send;
        const delay = { "--d": `${0.35 + i * 0.22}s` } as CSSProperties;
        return (
          <li key={step.title} className="careers-timeline-step relative flex gap-5 lg:flex-col lg:items-center lg:gap-0 lg:text-center" style={delay}>
            <span className="careers-timeline-node relative grid size-16 shrink-0 place-items-center rounded-full bg-white ring-1 ring-accent/20" style={delay}>
              <span className="grid size-12 place-items-center rounded-full bg-linear-to-br from-accent to-accent-strong text-white shadow-[0_12px_26px_-12px_rgb(0_110_200/0.85)]">
                <Icon className="size-5.5" strokeWidth={1.9} aria-hidden="true" />
              </span>
            </span>
            <div className="min-w-0 pt-1 lg:pt-0">
              <p className="font-mono text-[12px] font-semibold text-accent-strong lg:mt-5">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-1 text-[16.5px] leading-snug font-semibold text-ink">{step.title}</h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft lg:mx-auto lg:max-w-52">{i === 3 && assessmentNote ? assessmentNote : step.text}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
