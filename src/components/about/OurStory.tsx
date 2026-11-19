import Image from "next/image";
import { Calendar, Globe2, Sparkles, Building2 } from "lucide-react";
import ourStoryOffice from "../../../public/images/about/our-story-office.png";
import { RevealGroup, RevealItem } from "./AboutReveal";

export function OurStory() {
  return (
    <section id="our-story" className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_30%,rgb(0_140_248/0.06),transparent_28%),radial-gradient(circle_at_88%_72%,rgb(77_179_255/0.07),transparent_25%)]"
        aria-hidden="true"
      />
      <RevealGroup className="container-x relative">
        {/* 2-column perfectly equal grid: 50% left / 50% right, equal top and bottom alignment */}
        <div className="grid items-stretch gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          {/* Left Column: Title & Story text */}
          <div className="flex flex-col justify-between">
            <div>
              <RevealItem>
                <p className="text-sm font-bold tracking-[0.06em] text-ink-deep uppercase sm:text-[15px]">
                  THE JOURNEY BEHIND THE NAME
                  <RevealItem as="span" kind="bar" delay={0.2} className="mt-2.5 block h-0.75 w-12 origin-left rounded-full bg-accent" aria-hidden />
                </p>
              </RevealItem>
              <RevealItem delay={0.1}>
                <h2 className="mt-4 text-[2.1rem] leading-[1.08] font-bold tracking-[-0.035em] text-balance text-ink-deep sm:text-[2.7rem] lg:text-[2.25rem] xl:text-[3rem]">
                  A Small Beginning. An Ambitious Vision.
                </h2>
              </RevealItem>

              <RevealItem delay={0.2}>
                <div className="mt-6 space-y-4 text-justify text-base leading-relaxed text-ink-soft sm:text-[17px]">
                  <p>
                    IKASLÉ began in 2020 with a simple ambition: to connect technology with creativity. What started as an idea gradually evolved into a company shaped by curiosity, experimentation, challenges and continuous learning.
                  </p>
                  <p>
                    The early years were about discovering possibilities, building capabilities and understanding how technology could solve real business problems.
                  </p>
                  <p>
                    As we grew, so did our perspective. We moved beyond simply creating digital experiences and began exploring broader opportunities in software engineering, business applications and intelligent technology.
                  </p>
                  <p className="text-ink-soft">
                    Every project, challenge and new experience has contributed to the company we are building today. Based in Coimbatore, India, IKASLÉ continues to grow with an open outlook, including portfolio experience from the United Kingdom and the United Arab Emirates.
                  </p>
                  <p className="font-medium text-ink-deep">
                    We are proud of where the journey began, honest about where we stand and ambitious about where we are heading.
                  </p>
                </div>
              </RevealItem>
            </div>

            <RevealItem delay={0.3} className="pt-6">
              <div className="flex items-center gap-3 rounded-xl border border-line/60 bg-bg-soft/70 px-4 py-3 sm:px-5">
                <span className="font-mono text-sm font-semibold text-accent" aria-hidden="true">{"// "}</span>
                <p className="font-mono text-xs font-medium tracking-wide text-ink-deep sm:text-sm">
                  We haven&apos;t finished building our story. We are just getting started.
                </p>
              </div>
            </RevealItem>
          </div>

          {/* Right Column: Visual Image & Complementary Highlights */}
          <div className="flex flex-col gap-5">
            <RevealItem kind="right" delay={0.15} className="group relative lg:min-h-[280px] lg:flex-1">
              <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-accent/8 blur-2xl" aria-hidden="true" />
              <div className="relative aspect-[16/10] overflow-hidden rounded-[1.25rem] lg:absolute lg:inset-0 lg:aspect-auto border border-line/70 bg-bg-soft shadow-[0_24px_56px_-28px_rgb(8_40_60/0.35)] sm:rounded-[1.5rem]">
                <RevealItem kind="zoom" delay={0.15} className="absolute inset-0">
                  <Image
                    src={ourStoryOffice}
                    alt="A bright modern IKASLE workspace with a laptop, plants, and notebook"
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover object-right transition-[scale] duration-700 ease-out group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
                    priority
                  />
                </RevealItem>
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgb(6_28_48/0.07),transparent_36%,rgb(255_255_255/0.04))]" aria-hidden="true" />

                {/* Floating pill over image */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-lg border border-white/40 bg-white/85 px-3 py-2 backdrop-blur-md sm:bottom-4 sm:left-4 sm:right-4">
                  <span className="text-xs font-semibold tracking-wide text-ink-deep">Coimbatore, India</span>
                  <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-bold text-accent">Est. 2020</span>
                </div>
              </div>
            </RevealItem>

            {/* Quick Overview Cards to fill the height symmetrically */}
            <RevealItem delay={0.25}>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="group rounded-xl border border-line/70 bg-bg-soft/70 p-4 transition-all duration-300 hover:border-accent/40 hover:bg-white hover:shadow-sm">
                  <div className="flex items-center gap-2 text-accent">
                    <Calendar className="h-4 w-4" />
                    <span className="text-[11px] font-bold tracking-wider uppercase text-ink-soft">Founded</span>
                  </div>
                  <div className="mt-1.5 text-lg font-bold text-ink-deep">2020</div>
                  <p className="mt-0.5 text-xs text-ink-soft">Born out of curiosity & learning in Coimbatore.</p>
                </div>

                <div className="group rounded-xl border border-line/70 bg-bg-soft/70 p-4 transition-all duration-300 hover:border-accent/40 hover:bg-white hover:shadow-sm">
                  <div className="flex items-center gap-2 text-accent">
                    <Globe2 className="h-4 w-4" />
                    <span className="text-[11px] font-bold tracking-wider uppercase text-ink-soft">Reach</span>
                  </div>
                  <div className="mt-1.5 text-lg font-bold text-ink-deep">UK & UAE</div>
                  <p className="mt-0.5 text-xs text-ink-soft">International portfolio across multiple markets.</p>
                </div>

                <div className="group rounded-xl border border-line/70 bg-bg-soft/70 p-4 transition-all duration-300 hover:border-accent/40 hover:bg-white hover:shadow-sm">
                  <div className="flex items-center gap-2 text-accent">
                    <Building2 className="h-4 w-4" />
                    <span className="text-[11px] font-bold tracking-wider uppercase text-ink-soft">Focus</span>
                  </div>
                  <div className="mt-1.5 text-lg font-bold text-ink-deep">Software & SaaS</div>
                  <p className="mt-0.5 text-xs text-ink-soft">Custom systems, ERP & intelligent apps.</p>
                </div>

                <div className="group rounded-xl border border-line/70 bg-bg-soft/70 p-4 transition-all duration-300 hover:border-accent/40 hover:bg-white hover:shadow-sm">
                  <div className="flex items-center gap-2 text-accent">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-[11px] font-bold tracking-wider uppercase text-ink-soft">Approach</span>
                  </div>
                  <div className="mt-1.5 text-lg font-bold text-ink-deep">Purpose-Built</div>
                  <p className="mt-0.5 text-xs text-ink-soft">Clean architecture & scalable foundations.</p>
                </div>
              </div>
            </RevealItem>
          </div>
        </div>
      </RevealGroup>
    </section>
  );
}
