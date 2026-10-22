"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CursorGrid } from "@/components/effects/CursorGrid";
import { useInViewport } from "@/hooks/useInViewport";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";
import { useWebGL2Support } from "@/hooks/useWebGL2Support";
import { brand } from "@/lib/brand";
import { processSteps } from "./ProcessVisuals";
import { cn } from "@/lib/cn";

/** A phase becomes active once its marker crosses this line (fraction of the viewport height). */
const READING_LINE = 0.55;

/**
 * Scroll-driven delivery timeline.
 *
 * One source of truth: a single ScrollTrigger calls `measure()` on every scroll update and refresh.
 * `measure()` reads the *live* positions of the six phase markers (nothing is cached, so layout shifts
 * above the section can never desynchronise it), derives the active phase — the last marker whose centre
 * has crossed the reading line — and the progress-line length between the first and last marker centres.
 * Everything else (label, chips, markers, emphasis, preview) is derived from that one `active` index.
 *
 * Layout: desktop has a sticky preview on the left and the steps on the right; below 1024px each step
 * shows its own preview inline. The line and markers work at every width.
 * Background: React Bits <CursorGrid /> on mouse devices with WebGL2 (lazy, near the viewport);
 * otherwise a static CSS grid.
 */
export function ProcessTimeline() {
  const root = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const trackRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const markerRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [active, setActive] = useState(0);

  const webgl2 = useWebGL2Support();
  const reducedMotion = usePrefersReducedMotion();
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const near = useInViewport(root, { rootMargin: "200px", once: true });
  const gridOn = Boolean(webgl2) && !reducedMotion && finePointer && near;

  useGSAP(
    () => {
      const list = listRef.current;
      const track = trackRef.current;
      const fill = fillRef.current;
      if (!list || !track || !fill) return;
      const setFill = gsap.quickSetter(fill, "scaleY");

      const measure = () => {
        const markers = markerRefs.current.filter((m): m is HTMLSpanElement => m !== null);
        if (markers.length < 2) return;
        const centres = markers.map((m) => {
          const r = m.getBoundingClientRect();
          return r.top + r.height / 2;
        });
        const first = centres[0]!;
        const last = centres[centres.length - 1]!;
        const line = window.innerHeight * READING_LINE;

        let index = 0;
        centres.forEach((c, i) => {
          if (c <= line) index = i;
        });
        setActive((prev) => (prev === index ? prev : index));

        // Track spans marker centre to marker centre, positioned relative to the list.
        const listTop = list.getBoundingClientRect().top;
        const span = Math.max(0, last - first);
        for (const el of [track, fill]) {
          el.style.top = `${first - listTop}px`;
          el.style.height = `${span}px`;
        }
        setFill(span > 0 ? gsap.utils.clamp(0, 1, (line - first) / span) : 0);
      };

      const trigger = ScrollTrigger.create({
        trigger: list,
        start: "top bottom",
        end: "bottom top",
        onUpdate: measure,
        onRefresh: measure,
      });
      // Re-measure when the steps (or anything above them) change size without a scroll.
      const resize = new ResizeObserver(measure);
      resize.observe(list);
      resize.observe(document.body);
      measure();

      return () => {
        trigger.kill();
        resize.disconnect();
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="process-title" className="relative isolate bg-bg-soft">
      {/* Static grid for touch devices, reduced motion and browsers without WebGL2. */}
      {!gridOn && <div className="process-grid-fallback pointer-events-none absolute inset-0" aria-hidden="true" />}
      <CursorGrid
        enabled={gridOn}
        cellSize={56}
        color={brand.blue}
        gridColor={brand.navy}
        highlight="area"
        gridStyle="lines"
        radius={150}
        falloff="smooth"
        holdTime={350}
        fadeDuration={750}
        lineWidth={1}
        maxOpacity={0.32}
        fillOpacity={0.025}
        gridOpacity={0.045}
        spotlight={0.4}
        clickPulse
        pulseSpeed={550}
        ambient={0}
        edgeFade={0.12}
        intro
        lightMode
      >
        <div className="container-x relative py-24 sm:py-32">
          <SectionHeading
            id="process-title"
            eyebrow="How we build software"
            path="process.ts"
            title="From Idea to Production."
            description="A predictable delivery process with working software at every step — not a big reveal at the end."
          />

          {/* Compact phase index */}
          <ol className="mt-12 hidden flex-wrap items-center gap-2 font-mono text-[13px] lg:flex" aria-label="Delivery phases">
            {processSteps.map((s, i) => (
              <li key={s.id} className="flex items-center gap-2">
                <span
                  className={cn("rounded-full border px-3 py-1 transition-colors duration-300", i <= active ? "border-accent/30 bg-accent-strong text-white" : "border-line bg-white text-ink-soft")}
                  aria-current={i === active ? "step" : undefined}
                >
                  {s.title}
                </span>
                {i < processSteps.length - 1 && <span className={cn("transition-colors", i < active ? "text-accent-strong" : "text-line")} aria-hidden="true">→</span>}
              </li>
            ))}
          </ol>

          <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Sticky preview (desktop): all six stacked in one cell, only the active one shown — no
                queued exit animations, so it always matches the active phase. */}
            <div className="hidden min-w-0 lg:block">
              <div className="sticky top-[max(calc(var(--header-h)+40px),calc(50vh-200px))]">
                <div className="grid">
                  {processSteps.map((s, i) => {
                    const Visual = s.Visual;
                    const shown = i === active;
                    return (
                      <div
                        key={s.id}
                        data-preview={s.id}
                        aria-hidden={!shown}
                        inert={!shown}
                        className={cn(
                          "col-start-1 row-start-1 transition-[opacity,transform] duration-300 ease-out",
                          shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0",
                        )}
                      >
                        <Visual />
                      </div>
                    );
                  })}
                </div>
                <p className="mt-4 font-mono text-[12px] text-ink-soft" aria-live="polite">
                  phase {active + 1}/{processSteps.length} · {processSteps[active]!.title.toLowerCase()}
                </p>
              </div>
            </div>

            {/* Steps with the progress line (track + fill span marker centre to marker centre). */}
            <ol ref={listRef} data-steps className="relative flex min-w-0 flex-col gap-6 lg:gap-0">
              <span ref={trackRef} className="absolute left-[19px] w-0.5 rounded-full bg-line" aria-hidden="true" />
              <span ref={fillRef} data-progress-fill className="absolute left-[19px] w-0.5 origin-top scale-y-0 rounded-full bg-accent" aria-hidden="true" />
              {processSteps.map((s, i) => {
                const Visual = s.Visual;
                const state = i < active ? "done" : i === active ? "current" : "upcoming";
                return (
                  <li key={s.id} data-step className="relative pl-14 lg:flex lg:min-h-[44vh] lg:items-center" aria-current={i === active ? "step" : undefined}>
                    <span
                      ref={(el) => {
                        markerRefs.current[i] = el;
                      }}
                      data-marker={state}
                      className={cn(
                        "absolute top-0 left-0 z-10 inline-flex size-10 items-center justify-center rounded-full border-2 font-mono text-[13px] font-semibold transition-[background-color,border-color,color,box-shadow] duration-300 lg:top-1/2 lg:-translate-y-1/2",
                        state === "current" && "border-accent-strong bg-accent-strong text-white shadow-[0_0_0_6px_rgb(0_140_248/0.15)]",
                        state === "done" && "border-accent bg-white text-accent-strong",
                        state === "upcoming" && "border-[#CBD9E6] bg-white text-ink-soft",
                      )}
                      aria-hidden="true"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className={cn("transition-opacity duration-300", i === active ? "lg:opacity-100" : "lg:opacity-40")}>
                      <h3 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{s.title}</h3>
                      <p className="mt-2 max-w-md text-[16px] leading-relaxed text-ink-soft">{s.summary}</p>
                      <div className="mt-5 lg:hidden">
                        <Visual />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </CursorGrid>
    </section>
  );
}
