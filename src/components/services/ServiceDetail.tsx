"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight, Check, ChevronRight, CircleAlert, Cpu, TrendingUp } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";
import { ButtonLink } from "@/components/ui/Button";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { Icon } from "@/components/ui/Icon";
import { getServiceDetail, servicePages, type ServiceAccent, type ServicePage } from "@/data/service-pages";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/cn";
import "./services.css";

/* ---------- small decorative technical details over the photo ---------- */

function Accent({ kind }: { kind: ServiceAccent }) {
  const card = "rounded-2xl border shadow-float";
  switch (kind) {
    case "workflow":
      return (
        <div className={cn(card, "border-editor-line bg-editor px-4 py-3 font-mono text-[11.5px] leading-relaxed")}>
          <p className="tok-muted">{"// approvals, defined once"}</p>
          <p>
            <span className="tok-fn">workflow</span>
            <span className="tok-punct">(</span>
            <span className="tok-string">&quot;order.approved&quot;</span>
            <span className="tok-punct">)</span>
          </p>
          <p className="pl-3">
            <span className="tok-punct">.</span>
            <span className="tok-fn">notify</span>
            <span className="tok-punct">(</span>
            <span className="tok-string">&quot;warehouse&quot;</span>
            <span className="tok-punct">)</span>
          </p>
        </div>
      );
    case "server-render":
      return (
        <div className={cn(card, "flex items-center gap-2.5 border-line bg-white px-4 py-3 font-mono text-[11.5px] text-ink")}>
          <span className="pulse-dot size-2 rounded-full bg-success" />
          app/dashboard/page.tsx <span className="text-ink-soft">· rendered on the server</span>
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
        <div className={cn(card, "border-editor-line bg-editor px-4 py-3 font-mono text-[11.5px] leading-relaxed")}>
          <p>
            <span className="tok-plain">invoice.pdf</span> <span className="tok-muted">→</span> <span className="tok-fn">extract</span>
            <span className="tok-punct">()</span>
          </p>
          <p>
            <span className="tok-punct">{"{ "}</span>
            <span className="tok-prop">total</span>
            <span className="tok-punct">, </span>
            <span className="tok-prop">dueDate</span>
            <span className="tok-punct">, </span>
            <span className="tok-prop">route</span>
            <span className="tok-punct">{" }"}</span>
          </p>
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
    <div className="relative pb-6">
      <div className="svc-image-reveal relative aspect-[4/3] overflow-hidden rounded-[24px] border border-line bg-bg-soft shadow-soft">
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
      <div className="enter-up absolute bottom-0 left-4 max-w-[88%] [animation-delay:450ms] sm:left-6" aria-hidden="true">
        <Accent kind={page.accent} />
      </div>
    </div>
  );
}

const h2 = "text-[1.75rem] leading-[1.15] font-semibold tracking-[-0.03em] text-balance text-ink sm:text-[2.1rem]";
const h3 = "text-[1.3rem] leading-tight font-semibold tracking-[-0.02em] text-ink";

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
  const others = servicePages.filter((p) => p.slug !== slug);

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
          <div className="mt-8 grid items-center gap-10 lg:mt-10 lg:grid-cols-2 lg:gap-16">
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
              <p className="enter-up mt-5 max-w-xl text-[17px] leading-relaxed text-pretty text-ink-soft [animation-delay:200ms] sm:text-lg">{page.intro}</p>
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
            <div className="min-w-0">
              <Visual page={page} />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Overview + challenges ---------- */}
      <section aria-labelledby="service-overview" className="bg-bg-soft py-16 sm:py-20">
        <div className="container-x grid items-start gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div data-reveal className="min-w-0">
            <h2 id="service-overview" className={h2}>
              Service Overview
            </h2>
            <p className="mt-5 text-[18px] leading-relaxed font-medium text-ink">{service.summary}</p>
            <p className="mt-4 text-[16.5px] leading-relaxed text-ink-soft">{service.description}</p>
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

      {/* ---------- What we deliver ---------- */}
      <section aria-labelledby="service-deliver" className="py-16 sm:py-20">
        <div className="container-x">
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
        </div>
      </section>

      {/* ---------- Technologies ---------- */}
      <section aria-labelledby="service-technologies" className="border-y border-line py-14 sm:py-16">
        <div className="container-x">
          <h2 id="service-technologies" data-reveal className={h2}>
            Technologies We Use
          </h2>
          <ul className="mt-7 flex flex-wrap gap-3">
            {service.technologies.map((technology) => (
              <li key={technology} data-reveal className="rounded-xl border border-line bg-white px-4 py-2.5 font-mono text-[13px] font-medium text-ink shadow-[0_8px_20px_-18px_rgb(8_40_60/0.4)]">
                {technology}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Benefits, related work ---------- */}
      <section aria-labelledby="service-benefits" className="bg-bg-soft py-16 sm:py-20">
        <div className="container-x">
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

          {page.related.length > 0 && (
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
          )}
        </div>
      </section>

      {/* ---------- Other services ---------- */}
      <nav aria-labelledby="other-services" className="py-16 sm:py-20">
        <div className="container-x">
          <h2 id="other-services" data-reveal className={h3}>
            Explore Other Services
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {others.map((o) => (
              <li key={o.slug} data-reveal>
                <Link
                  href={`/services/${o.slug}`}
                  className="group flex h-full items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3.5 text-[14px] font-medium text-ink transition-colors hover:border-accent/40 hover:text-accent-strong"
                >
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-bg-blue text-accent-strong">
                    <Icon name={o.icon} className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1 leading-snug">{o.name}</span>
                  <ArrowRight className="size-4 shrink-0 text-ink-soft transition-transform group-hover:translate-x-0.5 group-hover:text-accent-strong" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
}
