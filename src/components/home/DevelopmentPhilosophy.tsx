"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { HeartHandshake, Layers, Scaling, type LucideIcon } from "lucide-react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { AnimatedTerminal, type TerminalScriptLine } from "@/components/ui/AnimatedTerminal";

const SCRIPT: TerminalScriptLine[] = [
  { kind: "cmd", text: "git clone ikasle/technology" },
  { kind: "out", text: "Cloning into 'technology'..." },
  { kind: "out", text: "✓ Repository ready", tone: "success" },
  { kind: "gap" },
  { kind: "cmd", text: "npm install" },
  { kind: "out", text: "✓ Dependencies installed", tone: "success" },
  { kind: "gap" },
  { kind: "cmd", text: "npm run build" },
  { kind: "out", text: "✓ Compiled successfully", tone: "success" },
  { kind: "out", text: "✓ Type checking passed", tone: "success" },
  { kind: "gap" },
  { kind: "cmd", text: "npm run test" },
  { kind: "out", text: "✓ All checks passed", tone: "success" },
  { kind: "gap" },
  { kind: "cmd", text: "npm run deploy" },
  { kind: "out", text: "✓ Deployment completed", tone: "success" },
  { kind: "gap" },
  { kind: "final", text: "> Building technology that lasts" },
];

const PRINCIPLES: { label: string; icon: LucideIcon }[] = [
  { label: "Clean Architecture", icon: Layers },
  { label: "Scalable Engineering", icon: Scaling },
  { label: "Human-Centered Solutions", icon: HeartHandshake },
];

const HEADING_WORDS = ["Our", "Development", "Philosophy"];

/**
 * Homepage "Our Development Philosophy" section.
 * GSAP: heading word reveal + staggered paragraph entrances (and the terminal sequence inside
 * <AnimatedTerminal>). Motion: principle-chip hover. CSS: blueprint grid, glow, caret.
 */
export function DevelopmentPhilosophy() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from("[data-ph-word]", {
          yPercent: 110,
          opacity: 0,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.07,
          scrollTrigger: { trigger: "[data-ph-heading]", start: "top 85%", once: true },
        });
        gsap.from("[data-ph-reveal]", {
          y: 28,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: "[data-ph-copy]", start: "top 80%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="philosophy-title" className="relative overflow-hidden bg-gradient-to-b from-white via-bg-blue/40 to-white py-20 sm:py-28 lg:py-32">
      {/* Technical blueprint: fine grid + soft brand glow (static, CSS only) */}
      <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_80%_70%_at_50%_45%,#000_35%,transparent_80%)]" aria-hidden="true" />
      <div className="pointer-events-none absolute top-1/3 left-[18%] size-[46rem] max-w-[120vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(0_140_248/0.12),transparent_65%)]" aria-hidden="true" />

      <div className="container-x relative">
        <div data-ph-heading className="flex flex-col gap-4">
          <p className="font-mono text-[12px] tracking-[0.18em] text-accent-strong uppercase">{"// How we think & build"}</p>
          <h2
            id="philosophy-title"
            className="font-semibold tracking-[-0.04em] text-balance text-ink [font-size:clamp(2.1rem,1.2rem+3.6vw,4.25rem)] leading-[1.04]"
          >
            {HEADING_WORDS.map((word, i) => (
              <span key={word}>
                <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                  <span data-ph-word className="inline-block">
                    {word}
                  </span>
                </span>
                {i < HEADING_WORDS.length - 1 ? " " : null}
              </span>
            ))}
          </h2>
        </div>

        <div className="mt-12 grid items-center gap-12 sm:mt-14 lg:mt-16 lg:grid-cols-[42fr_58fr] lg:gap-14 xl:gap-20">
          <AnimatedTerminal
            title="ikasle@development: ~/workspace"
            lines={SCRIPT}
            label="Animated terminal demo showing a project being cloned, installed, built, tested and deployed"
            className="min-w-0"
          />

          <div data-ph-copy className="min-w-0">
            <h3 data-ph-reveal className="font-semibold tracking-[-0.02em] text-ink [font-size:clamp(1.45rem,1.1rem+1.2vw,2rem)] leading-tight">
              Building Software with Purpose
            </h3>
            <div className="mt-5 flex max-w-[62ch] flex-col gap-4 text-[16px] leading-relaxed text-ink-soft sm:text-[17px]">
              <p data-ph-reveal>
                At IKASLE Technologies, we believe great software is more than code. It&apos;s about solving real business challenges, simplifying complex
                processes, and creating digital experiences that make technology genuinely useful.
              </p>
              <p data-ph-reveal>
                We approach every project with a strong foundation in clean architecture, thoughtful design, and scalable engineering. From enterprise ERP
                systems to intelligent attendance platforms and custom applications, our goal is to build solutions that are reliable, secure, and easy to
                evolve.
              </p>
              <p data-ph-reveal>
                Our development philosophy combines innovation with practical problem-solving. We value maintainable code, transparent collaboration,
                continuous improvement, and software that creates lasting value for the businesses and people who depend on it.
              </p>
            </div>

            <ul data-ph-reveal className="mt-8 flex flex-wrap gap-2.5" aria-label="Technical principles">
              {PRINCIPLES.map(({ label, icon: Icon }) => (
                <motion.li
                  key={label}
                  whileHover="hover"
                  initial="rest"
                  animate="rest"
                  className="flex items-center gap-2 rounded-full border border-accent/20 bg-white/90 px-3.5 py-2 text-[13.5px] font-medium text-ink shadow-sm transition-colors duration-200 hover:border-accent/50"
                >
                  <motion.span
                    variants={{ rest: { rotate: 0, scale: 1 }, hover: { rotate: -8, scale: 1.12 } }}
                    transition={{ type: "spring", stiffness: 380, damping: 18 }}
                    className="inline-flex text-accent"
                  >
                    <Icon className="size-4" strokeWidth={1.75} aria-hidden="true" />
                  </motion.span>
                  {label}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
