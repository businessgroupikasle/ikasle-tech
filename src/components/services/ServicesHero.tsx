import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AnimatedHeading } from "@/components/animations/AnimatedHeading";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { servicePages } from "@/data/service-pages";
import "./services.css";

/* Pulse tracks sit on grid lines (multiples of the 44px .bg-grid cell). */
const PULSES = [
  { axis: "x", at: 132, duration: 9, delay: 0 },
  { axis: "x", at: 308, duration: 12, delay: 3.5 },
  { axis: "x", at: 484, duration: 10, delay: 6 },
  { axis: "y", at: 880, duration: 11, delay: 1.5 },
  { axis: "y", at: 1188, duration: 13, delay: 5 },
] as const;

/** Services page hero: GSAP word-stagger heading, CSS entrances, grid pulses, quick links to each service page. */
export function ServicesHero() {
  return (
    <section aria-labelledby="services-title" className="relative overflow-hidden pt-[calc(var(--header-h)+56px)] pb-16 sm:pb-24 lg:pt-[calc(var(--header-h)+88px)]">
      <div className="ambient" aria-hidden="true" />
      <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_60%_30%,#000_15%,transparent_70%)]" aria-hidden="true" />
      <div className="svc-pulses" aria-hidden="true">
        {PULSES.map((p) => (
          <span
            key={`${p.axis}${p.at}`}
            data-axis={p.axis}
            style={{ [p.axis === "x" ? "top" : "left"]: p.at, animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s` }}
          />
        ))}
      </div>

      <div className="container-x relative grid items-center gap-12 lg:grid-cols-[1.45fr_1fr] lg:gap-14">
        <div className="flex flex-col items-start gap-6">
          <p className="enter-up font-mono text-[13px] tracking-wide text-accent-strong">{"// WHAT WE BUILD"}</p>
          <AnimatedHeading
            as="h1"
            id="services-title"
            immediate
            text="Technology Solutions Built Around Your Business."
            highlight={["Business."]}
            className="text-[2.4rem] leading-[1.04] font-semibold tracking-[-0.04em] text-balance text-ink sm:text-6xl lg:text-[3.6rem] xl:text-[4rem]"
          />
          <p className="enter-up max-w-xl text-lg leading-relaxed text-pretty text-ink-soft [animation-delay:150ms]">
            From custom software and web applications to ERP systems and intelligent automation, we build practical digital solutions that help businesses work smarter and grow.
          </p>
          <div className="enter-up flex w-full flex-col gap-3 [animation-delay:250ms] xs:w-auto xs:flex-row">
            <MagneticButton className="flex">
              <ButtonLink href="/contact" size="lg" arrow className="w-full xs:w-auto">
                Start a Project
              </ButtonLink>
            </MagneticButton>
            <ButtonLink href="#services-overview" size="lg" variant="secondary">
              Explore Services
            </ButtonLink>
          </div>
        </div>

        {/* Quick links (desktop): the six services at a glance */}
        <nav aria-label="Services" className="enter-up hidden [animation-delay:300ms] lg:block">
          <div className="rounded-[28px] border border-accent/15 bg-white/80 p-3 shadow-soft backdrop-blur">
            <p className="px-3 pt-2 pb-3 font-mono text-[12px] text-ink-soft">services/</p>
            <ul className="grid grid-cols-2 gap-2">
              {servicePages.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="group flex h-full items-center gap-3 rounded-2xl border border-line bg-white px-3.5 py-3 text-[14px] font-medium text-ink transition-colors hover:border-accent/40 hover:text-accent-strong"
                  >
                    <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-bg-blue text-accent-strong">
                      <Icon name={s.icon} className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1 leading-snug">{s.name}</span>
                    <ArrowUpRight className="size-4 shrink-0 text-ink-soft transition-colors group-hover:text-accent-strong" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </section>
  );
}
