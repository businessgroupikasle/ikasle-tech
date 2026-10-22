"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";
import { cn } from "@/lib/cn";

export type TerminalScriptLine =
  | { kind: "cmd"; text: string }
  | { kind: "out"; text: string; tone?: "plain" | "info" | "success" }
  | { kind: "gap" }
  | { kind: "final"; text: string };

type Props = {
  title: string;
  lines: TerminalScriptLine[];
  /** Accessible name for the terminal figure. */
  label: string;
  className?: string;
};

const TYPE_SECONDS_PER_CHAR = 0.032;

/**
 * Decorative developer terminal, sequenced with one GSAP timeline.
 *
 * - Every line is laid out from the start (only visibility changes), so nothing shifts while it plays.
 * - Commands "type" by stepping their width in `ch` units — no per-character React renders.
 * - Plays when visible, pauses (never resets) when scrolled away, and freezes the caret offscreen.
 * - Hidden states are applied only inside the reduced-motion-safe matchMedia branch, so reduced-motion
 *   and no-JS visitors see the finished terminal. Screen readers get the transcript once (no live region).
 *
 * Engines: GSAP owns line visibility, typing width and the completion glow; Motion owns the card's
 * hover lift on the outer wrapper; CSS owns the caret blink and grid.
 */
export function AnimatedTerminal({ title, lines, label, className }: Props) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root);
        const tl = gsap.timeline({ paused: true });

        gsap.set(q("[data-line]"), { autoAlpha: 0 });
        gsap.set(q("[data-caret]"), { autoAlpha: 0 });
        gsap.set(q("[data-glow]"), { autoAlpha: 0 });

        q("[data-line]").forEach((line) => {
          const kind = line.dataset.line;
          if (kind === "gap") return;
          if (kind === "cmd" || kind === "final") {
            const typed = line.querySelector<HTMLElement>("[data-typed]");
            const caret = line.querySelector<HTMLElement>("[data-caret]");
            const chars = Number(typed?.dataset.chars ?? 0);
            tl.set(line, { autoAlpha: 1 })
              .set(caret, { autoAlpha: 1 })
              .fromTo(typed, { width: "0ch" }, { width: `${chars}ch`, duration: Math.max(0.25, chars * TYPE_SECONDS_PER_CHAR), ease: `steps(${chars})` });
            // Command carets hand over to the next line; the final caret stays and blinks.
            if (kind === "cmd") tl.set(caret, { autoAlpha: 0 }, "+=0.18");
          } else {
            tl.fromTo(line, { autoAlpha: 0, y: 4 }, { autoAlpha: 1, y: 0, duration: 0.28, ease: "power2.out" }, "+=0.12");
          }
        });

        tl.to(q("[data-glow]"), { autoAlpha: 1, duration: 0.8, ease: "power2.out" }, "+=0.1");

        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top 80%",
          end: "bottom top",
          onToggle: (self) => {
            root.current?.classList.toggle("terminal-paused", !self.isActive);
            if (self.isActive) tl.play();
            else tl.pause();
          },
        });

        return () => {
          st.kill();
          tl.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const transcript = lines
    .map((l) => (l.kind === "gap" ? "" : l.kind === "cmd" ? `$ ${l.text}` : l.text))
    .join("\n");

  return (
    <motion.figure
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={cn("relative m-0", className)}
      aria-label={label}
    >
      <div ref={root} className="relative">
        {/* Completion glow — GSAP fades it in once the sequence finishes */}
        <div
          data-glow
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px rounded-[22px] shadow-[0_0_0_1px_rgb(0_140_248/0.45),0_0_48px_-6px_rgb(0_140_248/0.45)]"
        />

        <div className="relative overflow-hidden rounded-[22px] border border-editor-line bg-editor shadow-[0_40px_80px_-36px_rgb(6_28_48/0.6)]">
          <div className="flex h-11 items-center gap-3 border-b border-editor-line bg-editor-panel px-4" aria-hidden="true">
            <div className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-[#ff5f57]" />
              <span className="size-2.5 rounded-full bg-[#febc2e]" />
              <span className="size-2.5 rounded-full bg-[#28c840]" />
            </div>
            <p className="min-w-0 flex-1 truncate text-left font-mono text-[11px] text-editor-muted sm:text-center sm:text-[12px]">{title}</p>
            {/* Balances the window dots so the title centres — only where there is room for it */}
            <span className="hidden w-[42px] sm:block" />
          </div>

          <pre className="sr-only">{transcript}</pre>

          <div aria-hidden="true" className="overflow-x-auto">
            {/* Not .code-surface: its unlayered font-size would override these responsive Tailwind sizes. */}
            <div className="min-w-max px-4 py-5 font-mono text-[12px] leading-[1.75] text-editor-text [font-feature-settings:liga_0,calt_0] sm:px-6 sm:py-6 sm:text-[13px] xl:text-[13.5px]">
              {lines.map((line, i) => {
                if (line.kind === "gap") return <div key={i} data-line="gap" className="h-[0.9em]" />;
                if (line.kind === "cmd") {
                  return (
                    <div key={i} data-line="cmd" className="flex whitespace-pre">
                      <span className="text-editor-muted">$ </span>
                      <span data-typed data-chars={line.text.length} className="inline-block overflow-hidden align-bottom font-medium text-accent">
                        {line.text}
                      </span>
                      <span data-caret className="caret" />
                    </div>
                  );
                }
                if (line.kind === "final") {
                  return (
                    <div key={i} data-line="final" className="mt-1 flex whitespace-pre">
                      <span data-typed data-chars={line.text.length} className="inline-block overflow-hidden align-bottom text-editor-text">
                        {line.text}
                      </span>
                      <span data-caret className="caret" />
                    </div>
                  );
                }
                return (
                  <div
                    key={i}
                    data-line="out"
                    className={cn(
                      "whitespace-pre",
                      line.tone === "success" && "tok-success",
                      line.tone === "info" && "text-[var(--syn-type)]",
                      (!line.tone || line.tone === "plain") && "text-editor-muted",
                    )}
                  >
                    {line.text}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.figure>
  );
}
