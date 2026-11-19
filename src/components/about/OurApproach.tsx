import {
  ArrowRight,
  ChartNoAxesCombined,
  CodeXml,
  Layers3,
  Search,
  type LucideIcon,
} from "lucide-react";
import type { CSSProperties } from "react";
import { RevealGroup, RevealItem } from "./AboutReveal";
import "./about.css";

type ApproachStep = {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

const APPROACH_STEPS: ApproachStep[] = [
  {
    number: "01",
    title: "Discovery & Strategy",
    description: "Understand your goals and identify the right opportunities.",
    icon: Search,
  },
  {
    number: "02",
    title: "Planning & Blueprinting",
    description: "Turn ideas into a clear, actionable plan.",
    icon: Layers3,
  },
  {
    number: "03",
    title: "Execution & Development",
    description: "Build robust, scalable solutions with a focus on quality.",
    icon: CodeXml,
  },
  {
    number: "04",
    title: "Launch & Growth",
    description: "Deliver, iterate and support your long-term success.",
    icon: ChartNoAxesCombined,
  },
];

const STEP_COUNT = APPROACH_STEPS.length;

export function OurApproach() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f5fbff_0%,#fff_70%)] py-16 sm:py-20 lg:py-24">
      {/* Soft top glow, plus a faint blueprint grid that fades out downwards */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(ellipse_at_top,rgb(0_140_248/0.09),transparent_70%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(0_140_248/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(0_140_248/0.05)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_65%)]"
        aria-hidden="true"
      />

      <RevealGroup className="container-x relative">
        {/* Eyebrow & Main Title */}
        <div className="max-w-2xl">
          <RevealItem>
            <p className="text-sm font-bold tracking-[0.06em] text-ink-deep uppercase sm:text-[15px]">
              OUR APPROACH
              <RevealItem as="span" kind="bar" delay={0.2} className="mt-2.5 block h-0.75 w-12 origin-left rounded-full bg-accent" aria-hidden />
            </p>
          </RevealItem>
          <RevealItem delay={0.1}>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-ink-deep sm:text-3xl lg:text-[2rem]">
              A Structured Path from Idea to <span className="text-gradient">Impact.</span>
            </h2>
          </RevealItem>
        </div>

        {/* 4 cards: the last one is the dark finale. Each card shows its place in the 4-step progress bar. */}
        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {APPROACH_STEPS.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === STEP_COUNT - 1;
            const start = 0.1 + index * 0.16;
            const shineStyle = isLast ? "via-white/15" : "via-accent/10";

            return (
              <RevealItem key={step.number} as="li" delay={start} className="group relative">
                {/* Gradient hairline frame: the card sits inside it, so the edge lights up and the card lifts on hover */}
                <div
                  className={`h-full rounded-[22px] p-px shadow-[0_18px_40px_-26px_rgb(0_114_209/0.45)] transition-[translate,box-shadow] duration-500 group-hover:-translate-y-1.5 group-hover:shadow-[0_28px_56px_-24px_rgb(0_140_248/0.45)] ${
                    isLast
                      ? "bg-[linear-gradient(160deg,#3ab6ff,#0a4f7d_45%,#041c30)]"
                      : "bg-[linear-gradient(160deg,rgb(0_140_248/0.4),rgb(8_40_60/0.08)_55%,transparent)]"
                  }`}
                >
                  <div
                    className={`relative flex h-full flex-col justify-between overflow-hidden rounded-[21px] p-6 ${
                      isLast ? "bg-[linear-gradient(160deg,#0b3a5c,#041c30)] text-white" : "bg-[linear-gradient(180deg,#fff,#f7fbff)]"
                    }`}
                  >
                    {/* Light sweep across the card on hover */}
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none absolute inset-y-0 left-[-60%] w-[45%] skew-x-[-18deg] bg-gradient-to-r from-transparent ${shineStyle} to-transparent transition-[left] duration-1000 ease-out group-hover:left-[120%]`}
                    />

                    {/* Oversized step number as a watermark, clipped by the card edge */}
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none absolute -top-7 -right-3 font-mono text-[9rem] leading-none font-bold tracking-tighter select-none transition-transform duration-700 group-hover:-translate-x-2 group-hover:translate-y-1 ${
                        isLast ? "text-white/[0.07]" : "text-accent/[0.07]"
                      }`}
                    >
                      {step.number}
                    </span>

                    <div className="relative">
                      <RevealItem
                        as="span"
                        kind="pop"
                        delay={start + 0.08}
                        className={`flex size-12 items-center justify-center rounded-xl transition-[transform,rotate] duration-500 group-hover:rotate-[-6deg] group-hover:scale-110 ${
                          isLast
                            ? "bg-white/10 ring-1 ring-white/20"
                            : "bg-[linear-gradient(145deg,#dff7ff,#c5effb)] shadow-[0_10px_22px_-10px_rgb(0_140_248/0.7)] ring-1 ring-white"
                        }`}
                      >
                        <Icon className={`size-6 ${isLast ? "text-[#7fd8ff]" : "text-accent-strong"}`} strokeWidth={1.9} aria-hidden="true" />
                      </RevealItem>

                      <h3 className={`mt-6 text-base font-bold sm:text-[17px] ${isLast ? "text-white" : "text-ink-deep"}`}>
                        {step.title}
                      </h3>
                      <p className={`mt-2 text-xs leading-relaxed sm:text-[13.5px] ${isLast ? "text-white/70" : "text-ink-soft"}`}>
                        {step.description}
                      </p>
                    </div>

                    {/* Progress: segments up to this step fill in as the card reveals */}
                    <div className="relative mt-7 flex items-center gap-3">
                      <div className="flex flex-1 gap-1.5" aria-hidden="true">
                        {APPROACH_STEPS.map((_, segment) =>
                          segment <= index ? (
                            <RevealItem
                              key={segment}
                              as="span"
                              kind="bar"
                              delay={start + 0.3 + segment * 0.08}
                              className={`block h-1 flex-1 origin-left rounded-full ${isLast ? "bg-[#7fd8ff]" : "bg-accent"}`}
                            />
                          ) : (
                            <span key={segment} className={`block h-1 flex-1 rounded-full ${isLast ? "bg-white/15" : "bg-line"}`} />
                          ),
                        )}
                      </div>
                      <span className={`font-mono text-[11px] font-semibold tabular-nums ${isLast ? "text-white/60" : "text-ink-soft"}`}>
                        {step.number} / {String(STEP_COUNT).padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Connector: a glowing node on the seam between two cards (desktop only) */}
                {!isLast && (
                  <div className="absolute top-1/2 -right-4 z-10 hidden -translate-y-1/2 lg:block" aria-hidden="true">
                    <span
                      className="about-spark absolute inset-0 rounded-full bg-accent/25"
                      style={{ "--d": `${index * 0.3}s` } as CSSProperties}
                    />
                    <span className="relative flex size-8 items-center justify-center rounded-full border border-accent/30 bg-white text-accent shadow-[0_6px_16px_-6px_rgb(0_140_248/0.5)]">
                      <ArrowRight className="about-nudge size-3.5" strokeWidth={2.5} style={{ "--d": `${index * 0.3}s` } as CSSProperties} />
                    </span>
                  </div>
                )}
              </RevealItem>
            );
          })}
        </ol>
      </RevealGroup>
    </section>
  );
}
