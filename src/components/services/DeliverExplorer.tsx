"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, Pause, Play } from "lucide-react";
import type { ServicePage } from "@/data/service-pages";
import { useInViewport } from "@/hooks/useInViewport";
import { cn } from "@/lib/cn";
import { deliverIcons } from "./deliver-icons";

type Item = NonNullable<ServicePage["deliver"]>["items"][number];

/** How long each item stays on screen while the explorer plays by itself. */
const STEP_MS = 5000;
const num = (i: number) => String(i + 1).padStart(2, "0");

/** Title, description, optional bullet points and footer line of the spotlight panel. */
function PanelBody({ item, heading }: { item: Item; heading: boolean }) {
  const Title = heading ? "h3" : "p";
  return (
    <>
      <Title className="mt-10 text-[1.9rem] leading-tight font-semibold tracking-[-0.03em] text-balance text-white">{item.title}</Title>
      <p className="mt-4 max-w-md text-[16.5px] leading-relaxed text-[#B7CCDD]">{item.text}</p>
      {item.points && (
        <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
          {item.points.map((point) => (
            <li key={point} className="flex gap-2.5 text-[14.5px] leading-snug text-editor-text">
              <Check className="mt-0.5 size-4 shrink-0 text-accent-2" aria-hidden="true" />
              {point}
            </li>
          ))}
        </ul>
      )}
      <p className="mt-auto pt-8 font-mono text-[12px] text-editor-muted">{"// built around your business"}</p>
    </>
  );
}

/**
 * "What We Build" as an interactive explorer instead of a card grid.
 *
 * Desktop: a numbered list on the left (accessible tabs; arrow keys move between them) drives a dark "spotlight"
 * panel on the right with a large animated icon. It keeps advancing every few seconds while on screen — a click
 * jumps to that item and it carries on from there. It holds still only while keyboard focus is inside or after the
 * visitor presses the pause button. Reduced motion still advances; only the decorative motion is dropped.
 * Below lg: a plain numbered list with icons, where every description is visible.
 */
export function DeliverExplorer({ items }: { items: Item[] }) {
  const uid = useId();
  const root = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  /** Visitor pressed the pause button. */
  const [paused, setPaused] = useState(false);
  /** Keyboard focus is inside the explorer (mouse clicks don't count), so it holds still while someone reads with keys. */
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const inView = useInViewport(root, { rootMargin: "0px" });
  const playing = inView && !paused && !keyboardFocus;

  // Restarts on every change of `active`, so after a click it carries on from the picked item.
  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => setActive((a) => (a + 1) % items.length), STEP_MS);
    return () => window.clearTimeout(timer);
  }, [playing, active, items.length]);

  const pick = (i: number, moveFocus = false) => {
    setActive(i);
    if (moveFocus) tabs.current[i]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = items.length - 1;
    const next = { ArrowDown: i === last ? 0 : i + 1, ArrowUp: i === 0 ? last : i - 1, Home: 0, End: last }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    pick(next, true);
  };

  const item = items[active];
  if (!item) return null;
  const ActiveIcon = deliverIcons[item.icon];

  return (
    <>
      {/* ---------- Desktop explorer ---------- */}
      <div
        ref={root}
        data-reveal
        className="mt-10 hidden gap-12 lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] xl:gap-16"
        onFocus={(e) => setKeyboardFocus(e.target.matches(":focus-visible"))}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setKeyboardFocus(false);
        }}
      >
        <div role="tablist" aria-orientation="vertical" aria-label="What we develop" className="flex flex-col border-t border-line">
          {items.map((it, i) => {
            const isActive = i === active;
            return (
              <button
                key={it.title}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                id={`${uid}-tab-${i}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`${uid}-panel`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => pick(i)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className="group relative flex items-center gap-5 border-b border-line py-5 pr-2 pl-6 text-left transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
              >
                {isActive && (
                  <motion.span
                    layoutId={`${uid}-marker`}
                    className="absolute top-3 bottom-3 left-0 w-0.75 rounded-full bg-accent-strong"
                    transition={{ type: "spring", stiffness: 420, damping: 36 }}
                    aria-hidden="true"
                  />
                )}
                <span className={cn("font-mono text-[13px] tabular-nums transition-colors", isActive ? "text-accent-strong" : "text-ink-soft/70")}>{num(i)}</span>
                <span
                  className={cn(
                    "flex-1 text-[17px] leading-snug font-semibold transition-colors duration-300",
                    isActive ? "text-ink" : "text-ink-soft group-hover:text-ink",
                  )}
                >
                  {it.title}
                </span>
                <ArrowRight
                  className={cn(
                    "size-4.5 shrink-0 transition-[opacity,translate,color] duration-300",
                    isActive ? "translate-x-0 text-accent-strong opacity-100" : "-translate-x-2 text-ink-soft opacity-0 group-hover:translate-x-0 group-hover:opacity-60",
                  )}
                  aria-hidden="true"
                />
                {/* Countdown to the next item while the explorer plays by itself. */}
                {isActive && playing && (
                  <span key={active} className="svc-explorer-progress absolute -bottom-px left-0 h-0.5 w-full origin-left bg-accent-strong" style={{ animationDuration: `${STEP_MS}ms` }} aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>

        <div
          id={`${uid}-panel`}
          role="tabpanel"
          aria-labelledby={`${uid}-tab-${active}`}
          className="on-dark relative flex min-h-110 flex-col overflow-hidden rounded-[28px] bg-editor p-10 xl:p-12"
        >
          {/* Backdrop: faint grid and a glow behind the icon. */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07] bg-[linear-gradient(#4db3ff_1px,transparent_1px),linear-gradient(90deg,#4db3ff_1px,transparent_1px)] bg-size-[36px_36px] mask-[radial-gradient(ellipse_at_30%_30%,#000_20%,transparent_75%)]"
            aria-hidden="true"
          />
          <div className="pointer-events-none absolute -top-24 -left-16 size-80 rounded-full bg-accent/30 blur-[100px]" aria-hidden="true" />

          {/* Every item is also laid out invisibly in the same grid cell, so the panel is always as tall as its
              tallest item and never changes size while it cycles. */}
          <div className="relative grid flex-1">
            {items.map((it) => (
              <div key={it.title} className="invisible col-start-1 row-start-1 flex flex-col" aria-hidden="true">
                <div className="h-28" />
                <PanelBody item={it} heading={false} />
              </div>
            ))}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative col-start-1 row-start-1 flex flex-col"
            >
              <div className="flex items-start justify-between">
                {/* Icon orb with two counter-rotating dashed rings. */}
                <div className="relative grid size-28 place-items-center" aria-hidden="true">
                  <span className="svc-orbit absolute -inset-3.5 rounded-full border border-dashed border-accent-2/25" />
                  <span className="svc-orbit-reverse absolute inset-0 rounded-full border border-dashed border-accent-2/45" />
                  <motion.span
                    initial={{ scale: 0.6, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                    className="grid size-20 place-items-center rounded-full bg-linear-to-br from-accent to-accent-strong shadow-[0_0_48px_-6px_rgb(0_140_248/0.75)]"
                  >
                    <ActiveIcon className="size-9 text-white" strokeWidth={1.6} />
                  </motion.span>
                </div>
                <p className="font-mono text-[13px] text-editor-muted tabular-nums">
                  <span className="text-accent-2">{num(active)}</span> / {num(items.length - 1)}
                </p>
              </div>

              <PanelBody item={item} heading />
            </motion.div>
          </AnimatePresence>
          </div>

          {/* Pause / play for the auto-advance (outside the animated content so it never fades out). */}
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Play: move through the items automatically" : "Pause: stop moving through the items automatically"}
            className="absolute right-8 bottom-8 grid size-9 place-items-center rounded-full border border-editor-line bg-editor-panel text-editor-text transition-colors hover:border-accent-2/60 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2 xl:right-10 xl:bottom-10"
          >
            {paused ? <Play className="size-3.5 translate-x-px" aria-hidden="true" /> : <Pause className="size-3.5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* ---------- Phones and tablets: numbered list, everything visible ---------- */}
      <ol className="mt-8 border-t border-line lg:hidden">
        {items.map((it, i) => {
          const ItemIcon = deliverIcons[it.icon];
          return (
            <li key={it.title} data-reveal className="flex gap-4 border-b border-line py-6">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-bg-blue text-accent-strong" aria-hidden="true">
                <ItemIcon className="size-5" strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <p className="font-mono text-[12px] text-accent-strong">{num(i)}</p>
                <h3 className="mt-1 text-[17px] leading-snug font-semibold text-ink">{it.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{it.text}</p>
                {it.points && (
                  <ul className="mt-3 flex flex-col gap-1.5">
                    {it.points.map((point) => (
                      <li key={point} className="flex gap-2 text-[14px] leading-snug text-ink">
                        <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
                        {point}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </>
  );
}
