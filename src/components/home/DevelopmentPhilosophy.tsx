"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { HeartHandshake, Layers, Scaling, ShieldCheck, Users, type LucideIcon } from "lucide-react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { AnimatedTerminal, type TerminalScriptLine } from "@/components/ui/AnimatedTerminal";
import { Reveal } from "@/components/animations/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeading";

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

const PRINCIPLES: { number: string; label: string; description: string; icon: LucideIcon }[] = [
  {
    number: "01",
    label: "Clean Architecture",
    icon: Layers,
    description: "We build structured, maintainable software with well-defined components and reliable technical foundations.",
  },
  {
    number: "02",
    label: "Scalable Engineering",
    icon: Scaling,
    description: "We design applications and systems that can adapt to growing users, increasing workloads and evolving business needs.",
  },
  {
    number: "03",
    label: "Human-Centered Design",
    icon: HeartHandshake,
    description: "We build intuitive, functional and user-focused digital experiences that solve real problems.",
  },
  {
    number: "04",
    label: "Continuous Improvement",
    icon: ShieldCheck,
    description: "We embrace iterative development, regular feedback and ongoing refinement to deliver lasting software quality.",
  },
  {
    number: "05",
    label: "Long-Term Value",
    icon: Users,
    description: "We engineer software designed to support business growth and evolve alongside technological advancements.",
  },
];

const HEADING_WORDS = ["Our", "Development", "Philosophy"];

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
    <section
      ref={root}
      data-stack-layer="2"
      aria-labelledby="philosophy-title"
      className="stack-sticky stack-sheet relative z-20 overflow-hidden bg-white bg-gradient-to-b from-white via-bg-blue/40 to-white py-16 sm:py-20 lg:py-24"
    >
      {/* Technical blueprint: fine grid + soft brand glow */}
      <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_80%_70%_at_50%_45%,#000_35%,transparent_80%)]" aria-hidden="true" />
      <div className="pointer-events-none absolute top-1/3 left-[18%] size-[46rem] max-w-[120vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(0_140_248/0.12),transparent_65%)]" aria-hidden="true" />

      <div className="container-x relative">
        <div data-ph-heading className="flex flex-col items-start gap-4">
          <Eyebrow>OUR SOFTWARE ENGINEERING APPROACH</Eyebrow>

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

        {/* 2-column balanced top part: Terminal (Left) and Purpose (Right) */}
        <Reveal className="mt-10 grid items-stretch gap-10 sm:mt-12 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <div className="flex flex-col justify-center">
            <AnimatedTerminal
              title="ikasle@development: ~/workspace"
              lines={SCRIPT}
              label="Animated terminal demo showing a project being cloned, installed, built, tested and deployed"
              className="min-w-0"
            />
          </div>

          <div data-ph-copy className="flex flex-col justify-between min-w-0">
            <div>
              <h3 data-ph-reveal className="font-semibold tracking-[-0.02em] text-ink [font-size:clamp(1.45rem,1.1rem+1.2vw,2rem)] leading-tight">
                Engineering Software With Purpose. Building for the Future.
              </h3>
              <div className="mt-5 flex flex-col gap-3.5 text-justify text-base leading-relaxed text-ink-soft sm:text-[17px]">
                <p data-ph-reveal>
                  At IKASLÉ Technologies, software development begins with understanding the problem, not simply writing code. We believe technology should solve meaningful business challenges, simplify complex operations and create better digital experiences.
                </p>
                <p data-ph-reveal>
                  We approach every project with a strong foundation in clean architecture, modern development frameworks and scalable system design. From custom software and SaaS platforms to ERP systems and intelligent digital solutions, we engineer technology with maintainability, performance and adaptability in mind.
                </p>
                <p data-ph-reveal className="font-medium text-ink-soft">
                  We don&apos;t just focus on delivering functional software. We focus on building reliable digital foundations that businesses can depend on, evolve and grow with.
                </p>
              </div>
            </div>

            <div data-ph-reveal className="mt-6 flex flex-wrap items-center gap-2.5 pt-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-ink shadow-2xs">
                <Layers className="size-3.5 text-accent" />
                Clean Architecture
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-ink shadow-2xs">
                <Scaling className="size-3.5 text-accent" />
                Scalable Engineering
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-ink shadow-2xs">
                <HeartHandshake className="size-3.5 text-accent" />
                Human-Centered Design
              </span>
            </div>
          </div>
        </Reveal>

        {/* Full-width Engineering Principles */}
        <div className="mt-14 pt-10 border-t border-line/70">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-accent-strong">
                {"// OUR ENGINEERING PRINCIPLES"}
              </p>
              <h3 className="mt-1 text-lg sm:text-xl font-bold tracking-tight text-ink">
                The Standards That Guide Every Build
              </h3>
            </div>
            <p className="font-mono text-xs text-ink-soft">
              Thoughtful engineering · Products built to scale
            </p>
          </div>

          <div className="relative mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {/* Soft brand glow behind the cards, so the glass has colour to blur through. */}
            <div
              className="pointer-events-none absolute -inset-x-4 -inset-y-6 rounded-[2rem] bg-[radial-gradient(ellipse_at_25%_30%,rgb(0_140_248/0.22),transparent_60%),radial-gradient(ellipse_at_80%_75%,rgb(77_179_255/0.25),transparent_55%)] blur-xl"
              aria-hidden="true"
            />
            {PRINCIPLES.map(({ number, label, description, icon: Icon }) => (
              <motion.div
                key={label}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="group relative flex flex-col justify-between rounded-2xl border border-white/70 bg-[linear-gradient(160deg,rgb(255_255_255/0.8),rgb(255_255_255/0.35))] p-4 shadow-[0_14px_34px_-20px_rgb(8_40_60/0.35)] backdrop-blur-xl transition-[border-color,box-shadow] duration-300 hover:border-white hover:shadow-[0_22px_44px_-20px_rgb(0_140_248/0.4)]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-accent-strong">{number}.</span>
                    <Icon className="size-4 text-accent transition-transform duration-200 group-hover:scale-110" strokeWidth={1.75} aria-hidden="true" />
                  </div>
                  <h4 className="mt-2.5 text-sm font-bold text-ink">{label}</h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">
                    {description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="mt-6 text-center font-mono text-xs tracking-wide text-ink-soft sm:text-[13px]">
            <span className="font-semibold text-accent" aria-hidden="true">{"// "}</span>
            <span className="font-semibold text-ink">Our philosophy:</span> The right technology. Thoughtful engineering. Products built to scale.
          </p>
        </div>
      </div>
    </section>
  );
}
