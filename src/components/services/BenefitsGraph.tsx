"use client";

import { useRef, type CSSProperties } from "react";
import { TrendingUp } from "lucide-react";
import type { ServicePage } from "@/data/service-pages";
import { useInViewport } from "@/hooks/useInViewport";
import { cn } from "@/lib/cn";
import { deliverIcons } from "./deliver-icons";

type Item = NonNullable<ServicePage["benefitDetails"]>["items"][number];

/** Brand-blue gradients for the round nodes, cycled in order (all within the site's blue palette). */
const nodeTones = [
  "from-sky-500 to-blue-700",
  "from-blue-500 to-indigo-600",
  "from-cyan-500 to-sky-700",
  "from-accent to-accent-strong",
  "from-indigo-500 to-blue-700",
  "from-sky-400 to-cyan-600",
  "from-blue-400 to-blue-700",
];

/**
 * Business Benefits as a connected graph: round, filled icon nodes on one line, joined by a connection line.
 *
 * Loading (once, when scrolled into view): the line draws left to right, then each node "loads" in turn — a
 * progress ring draws around it, the icon pops in and the title fades up. After that, dashes flow along the line
 * and a glowing dot travels across it. Hover / keyboard focus on a node pulses its ring and reveals its details;
 * devices without hover (phones, tablets) always show the details. Reduced motion: everything shown, no motion.
 */
export function BenefitsGraph({ items }: { items: Item[] }) {
  const root = useRef<HTMLDivElement>(null);
  const loaded = useInViewport(root, { rootMargin: "0px 0px -15% 0px", once: true });
  // The line runs from the centre of the first node to the centre of the last (each item is 1/n of the width).
  const lineInset = `calc(100% / ${items.length * 2})`;

  return (
    <div ref={root} className={cn("svc-graph relative mt-14", loaded && "is-loaded")}>
      {/* Connection line, desktop only (the nodes sit on one row there). */}
      <div className="pointer-events-none absolute top-11 hidden h-0.5 -translate-y-1/2 lg:block" style={{ left: lineInset, right: lineInset }} aria-hidden="true">
        <span className="svc-graph-line absolute inset-0 rounded-full bg-linear-to-r from-accent/25 via-accent/60 to-accent/25" />
        <span className="svc-graph-flow absolute inset-0" />
        <span className="svc-graph-dot absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_12px_3px_rgb(0_140_248/0.6)]" />
      </div>

      <ul className="relative flex flex-wrap justify-center gap-y-10 lg:flex-nowrap">
        {items.map((item, i) => {
          const NodeIcon = item.icon ? deliverIcons[item.icon] : TrendingUp;
          const timing = { "--d": `${0.35 + i * 0.18}s`, animationDelay: `${i * -0.5}s` } as CSSProperties;
          return (
            <li
              key={item.title}
              tabIndex={0}
              className="group flex w-1/2 flex-col items-center px-3 text-center outline-none sm:w-1/3 md:w-1/4 lg:w-auto lg:flex-1 lg:px-2"
              style={timing}
            >
              {/* Node: section-coloured disc (hides the line behind it), loading ring, and the filled icon core. */}
              <span className="relative grid size-22 place-items-center rounded-full bg-bg-soft group-focus-visible:outline-2 group-focus-visible:outline-offset-4 group-focus-visible:outline-accent" aria-hidden="true">
                <svg className="absolute inset-0 size-full -rotate-90" viewBox="0 0 88 88">
                  <circle cx="44" cy="44" r="42" fill="none" strokeWidth="2" className="stroke-accent/15" />
                  <circle cx="44" cy="44" r="42" fill="none" strokeWidth="2.5" strokeLinecap="round" className="svc-node-ring stroke-accent" />
                </svg>
                <span className="svc-benefit-ring absolute inset-2 rounded-full border-2 border-accent opacity-0" />
                <span
                  className={cn(
                    "svc-node-core relative grid size-16 place-items-center rounded-full bg-linear-to-br text-white shadow-[0_10px_24px_-10px_rgb(0_110_200/0.7)] transition-[scale] duration-300 group-hover:scale-110 group-focus-visible:scale-110",
                    nodeTones[i % nodeTones.length],
                  )}
                >
                  <NodeIcon className="svc-benefit-sway size-7" fill="currentColor" fillOpacity={0.3} strokeWidth={1.9} style={timing} />
                </span>
              </span>

              <div className="svc-node-text flex flex-col items-center">
                <h3 className="mt-5 text-[15.5px] leading-snug font-semibold text-ink transition-colors duration-300 group-hover:text-accent-strong group-focus-visible:text-accent-strong">
                  {item.title}
                </h3>
                {/* Hidden until hover/focus on devices that can hover; always visible on touch screens. */}
                <p className="svc-node-details mt-2 max-w-56 text-[13.5px] leading-relaxed text-ink-soft">{item.text}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
