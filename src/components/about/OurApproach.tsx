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

export function OurApproach() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f5fbff_0%,#fff_70%)] py-16 sm:py-20">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(ellipse_at_top,rgb(0_140_248/0.09),transparent_70%)]"
        aria-hidden="true"
      />
      <RevealGroup className="container-x relative">
        <RevealItem>
          <p className="text-sm font-bold tracking-[0.06em] text-ink-deep uppercase sm:text-[15px]">
            Our Approach
            <RevealItem as="span" kind="bar" delay={0.2} className="mt-2.5 block h-0.75 w-12 origin-left rounded-full bg-accent" aria-hidden />
          </p>
        </RevealItem>

        <ol className="mt-7 grid gap-5 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10 lg:grid-cols-4 lg:gap-0">
          {APPROACH_STEPS.map((step, index) => {
            const Icon = step.icon;
            const start = 0.1 + index * 0.16;
            return (
              <RevealItem
                as="li"
                key={step.number}
                delay={start}
                className="group relative grid grid-cols-[3.25rem_minmax(0,1fr)] gap-4 rounded-2xl border border-line/70 bg-white/80 p-4 shadow-sm backdrop-blur-sm sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none lg:pr-9"
              >
                <RevealItem as="span" kind="pop" delay={start + 0.08} className="flex size-[3.25rem] items-center justify-center rounded-xl bg-[linear-gradient(145deg,#dff7ff,#c5effb)] text-ink-deep transition-[translate] duration-200 group-hover:-translate-y-1">
                  <Icon className="size-7" strokeWidth={1.8} aria-hidden="true" />
                </RevealItem>

                <div>
                  <span className="block text-lg leading-none font-bold text-ink-deep">
                    {step.number}
                  </span>
                  <h2 className="mt-1.5 text-sm font-bold text-ink-deep sm:text-[15px]">
                    {step.title}
                  </h2>
                  <p className="mt-1.5 max-w-[14rem] text-xs leading-[1.45] text-ink sm:text-[13px]">
                    {step.description}
                  </p>
                </div>

                {index < APPROACH_STEPS.length - 1 && (
                  <RevealItem as="span" kind="left" delay={start + 0.2} className="absolute top-4 -right-1 hidden size-6 lg:block">
                    {/* Staggered so the nudge passes along the row, leading the eye through the steps. */}
                    <ArrowRight
                      className="about-nudge size-6 text-accent"
                      style={{ "--d": `${index * 0.3}s` } as CSSProperties}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </RevealItem>
                )}
              </RevealItem>
            );
          })}
        </ol>
      </RevealGroup>
    </section>
  );
}
