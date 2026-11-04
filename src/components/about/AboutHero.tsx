import type { CSSProperties } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { AboutHeroArt } from "./AboutHeroArt";
import "./about.css";

const SPARKS = [
  { left: "40%", top: "75%", size: "size-1.5" },
  { left: "94%", top: "14%", size: "size-2" },
  { left: "52%", top: "20%", size: "size-1" },
] as const;

const delay = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties;

/** Enters with CSS rather than JS, so this first screen never waits for hydration to appear. */
export function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(100deg,#fff_0%,#f4faff_42%,#dceffe_100%)] pt-[calc(var(--header-h)+32px)] pb-10 lg:pt-[calc(var(--header-h)+16px)] lg:pb-6">
      {/* Flowing lines and sparks behind everything; stretched with the section, so the strokes stay one pixel. */}
      <svg viewBox="0 0 606 199" preserveAspectRatio="none" className="about-fade pointer-events-none absolute inset-0 size-full" style={delay(0.5)} aria-hidden="true" focusable="false">
        <g fill="none" stroke="#008cf8" strokeOpacity=".2" vectorEffect="non-scaling-stroke">
          <path vectorEffect="non-scaling-stroke" d="M0 166C90 128 170 128 250 148S420 182 606 112" />
          <path vectorEffect="non-scaling-stroke" d="M0 184C110 150 190 152 280 168S470 190 606 136" />
          <path vectorEffect="non-scaling-stroke" className="hidden lg:block" d="M300 40C390 8 500 8 606 62" />
        </g>
      </svg>
      {SPARKS.map((spark, index) => (
        <span
          key={spark.left}
          className={`${spark.size} about-spark pointer-events-none absolute rounded-full bg-[#14b8e6] shadow-[0_0_10px_3px_rgb(20_184_230/0.45)]`}
          style={{ left: spark.left, top: spark.top, ...delay(index * -1.1) }}
          aria-hidden="true"
        />
      ))}

      <div className="container-x relative grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:gap-4">
        <div className="flex flex-col items-start">
          <p className="about-rise text-sm font-bold tracking-[0.06em] text-ink-deep uppercase sm:text-[15px]">
            About IKASLÉ
            <span className="about-bar mt-2.5 block h-0.75 w-14 rounded-full bg-accent" style={delay(0.25)} aria-hidden="true" />
          </p>
          <h1 className="about-rise mt-5 text-[2.125rem] leading-[1.08] font-bold tracking-[-0.03em] text-balance text-ink-deep xs:text-[2.6rem] sm:text-[3.25rem] lg:text-[2.75rem] xl:text-[3.5rem]" style={delay(0.08)}>
            Where ideas become intelligent solutions.
          </h1>
          <p className="about-rise mt-5 max-w-[26rem] text-base leading-relaxed text-ink sm:text-lg xl:text-xl" style={delay(0.18)}>
            We bring creativity and technology together to help businesses move forward.
          </p>
          <div className="about-rise mt-8" style={delay(0.28)}>
            <ButtonLink href="#our-journey" size="lg" arrow className="rounded-lg!">
              Explore Our Journey
            </ButtonLink>
          </div>
        </div>

        <AboutHeroArt className="mx-auto w-full max-w-[640px] lg:w-[calc(100%+48px)] lg:max-w-none" />
      </div>
    </section>
  );
}
