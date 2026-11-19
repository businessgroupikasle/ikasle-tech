import { Users2, Award, Sparkles, BrainCircuit } from "lucide-react";
import { RevealGroup, RevealItem } from "./AboutReveal";

export function PeopleBehindProgress() {
  return (
    <section id="people-behind-progress" className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f5faff_100%)] py-16 sm:py-20 lg:py-24">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgb(0_140_248/0.06),transparent_35%)]"
        aria-hidden="true"
      />
      <RevealGroup className="container-x relative">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          {/* Left: Text & Content */}
          <div>
            <RevealItem>
              <p className="text-sm font-bold tracking-[0.06em] text-ink-deep uppercase sm:text-[15px]">
                THE PEOPLE BEHIND THE PROGRESS
                <RevealItem as="span" kind="bar" delay={0.2} className="mt-2.5 block h-0.75 w-12 origin-left rounded-full bg-accent" aria-hidden />
              </p>
              <p className="mt-2 text-xs font-semibold tracking-wider uppercase text-accent">
                BUILT BY PEOPLE. STRENGTHENED THROUGH COLLABORATION.
              </p>
            </RevealItem>
            <RevealItem delay={0.1}>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-ink-deep sm:text-3xl lg:text-[2.25rem]">
                Every Great Journey Is a Collective Effort.
              </h2>
            </RevealItem>

            <RevealItem delay={0.2}>
              <div className="mt-6 space-y-4 text-justify text-base leading-relaxed text-ink-soft sm:text-[17px]">
                <p>
                  IKASLÉ is shaped by the people who bring ideas to life, solve problems, share knowledge and move projects forward.
                </p>
                <p>
                  We believe a strong company is built through more than individual talent. It grows through shared responsibility, continuous learning and a willingness to improve together.
                </p>
                <p className="text-ink-soft">
                  Every contribution matters. Every challenge teaches us something. Every milestone moves the journey forward.
                </p>
              </div>
            </RevealItem>

            <RevealItem delay={0.3} className="pt-6">
              <div className="flex items-center gap-3 rounded-xl border border-line/60 bg-white/90 px-4 py-3 shadow-xs sm:px-5">
                <span className="font-mono text-sm font-semibold text-accent" aria-hidden="true">{"// "}</span>
                <p className="font-mono text-xs font-semibold tracking-wide text-ink-deep sm:text-sm">
                  Different minds. Shared ambition. One direction.
                </p>
              </div>
            </RevealItem>
          </div>

          {/* Right: Visual Pillars Grid */}
          <div className="grid grid-cols-2 gap-4 sm:gap-5">
            <RevealItem delay={0.15} className="flex flex-col justify-between rounded-2xl border border-line/70 bg-white p-6 shadow-sm transition-all hover:border-accent/40 hover:shadow-md">
              <div className="flex size-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Users2 className="size-5.5" strokeWidth={2} />
              </div>
              <div className="mt-6">
                <h3 className="text-base font-bold text-ink-deep sm:text-lg">Shared Responsibility</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-soft sm:text-[13px]">
                  Collective ownership of every outcome, milestone and engineering commitment.
                </p>
              </div>
            </RevealItem>

            <RevealItem delay={0.2} className="flex flex-col justify-between rounded-2xl border border-line/70 bg-white p-6 shadow-sm transition-all hover:border-accent/40 hover:shadow-md">
              <div className="flex size-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <BrainCircuit className="size-5.5" strokeWidth={2} />
              </div>
              <div className="mt-6">
                <h3 className="text-base font-bold text-ink-deep sm:text-lg">Continuous Learning</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-soft sm:text-[13px]">
                  Curiosity-driven engineering and rapid adaptation to emerging technologies.
                </p>
              </div>
            </RevealItem>

            <RevealItem delay={0.25} className="flex flex-col justify-between rounded-2xl border border-line/70 bg-white p-6 shadow-sm transition-all hover:border-accent/40 hover:shadow-md">
              <div className="flex size-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Award className="size-5.5" strokeWidth={2} />
              </div>
              <div className="mt-6">
                <h3 className="text-base font-bold text-ink-deep sm:text-lg">Quality Driven</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-soft sm:text-[13px]">
                  Upholding technical standards and craftsmanship across all deliveries.
                </p>
              </div>
            </RevealItem>

            <RevealItem delay={0.3} className="flex flex-col justify-between rounded-2xl border border-line/70 bg-white p-6 shadow-sm transition-all hover:border-accent/40 hover:shadow-md">
              <div className="flex size-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Sparkles className="size-5.5" strokeWidth={2} />
              </div>
              <div className="mt-6">
                <h3 className="text-base font-bold text-ink-deep sm:text-lg">One Team</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-soft sm:text-[13px]">
                  Uniting diverse perspectives under one single vision and purpose.
                </p>
              </div>
            </RevealItem>
          </div>
        </div>
      </RevealGroup>
    </section>
  );
}

