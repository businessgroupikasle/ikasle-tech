"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion } from "motion/react";
import { Building2, Check, ChevronRight, CircleAlert, Cpu, Rocket, Store, TrendingUp, type LucideIcon } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";
import { ButtonLink } from "@/components/ui/Button";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { Icon } from "@/components/ui/Icon";
import { getServiceDetail, servicePages, type AudienceKind, type SectionCopy, type ServiceAccent, type ServicePage } from "@/data/service-pages";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/cn";
import type { ServiceApproach, ServiceOverview } from "@/types";
import { BenefitsGraph } from "./BenefitsGraph";
import { DeliverExplorer } from "./DeliverExplorer";
import "./services.css";

/* ---------- small decorative technical details over the photo ---------- */

function Accent({ kind }: { kind: ServiceAccent }) {
  const card = "rounded-2xl border shadow-float";
  switch (kind) {
    case "workflow":
      return (
        <div className={cn(card, "flex items-center gap-2.5 border-line bg-white px-4 py-3 text-[12.5px] font-medium text-ink")}>
          <span className="pulse-dot size-2 rounded-full bg-accent" />
          <span>Automated Workflows · Enterprise Logic</span>
        </div>
      );
    case "server-render":
      return (
        <div className={cn(card, "flex items-center gap-2.5 border-line bg-white px-4 py-3 text-[12.5px] font-medium text-ink")}>
          <span className="pulse-dot size-2 rounded-full bg-success" />
          <span>High Performance · 99.9% Availability</span>
        </div>
      );
    case "platforms":
      return (
        <div className={cn(card, "flex items-center gap-2 border-line bg-white px-3 py-2.5 font-mono text-[11.5px]")}>
          {["iOS", "Android"].map((p) => (
            <span key={p} className="rounded-lg bg-bg-blue px-2.5 py-1 text-accent-strong">
              {p}
            </span>
          ))}
          <span className="px-1 text-ink-soft">one codebase</span>
        </div>
      );
    case "erp-sync":
      return (
        <div className={cn(card, "min-w-[210px] border-line bg-white px-4 py-3 text-[12.5px]")}>
          {["Stock", "Orders", "Production"].map((r) => (
            <p key={r} className="flex items-center justify-between gap-6 py-0.5">
              <span className="font-medium text-ink">{r}</span>
              <span className="flex items-center gap-1.5 font-mono text-[11px] text-success">
                <span className="size-1.5 rounded-full bg-success" /> in sync
              </span>
            </p>
          ))}
        </div>
      );
    case "ai-extract":
      return (
        <div className={cn(card, "flex items-center gap-2.5 border-line bg-white px-4 py-3 text-[12.5px] font-medium text-ink")}>
          <span className="pulse-dot size-2 rounded-full bg-accent" />
          <span>Intelligent Extraction · Automated Workflows</span>
        </div>
      );
    case "tokens":
      return (
        <div className={cn(card, "flex items-center gap-2.5 border-line bg-white px-4 py-3 font-mono text-[11.5px] text-ink-soft")}>
          {[brand.navy, brand.blue, brand.blueLight].map((c) => (
            <span key={c} className="size-5 rounded-md border border-line" style={{ background: c }} />
          ))}
          <span>tokens · radius 12</span>
        </div>
      );
  }
}

/* ---------- pieces ---------- */

function Breadcrumb({ page }: { page: ServicePage }) {
  return (
    <nav aria-label="Breadcrumb" className="enter-up">
      <ol className="flex flex-wrap items-center gap-1.5 text-[13.5px] text-ink-soft">
        <li>
          <Link href="/" className="transition-colors hover:text-accent-strong">
            Home
          </Link>
        </li>
        <ChevronRight className="size-3.5 text-ink-soft/60" aria-hidden="true" />
        <li>
          <Link href="/services" className="transition-colors hover:text-accent-strong">
            Services
          </Link>
        </li>
        <ChevronRight className="size-3.5 text-ink-soft/60" aria-hidden="true" />
        <li aria-current="page" className="font-medium text-ink">
          {page.name}
        </li>
      </ol>
    </nav>
  );
}

function Visual({ page }: { page: ServicePage }) {
  const { service } = getServiceDetail(page.slug)!;
  return (
    <div className="relative pb-6 lg:h-full lg:pb-0">
      <div className="svc-image-reveal relative aspect-[4/3] overflow-hidden rounded-[24px] border border-line bg-bg-soft shadow-soft lg:aspect-auto lg:h-full lg:min-h-95">
        <motion.div whileHover={{ scale: 1.04 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-0">
          <Image
            src={service.image.src}
            alt={service.image.alt}
            fill
            priority
            sizes="(min-width: 1024px) 560px, 92vw"
            className="object-cover"
            style={{ objectPosition: service.image.position }}
          />
        </motion.div>
      </div>
      <div className="enter-up absolute bottom-0 left-4 max-w-[88%] [animation-delay:450ms] sm:left-6 lg:-bottom-6" aria-hidden="true">
        <Accent kind={page.accent} />
      </div>
    </div>
  );
}

const h2 = "text-[1.75rem] leading-[1.15] font-semibold tracking-[-0.03em] text-balance text-ink sm:text-[2.1rem]";
const eyebrow = "mt-2 font-mono text-[12px] tracking-wide text-accent-strong uppercase";
const subheading = "text-[1.25rem] leading-snug font-semibold tracking-[-0.02em] text-balance text-ink sm:text-[1.4rem]";
/** Card rows that centre a short last row (e.g. 7 cards → 3 + 3 + 1 centred) instead of leaving a gap. */
const cardRow = "flex flex-wrap justify-center gap-4";
const cardCell3 = "w-full sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)]";

/** Section title plus optional small label, sub-heading and intro, shared by the long-form sections. */
function SectionIntro({ id, title, copy, center = false }: { id: string; title: string; copy?: SectionCopy; center?: boolean }) {
  return (
    <div data-reveal className={cn(center && "mx-auto max-w-3xl text-center")}>
      <h2 id={id} className={h2}>
        {title}
      </h2>
      {copy?.eyebrow && <p className={eyebrow}>{copy.eyebrow}</p>}
      {copy?.heading && <p className={cn("mt-5 max-w-2xl", center && "mx-auto", subheading)}>{copy.heading}</p>}
      {copy?.intro && <p className={cn("mt-4 max-w-2xl text-justify text-[16.5px] leading-relaxed text-ink-soft", center && "mx-auto")}>{copy.intro}</p>}
    </div>
  );
}

const audienceIcons: Record<AudienceKind, LucideIcon> = { startup: Rocket, smb: Store, enterprise: Building2 };


/** "Who needs this?": one card per kind of business, with a matching icon. */
function AudiencesSection({ audiences }: { audiences: NonNullable<ServicePage["audiences"]> }) {
  return (
    <section aria-labelledby="service-audiences" className="border-b border-line py-16 sm:py-20">
      <div className="container-x">
        <div data-reveal>
          <h2 id="service-audiences" className={h2}>
            {audiences.title}
          </h2>
          <p className={eyebrow}>{audiences.eyebrow}</p>
        </div>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {audiences.items.map((item) => {
            const AudienceIcon = audienceIcons[item.kind];
            return (
              <li
                key={item.title}
                data-reveal
                className="group relative overflow-hidden rounded-[20px] border border-line bg-white p-6 shadow-[0_8px_24px_-20px_rgb(8_40_60/0.35)] transition-colors hover:border-accent/40 sm:p-7"
              >
                <span className="absolute inset-x-0 top-0 h-1 bg-accent/70 transition-colors group-hover:bg-accent" aria-hidden="true" />
                <span className="grid size-12 place-items-center rounded-2xl bg-bg-blue text-accent-strong" aria-hidden="true">
                  <AudienceIcon className="size-5.5" />
                </span>
                <h3 className="mt-5 text-[18px] leading-snug font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{item.text}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/** Engineering approach: intro on the left (pinned while scrolling on desktop), numbered steps on a timeline on the right. */
function ApproachSection({ approach }: { approach: ServiceApproach }) {
  return (
    <section aria-labelledby="service-approach" className="bg-bg-soft py-16 sm:py-20">
      <div className="container-x grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div data-reveal className="min-w-0 lg:sticky lg:top-[calc(var(--header-h)+32px)]">
          <h2 id="service-approach" className={h2}>
            {approach.title ?? "Our Engineering Approach"}
          </h2>
          {approach.eyebrow && <p className={eyebrow}>{approach.eyebrow}</p>}
          {approach.heading && <p className={cn("mt-6", subheading)}>{approach.heading}</p>}
          {approach.intro && <p className="mt-4 text-justify text-[16.5px] leading-relaxed text-ink-soft">{approach.intro}</p>}
        </div>
        <ol className="relative min-w-0">
          {approach.steps.map((step, i) => (
            <li key={step.title} data-reveal className="relative flex gap-5 pb-8 last:pb-0">
              {/* Timeline line joining each number to the next. */}
              {i < approach.steps.length - 1 && <span className="absolute top-11 bottom-0 left-5 w-px -translate-x-1/2 bg-accent/25" aria-hidden="true" />}
              <span className="relative grid size-10 shrink-0 place-items-center rounded-full border border-accent/30 bg-white font-mono text-[13px] font-semibold text-accent-strong" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1 rounded-2xl border border-line bg-white p-5 shadow-[0_8px_24px_-20px_rgb(8_40_60/0.35)]">
                <h3 className="text-[16.5px] leading-snug font-semibold text-ink">{step.title}</h3>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-soft">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Long-form overview: story on the left, titled challenges in a card on the right. */
function OverviewSection({ overview }: { overview: ServiceOverview }) {
  return (
    <section aria-labelledby="service-overview" className="bg-bg-soft py-16 sm:py-20">
      <div className="container-x grid items-start gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div data-reveal className="min-w-0">
          <h2 id="service-overview" className={h2}>
            Service Overview
          </h2>
          {overview.eyebrow && <p className={eyebrow}>{overview.eyebrow}</p>}
          <h3 className={cn("mt-6", subheading)}>{overview.heading}</h3>
          <div className="mt-4 flex flex-col gap-4 text-justify text-[16.5px] leading-relaxed text-ink-soft">
            {overview.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          {overview.closing && (
            <p className="mt-6 flex gap-3 rounded-2xl border border-accent/25 bg-white px-5 py-4 text-[16.5px] leading-relaxed font-semibold text-ink">
              <Check className="mt-1 size-4.5 shrink-0 text-accent-strong" aria-hidden="true" />
              {overview.closing}
            </p>
          )}
        </div>
        <div data-reveal className="min-w-0 rounded-[20px] border border-line bg-white p-6 sm:p-7">
          <h2 className="flex items-center gap-2 text-[17px] font-semibold text-ink">
            <CircleAlert className="size-4.5 text-accent-strong" aria-hidden="true" /> Challenges We Solve
          </h2>
          {overview.challengesEyebrow && <p className={eyebrow}>{overview.challengesEyebrow}</p>}
          {overview.challengesIntro && (
            <div className="mt-4 flex flex-col gap-3 text-justify text-[15px] leading-relaxed text-ink-soft">
              {overview.challengesIntro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          )}
          <ul className={cn("mt-5 flex flex-col divide-y divide-line", overview.challenges.some((c) => !c.text) && "[&>li]:py-3")}>
            {overview.challenges.map((challenge) => (
              <li key={challenge.title} className="flex gap-3 py-4 first:pt-0 last:pb-0">
                <span className={cn("size-1.5 shrink-0 rounded-full bg-accent", challenge.text ? "mt-2.25" : "mt-2")} aria-hidden="true" />
                {challenge.text ? (
                  <div className="min-w-0">
                    <h3 className="text-[15.5px] leading-snug font-semibold text-ink">{challenge.title}</h3>
                    <p className="mt-1 text-[14.5px] leading-relaxed text-ink-soft">{challenge.text}</p>
                  </div>
                ) : (
                  <p className="min-w-0 text-[15px] leading-snug font-medium text-ink">{challenge.title}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/**
 * One service's detail page (everything between the shared header and the contact CTA / footer).
 * Content comes from src/data/service-pages.ts (page copy) and src/data/services.ts (photo, problems,
 * technologies, engineering capabilities) — nothing here is service-specific.
 *
 * Animation: the hero uses CSS entrances (they start at first paint, not after hydration) and a CSS image
 * reveal; GSAP batches the scroll reveals of the [data-reveal] blocks below it, staggering list items.
 * Motion owns only the photo's hover zoom, on an inner element, so the two never animate the same node.
 */
export function ServiceDetail({ slug }: { slug: string }) {
  const root = useRef<HTMLDivElement>(null);
  const { page, service } = getServiceDetail(slug)!;
  const index = servicePages.indexOf(page);
  const contactHref = page.cta?.href ?? `/contact?type=${encodeURIComponent(service.projectType)}`;
  const contactLabel = page.cta?.label ?? "Start a Project";

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-reveal]");
        // Opacity only (no visibility: hidden), so links stay keyboard-focusable before they are revealed.
        gsap.set(items, { opacity: 0, y: 24 });
        ScrollTrigger.batch(items, {
          start: "top 92%",
          once: true,
          onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.07, overwrite: true }),
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      {/* ---------- Hero ---------- */}
      <section aria-labelledby="service-title" className="relative overflow-hidden pt-[calc(var(--header-h)+32px)] pb-16 sm:pb-20">
        <div className="ambient" aria-hidden="true" />
        <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_60%_30%,#000_15%,transparent_70%)]" aria-hidden="true" />
        <div className="container-x relative">
          <Breadcrumb page={page} />
          {/* Desktop: the photo stretches to the text column's height so both sides line up top and bottom. */}
          <div className="mt-8 grid items-center gap-10 lg:mt-10 lg:grid-cols-2 lg:items-stretch lg:gap-16">
            <div className="flex min-w-0 flex-col items-start">
              <div className="enter-up flex items-center gap-3 [animation-delay:60ms]">
                <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-bg-blue text-accent-strong">
                  <Icon name={page.icon} className="size-5" />
                </span>
                <p className="font-mono text-[12.5px] text-ink-soft">
                  {String(index + 1).padStart(2, "0")} · {page.name}
                </p>
              </div>
              <h1
                id="service-title"
                className="enter-up mt-5 text-[2.2rem] leading-[1.06] font-semibold tracking-[-0.04em] text-balance text-ink [animation-delay:120ms] sm:text-5xl lg:text-[3.3rem]"
              >
                {page.heading}
              </h1>
              <div className="enter-up mt-5 flex max-w-xl flex-col gap-4 text-justify text-[17px] leading-relaxed hyphens-auto text-pretty text-ink-soft [animation-delay:200ms] sm:text-lg">
                {page.intro.split(/\n\s*\n/).map((paragraph) => (
                  <p key={paragraph}>{paragraph.trim()}</p>
                ))}
              </div>
              <div className="enter-up mt-8 flex w-full flex-col gap-3 [animation-delay:280ms] xs:w-auto xs:flex-row">
                <MagneticButton className="flex">
                  <ButtonLink href={contactHref} size="lg" arrow className="w-full xs:w-auto">
                    {contactLabel}
                  </ButtonLink>
                </MagneticButton>
                <ButtonLink href="/services" size="lg" variant="secondary">
                  All Services
                </ButtonLink>
              </div>
            </div>
            <div className="min-w-0 lg:h-full">
              <Visual page={page} />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Overview + challenges ---------- */}
      {service.overview ? (
        <OverviewSection overview={service.overview} />
      ) : (
      <section aria-labelledby="service-overview" className="bg-bg-soft py-16 sm:py-20">
        <div className="container-x grid items-start gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div data-reveal className="min-w-0">
            <h2 id="service-overview" className={h2}>
              Service Overview
            </h2>
            <p className="mt-5 text-justify text-[18px] leading-relaxed font-medium text-ink">{service.summary}</p>
            <p className="mt-4 text-justify text-[16.5px] leading-relaxed text-ink-soft">{service.description}</p>
          </div>
          <div data-reveal className="min-w-0 rounded-[20px] border border-line bg-white p-6 sm:p-7">
            <h2 className="flex items-center gap-2 text-[17px] font-semibold text-ink">
              <CircleAlert className="size-4.5 text-accent-strong" aria-hidden="true" /> Challenges We Solve
            </h2>
            <ul className="mt-4 flex flex-col gap-3">
              {service.problems.map((p) => (
                <li key={p} className="flex gap-3 text-[15px] leading-snug text-ink-soft">
                  <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      )}

      {/* ---------- What we deliver ---------- */}
      <section aria-labelledby="service-deliver" className="py-16 sm:py-20">
        <div className="container-x">
          {page.deliver ? (
            <>
              <SectionIntro id="service-deliver" title={page.deliver.title} copy={page.deliver} />
              <DeliverExplorer items={page.deliver.items} />
            </>
          ) : (
            <>
              <h2 id="service-deliver" data-reveal className={h2}>
                What We Deliver
              </h2>
              <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {page.capabilities.map((c) => (
                  <li key={c} data-reveal className="flex gap-3 rounded-2xl border border-line bg-white p-5 text-[15.5px] leading-snug font-medium text-ink shadow-[0_8px_24px_-20px_rgb(8_40_60/0.35)]">
                    <Check className="mt-0.5 size-4.5 shrink-0 text-success" aria-hidden="true" />
                    {c}
                  </li>
                ))}
              </ul>
            </>
          )}

          {!service.approach && (
          <div data-reveal className="mt-10 rounded-[20px] border border-accent/15 bg-bg-blue/50 p-6 sm:p-7">
            <h3 className="flex items-center gap-2 text-[15px] font-semibold text-ink">
              <Cpu className="size-4 text-accent-strong" aria-hidden="true" /> How we build it
            </h3>
            <ul className="mt-4 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
              {service.capabilities.map((c) => (
                <li key={c} className="flex gap-2.5 text-[14.5px] leading-snug text-ink-soft">
                  <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
          )}
        </div>
      </section>

      {page.features && (
        <section aria-labelledby="service-features" className="border-t border-line py-16 sm:py-20">
          <div className="container-x">
            <SectionIntro id="service-features" title={page.features.title} copy={page.features} />
            <ul className={cn("mt-8", cardRow)}>
              {page.features.items.map((item) => (
                <li key={item.title} data-reveal className={cn(cardCell3, "rounded-2xl border border-line bg-white p-6 shadow-[0_8px_24px_-20px_rgb(8_40_60/0.35)]")}>
                  <span className="grid size-10 place-items-center rounded-xl bg-bg-blue text-accent-strong" aria-hidden="true">
                    <Cpu className="size-5" />
                  </span>
                  <h3 className="mt-4 text-[16.5px] leading-snug font-semibold text-ink">{item.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-ink-soft">{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {service.approach && <ApproachSection approach={service.approach} />}

      {page.deliverables && (
        <section aria-labelledby="service-deliverables" className="py-16 sm:py-20">
          <div className="container-x">
            <SectionIntro id="service-deliverables" title={page.deliverables.title} />
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {page.deliverables.items.map((item) => (
                <li key={item} data-reveal className="flex gap-3 rounded-2xl border border-line bg-white px-5 py-4 text-[15.5px] leading-snug font-medium text-ink shadow-[0_8px_24px_-20px_rgb(8_40_60/0.35)]">
                  <Check className="mt-0.5 size-4.5 shrink-0 text-success" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ---------- Benefits, related work ---------- */}
      {/* Top border: the process timeline above shares this light background, so this keeps the two apart. */}
      <section aria-labelledby="service-benefits" className="border-t border-line bg-bg-soft py-16 sm:py-20">
        <div className="container-x">
          {page.benefitDetails ? (
            <>
              <SectionIntro id="service-benefits" title={page.benefitDetails.title ?? "Business Benefits"} copy={page.benefitDetails} center />
              <BenefitsGraph items={page.benefitDetails.items} />
            </>
          ) : (
            <>
              <h2 id="service-benefits" data-reveal className={h2}>
                Business Benefits
              </h2>
              <ul className="mt-8 grid gap-4 sm:grid-cols-3">
                {page.benefits.map((b) => (
                  <li key={b} data-reveal className="rounded-2xl border border-accent/15 bg-white p-5 text-[15px] leading-snug font-medium text-ink shadow-[0_8px_24px_-18px_rgb(8_40_60/0.35)]">
                    <TrendingUp className="mb-3 size-5 text-accent-strong" aria-hidden="true" />
                    {b}
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* {page.related.length > 0 && (
            <div data-reveal className="mt-12">
              <h2 className={h3}>Related Work</h2>
              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
                {page.related.map((r) => (
                  <li key={r.href}>
                    {r.external ? (
                      <a
                        href={r.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[15.5px] font-medium text-ink underline decoration-accent/40 underline-offset-4 hover:text-accent-strong"
                      >
                        {r.label}
                        <ArrowUpRight className="size-3.5" aria-hidden="true" />
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    ) : (
                      <Link href={r.href} className="inline-flex items-center gap-1 text-[15.5px] font-medium text-ink underline decoration-accent/40 underline-offset-4 hover:text-accent-strong">
                        {r.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )} */}
        </div>
      </section>

      {page.audiences && <AudiencesSection audiences={page.audiences} />}
    </div>
  );
}
