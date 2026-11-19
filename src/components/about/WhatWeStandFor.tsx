import {
  ShieldCheck,
  Compass,
  Lightbulb,
  CheckCircle2,
  Users,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { RevealGroup, RevealItem } from "./AboutReveal";

type ValueItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const VALUES: ValueItem[] = [
  {
    title: "Integrity",
    description:
      "We believe in honest communication, realistic commitments and transparent relationships. Trust should be built through actions, not promises.",
    icon: ShieldCheck,
  },
  {
    title: "Curiosity",
    description:
      "We never stop asking questions, exploring possibilities and learning how things can be done better.",
    icon: Compass,
  },
  {
    title: "Creativity",
    description:
      "We encourage original thinking and believe that meaningful innovation begins with looking at problems differently.",
    icon: Lightbulb,
  },
  {
    title: "Responsibility",
    description:
      "We take ownership of our work, respect commitments and approach every responsibility with care.",
    icon: CheckCircle2,
  },
  {
    title: "Collaboration",
    description:
      "We value different perspectives and believe better outcomes come from listening, understanding and working together.",
    icon: Users,
  },
  {
    title: "Continuous Growth",
    description:
      "We embrace learning, adapt to change and continuously work towards becoming better at what we do.",
    icon: TrendingUp,
  },
];

export function WhatWeStandFor() {
  return (
    <section id="what-we-stand-for" className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_30%,rgb(0_140_248/0.05),transparent_30%),radial-gradient(circle_at_88%_72%,rgb(77_179_255/0.05),transparent_25%)]"
        aria-hidden="true"
      />
      <RevealGroup className="container-x relative">
        <div className="max-w-2xl">
          <RevealItem>
            <p className="text-sm font-bold tracking-[0.06em] text-ink-deep uppercase sm:text-[15px]">
              WHAT WE STAND FOR
              <RevealItem as="span" kind="bar" delay={0.2} className="mt-2.5 block h-0.75 w-12 origin-left rounded-full bg-accent" aria-hidden />
            </p>
          </RevealItem>
          <RevealItem delay={0.1}>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-ink-deep sm:text-3xl lg:text-[2.25rem]">
              The Values That Shape IKASLÉ
            </h2>
          </RevealItem>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {VALUES.map((val, idx) => {
            const Icon = val.icon;
            const delay = 0.12 + idx * 0.08;
            return (
              <RevealItem
                key={val.title}
                delay={delay}
                className="group relative flex flex-col justify-between rounded-2xl border border-line/70 bg-bg-soft/40 p-6 shadow-xs transition-all duration-300 hover:border-accent/40 hover:bg-white hover:shadow-md"
              >
                <div>
                  <div className="flex size-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition-transform duration-300 group-hover:scale-105">
                    <Icon className="size-6 text-accent" strokeWidth={2} aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-ink-deep sm:text-xl">
                    {val.title}
                  </h3>
                  <p className="mt-2 text-justify text-sm leading-relaxed text-ink-soft sm:text-[14.5px]">
                    {val.description}
                  </p>
                </div>
              </RevealItem>
            );
          })}
        </div>
      </RevealGroup>
    </section>
  );
}

