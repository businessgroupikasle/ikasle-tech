"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Hand, MousePointer2 } from "lucide-react";
import { architectureLayers } from "@/data/architecture";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArchitectureStack } from "./ArchitectureStack";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/animations/Reveal";

export function ArchitectureSection() {
  const [selected, setSelected] = useState(0);
  const reduced = usePrefersReducedMotion();
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const layer = architectureLayers[selected]!;

  return (
    <section aria-labelledby="arch-title" className="relative overflow-hidden py-20 sm:py-24">
      <div className="ambient opacity-60" aria-hidden="true" />
      <div className="container-x relative grid items-center gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14">
        <Reveal className="flex min-w-0 flex-col gap-8">
          <SectionHeading
            id="arch-title"
            title="Technology That Scales With Your Vision."
            description="Every product we ship is built on clear, layered architecture. Select a layer to see what it does."
          />

          {/* Accessible layer selector — the source of truth for the diagram */}
          <div role="tablist" aria-label="Application layers" aria-orientation="vertical" className="flex flex-col gap-1.5">
            {architectureLayers.map((l, i) => (
              <button
                key={l.id}
                type="button"
                role="tab"
                id={`arch-tab-${l.id}`}
                aria-selected={i === selected}
                aria-controls="arch-panel"
                tabIndex={i === selected ? 0 : -1}
                onClick={() => setSelected(i)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                    e.preventDefault();
                    const next = (selected + (e.key === "ArrowDown" ? 1 : -1) + architectureLayers.length) % architectureLayers.length;
                    setSelected(next);
                    document.getElementById(`arch-tab-${architectureLayers[next]!.id}`)?.focus();
                  }
                }}
                className={cn(
                  "group flex items-center gap-4 rounded-2xl border px-4 py-3 text-left transition-[background-color,border-color,box-shadow] duration-200",
                  i === selected ? "border-accent/25 bg-white shadow-soft" : "border-transparent hover:bg-white/70",
                )}
              >
                <span className={cn("font-mono text-[12px]", i === selected ? "text-accent-strong" : "text-ink-soft")}>{String(i + 1).padStart(2, "0")}</span>
                <span
                  className={cn("size-2.5 rounded-full transition-[background-color,box-shadow] duration-200", i === selected ? "bg-accent shadow-[0_0_0_4px_rgb(0_140_248/0.15)]" : "bg-[#CBD9E6]")}
                  aria-hidden="true"
                />
                <span className={cn("font-semibold", i === selected ? "text-ink" : "text-ink-soft group-hover:text-ink")}>{l.title}</span>
                {i < architectureLayers.length - 1 && <span className="ml-auto font-mono text-[11px] text-ink-soft/60" aria-hidden="true">↓</span>}
              </button>
            ))}
          </div>

          <div id="arch-panel" role="tabpanel" aria-labelledby={`arch-tab-${layer.id}`} className="min-h-[124px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={layer.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }}>
                <p className="text-[16px] leading-relaxed text-ink-soft">
                  <strong className="font-semibold text-ink">{layer.title}.</strong> {layer.description}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2" aria-label={`${layer.title} components`}>
                  {layer.modules.map((m) => (
                    <li key={m} className="rounded-full border border-accent/25 bg-white px-3 py-1 font-mono text-[12px] text-accent-strong">
                      {m}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>

        <motion.div
          className="relative min-w-0"
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* content-visibility: the ~300-element 3D stack is skipped (layout, paint, compositing) while offscreen;
              the panel has a fixed height, so its size never changes. */}
          <div className="relative h-[380px] overflow-hidden rounded-[28px] border border-line bg-gradient-to-b from-white to-bg-soft shadow-soft [content-visibility:auto] sm:h-[540px] lg:h-[600px]">
            <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,#000_55%,transparent_100%)]" aria-hidden="true" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_58%_48%,rgb(0_140_248/0.10),transparent_70%)]" aria-hidden="true" />
            <ArchitectureStack selected={selected} onSelect={setSelected} reducedMotion={reduced} />
          </div>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-line bg-white/80 px-3.5 py-1.5 font-mono text-[11.5px] text-ink-soft shadow-[0_6px_18px_-12px_rgb(8_40_60/0.3)]">
            {finePointer ? <MousePointer2 className="size-3.5 text-accent-strong" aria-hidden="true" /> : <Hand className="size-3.5 text-accent-strong" aria-hidden="true" />}
            {finePointer ? "Drag to rotate · click a layer to inspect" : "Tap a layer to inspect"}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
