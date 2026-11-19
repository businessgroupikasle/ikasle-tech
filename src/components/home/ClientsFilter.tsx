"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { clientIndustries, clients, type ClientIndustry } from "@/data/clients";
import { cn } from "@/lib/cn";
import { ClientCard } from "./ClientCard";

type Filter = "All" | ClientIndustry;

/** Only industries that have at least one client, so no filter ever shows an empty grid. */
const filters: Filter[] = ["All", ...clientIndustries.filter((industry) => clients.some((c) => c.industry === industry))];
const countFor = (filter: Filter) => (filter === "All" ? clients.length : clients.filter((c) => c.industry === filter).length);

/**
 * Columns by number of logos, so one or two logos sit centred at normal card width instead of stretching or hugging
 * the left. Three or more: 2 per row on phones, 3 per row from lg. (Literal class strings so Tailwind generates them.)
 */
const gridCols: Record<number, string> = {
  1: "grid-cols-[minmax(0,calc((100%-0.75rem)/2))] sm:grid-cols-[minmax(0,calc((100%-1.5rem)/2))] lg:grid-cols-[minmax(0,calc((100%-3rem)/3))]",
  2: "grid-cols-2 lg:grid-cols-[repeat(2,minmax(0,calc((100%-3rem)/3)))]",
};

/**
 * Clientele page: an industry filter carousel above a logo grid.
 *
 * Filters: one line of toggle buttons (aria-pressed) that slides sideways — arrow buttons, swipe or trackpad — with
 * faded edges; the picked filter scrolls to the middle and its highlight slides between buttons. The result count is
 * announced politely.
 * Logos: 3 per row on desktop, 2 on phones; `auto-rows-fr` makes every card the same size. They animate in and out
 * when the filter changes (reduced motion via the site's MotionConfig).
 */
export function ClientsFilter() {
  const [active, setActive] = useState<Filter>("All");
  const shown = active === "All" ? clients : clients.filter((c) => c.industry === active);

  const rail = useRef<HTMLDivElement>(null);
  const buttons = useRef<Partial<Record<Filter, HTMLButtonElement | null>>>({});
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const measure = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [measure]);

  const slide = (direction: 1 | -1) => {
    const el = rail.current;
    if (el) el.scrollBy({ left: direction * el.clientWidth * 0.7 });
  };

  const pick = (filter: Filter) => {
    setActive(filter);
    // Bring the picked filter to the middle of the rail (horizontal only; the page itself doesn't move).
    const el = rail.current;
    const btn = buttons.current[filter];
    if (el && btn) el.scrollTo({ left: btn.offsetLeft - (el.clientWidth - btn.offsetWidth) / 2 });
  };

  const arrow =
    "absolute top-1/2 z-10 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-line bg-white text-ink shadow-[0_6px_16px_-8px_rgb(8_40_60/0.35)] transition-[opacity,color,border-color] duration-200 hover:border-accent/50 hover:text-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

  return (
    <>
      {/* ---------- Industry filter carousel ---------- */}
      <div className="relative mx-auto mb-10 max-w-5xl sm:mb-12">
        <button
          type="button"
          onClick={() => slide(-1)}
          aria-label="Scroll industries left"
          tabIndex={canPrev ? 0 : -1}
          aria-hidden={!canPrev}
          className={cn(arrow, "-left-1 sm:-left-5", canPrev ? "opacity-100" : "pointer-events-none opacity-0")}
        >
          <ChevronLeft className="size-4.5" aria-hidden="true" />
        </button>

        <div
          ref={rail}
          onScroll={measure}
          role="group"
          aria-label="Filter clients by industry"
          className={cn(
            "overflow-x-auto scroll-smooth px-1 py-2 [scrollbar-width:none] motion-reduce:scroll-auto [&::-webkit-scrollbar]:hidden",
            // Fade whichever edge has more filters beyond it.
            canPrev && canNext && "mask-[linear-gradient(90deg,transparent,#000_56px,#000_calc(100%-56px),transparent)]",
            canPrev && !canNext && "mask-[linear-gradient(90deg,transparent,#000_56px)]",
            !canPrev && canNext && "mask-[linear-gradient(90deg,#000_calc(100%-56px),transparent)]",
          )}
        >
          <ul className="mx-auto flex w-max gap-2">
            {filters.map((filter) => {
              const isActive = filter === active;
              return (
                <li key={filter}>
                  <button
                    ref={(el) => {
                      buttons.current[filter] = el;
                    }}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => pick(filter)}
                    className={cn(
                      "relative inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[14px] font-medium whitespace-nowrap transition-colors duration-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent",
                      isActive ? "border-transparent text-white" : "border-line bg-white text-ink-soft hover:border-accent/40 hover:text-ink",
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="client-filter-active"
                        className="absolute inset-0 rounded-full bg-accent-strong shadow-[0_8px_20px_-10px_rgb(0_110_200/0.8)]"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                        aria-hidden="true"
                      />
                    )}
                    <span className="relative">{filter}</span>
                    <span
                      className={cn(
                        "relative grid min-w-5 place-items-center rounded-full px-1.5 font-mono text-[11px] leading-5 tabular-nums transition-colors duration-300",
                        isActive ? "bg-white/20 text-white" : "bg-bg-soft text-ink-soft",
                      )}
                    >
                      {countFor(filter)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <button
          type="button"
          onClick={() => slide(1)}
          aria-label="Scroll industries right"
          tabIndex={canNext ? 0 : -1}
          aria-hidden={!canNext}
          className={cn(arrow, "-right-1 sm:-right-5", canNext ? "opacity-100" : "pointer-events-none opacity-0")}
        >
          <ChevronRight className="size-4.5" aria-hidden="true" />
        </button>
      </div>

      <p className="sr-only" aria-live="polite">
        {active === "All" ? `Showing all ${shown.length} clients` : `Showing ${shown.length} ${shown.length === 1 ? "client" : "clients"} in ${active}`}
      </p>

      {/* ---------- Logo grid ---------- */}
      <motion.ul layout className={cn("grid auto-rows-fr justify-center gap-3 sm:gap-6", gridCols[shown.length] ?? "grid-cols-2 lg:grid-cols-3")}>
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((client) => (
            <motion.li
              key={client.slug}
              layout
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex *:w-full"
            >
              <ClientCard client={client} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </>
  );
}
