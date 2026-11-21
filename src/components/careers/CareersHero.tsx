import { BriefcaseBusiness, Clapperboard, Code2, Palette, Sparkles, TrendingUp } from "lucide-react";
import type { CSSProperties } from "react";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { ButtonLink } from "@/components/ui/Button";
import { jobs } from "@/data/careers";
import "./careers.css";

const float = (duration: number, delay: number): CSSProperties => ({ animationDuration: `${duration}s`, animationDelay: `${delay}s` });

/**
 * Careers hero: headline and actions on the left; on the right a "workspace" composition of floating glass cards
 * (hiring badge, a live role, the teams you could join, growth) around rotating rings. Pure CSS animation, so it
 * starts at first paint; reduced motion keeps it still.
 */
export function CareersHero() {
  const openRoles = jobs.length;
  return (
    <section aria-labelledby="careers-title" className="relative overflow-hidden pt-[calc(var(--header-h)+40px)] pb-20 sm:pb-24 lg:pt-[calc(var(--header-h)+64px)]">
      <div className="ambient" aria-hidden="true" />
      <div className="bg-grid pointer-events-none absolute inset-0 mask-[radial-gradient(ellipse_at_70%_35%,#000_15%,transparent_70%)]" aria-hidden="true" />

      <div className="container-x relative grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        <div className="flex flex-col items-start">
          <p className="enter-up inline-flex items-center gap-2 rounded-full border border-accent/25 bg-white/80 px-3.5 py-1.5 font-mono text-[12px] tracking-wide text-accent-strong uppercase [animation-delay:60ms]">
            <span className="relative grid size-2 place-items-center" aria-hidden="true">
              <span className="careers-pulse absolute inset-0 rounded-full bg-success" />
              <span className="relative size-2 rounded-full bg-success" />
            </span>
            Careers at IKASLÉ · {openRoles} open roles
          </p>
          <h1
            id="careers-title"
            className="enter-up mt-6 text-[2.5rem] leading-[1.04] font-semibold tracking-[-0.04em] text-balance text-ink [animation-delay:120ms] sm:text-6xl lg:text-[4rem]"
          >
            Build Your Future <span className="text-gradient">With Us.</span>
          </h1>
          <p className="enter-up mt-6 max-w-xl text-lg leading-relaxed text-pretty text-ink-soft [animation-delay:200ms]">
            We believe great people create great things. Join our team, showcase your talent, and grow your career with exciting opportunities.
          </p>
          <div className="enter-up mt-9 flex w-full flex-col gap-3 [animation-delay:280ms] xs:w-auto xs:flex-row">
            <MagneticButton className="flex">
              <ButtonLink href="#openings" size="lg" arrow className="w-full xs:w-auto">
                Explore Open Positions
              </ButtonLink>
            </MagneticButton>
            <ButtonLink href="/careers/apply" size="lg" variant="secondary">
              Submit Your Resume
            </ButtonLink>
          </div>
        </div>

        {/* Workspace visual (decorative). */}
        <div className="relative mx-auto aspect-square w-full max-w-[520px]" aria-hidden="true">
          <div className="careers-orbit absolute inset-[6%] rounded-full border border-dashed border-accent/25" />
          <div className="careers-orbit-reverse absolute inset-[20%] rounded-full border border-dashed border-accent/35" />
          <div className="absolute inset-[30%] rounded-full bg-[radial-gradient(circle,rgb(0_140_248/0.28),transparent_70%)] blur-2xl" />

          {/* Centre: the team hub */}
          <div className="absolute inset-[33%] grid place-items-center rounded-[32px] bg-linear-to-br from-accent to-accent-strong shadow-[0_30px_60px_-24px_rgb(0_110_200/0.8)]">
            <BriefcaseBusiness className="size-[38%] text-white" strokeWidth={1.5} />
          </div>

          {/* Floating cards */}
          <div className="careers-float absolute top-[4%] left-[2%] w-[52%] rounded-2xl border border-white/70 bg-white/90 p-4 shadow-[0_20px_40px_-24px_rgb(8_40_60/0.45)] backdrop-blur" style={float(6.5, 0)}>
            <p className="font-mono text-[10.5px] tracking-wide text-accent-strong uppercase">Now hiring</p>
            <p className="mt-1.5 text-[15px] font-semibold text-ink">Full Stack Developer</p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              <span className="rounded-full bg-bg-blue px-2 py-0.5 text-[11px] font-medium text-accent-strong">Development</span>
              <span className="rounded-full bg-bg-soft px-2 py-0.5 text-[11px] font-medium text-ink-soft">Full-Time</span>
            </div>
          </div>

          <div className="careers-float absolute top-[14%] right-[0%] rounded-2xl border border-white/70 bg-white/90 p-3.5 shadow-[0_20px_40px_-24px_rgb(8_40_60/0.45)] backdrop-blur" style={float(7, -2)}>
            <p className="text-[11px] font-medium text-ink-soft">Teams hiring</p>
            <div className="mt-2 flex -space-x-2">
              {[
                [Code2, "bg-sky-500"],
                [Palette, "bg-indigo-500"],
                [Clapperboard, "bg-blue-600"],
                [Sparkles, "bg-cyan-500"],
              ].map(([Icon, bg], i) => {
                const I = Icon as typeof Code2;
                return (
                  <span key={i} className={`grid size-8 place-items-center rounded-full border-2 border-white text-white ${bg as string}`}>
                    <I className="size-3.5" />
                  </span>
                );
              })}
            </div>
          </div>

          <div className="careers-float absolute right-[4%] bottom-[8%] w-[46%] rounded-2xl border border-white/70 bg-white/90 p-4 shadow-[0_20px_40px_-24px_rgb(8_40_60/0.45)] backdrop-blur" style={float(6, -3.5)}>
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-semibold text-ink">Career growth</p>
              <TrendingUp className="size-4 text-success" />
            </div>
            <svg viewBox="0 0 120 40" className="mt-2 h-10 w-full">
              <defs>
                <linearGradient id="careers-spark" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="#008CF8" stopOpacity="0.35" />
                  <stop offset="1" stopColor="#008CF8" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0 34 L20 30 L40 31 L60 22 L80 18 L100 10 L120 5 L120 40 L0 40Z" fill="url(#careers-spark)" />
              <path d="M0 34 L20 30 L40 31 L60 22 L80 18 L100 10 L120 5" fill="none" stroke="#008CF8" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          <div className="careers-float absolute bottom-[14%] left-[0%] rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-[0_20px_40px_-24px_rgb(8_40_60/0.45)] backdrop-blur" style={float(7.5, -1)}>
            <p className="text-[11px] font-medium text-ink-soft">Internships</p>
            <p className="mt-0.5 text-[14px] font-semibold text-ink">Learn on live projects</p>
          </div>
        </div>
      </div>
    </section>
  );
}
