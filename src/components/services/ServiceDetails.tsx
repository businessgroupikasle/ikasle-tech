"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Check, CircleAlert, TrendingUp } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { getService } from "@/data/services";
import { servicePages, type ServiceAccent, type ServicePage } from "@/data/service-pages";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/cn";

/* ---------- small decorative technical details over each photo ---------- */

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

/* ---------- one service ---------- */

function Visual({ page, flip }: { page: ServicePage; flip: boolean }) {
  const service = getService(page.slug)!;
  return (
    <div data-reveal className="relative pb-6">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] border border-line bg-bg-soft shadow-soft">
        <motion.div whileHover={{ scale: 1.04 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-0">
          <Image
            src={service.image.src}
            alt={service.image.alt}
            fill
            sizes="(min-width: 1024px) 560px, 92vw"
            className="object-cover"
            style={{ objectPosition: service.image.position }}
          />
        </motion.div>
      </div>
      <div className={cn("absolute bottom-0 max-w-[88%]", flip ? "right-4 sm:right-6" : "left-4 sm:left-6")} aria-hidden="true">
        <Accent kind={page.accent} />
      </div>
    </div>
  );
}

function Challenges({ page }: { page: ServicePage }) {
  const service = getService(page.slug)!;
  return (
    <div data-reveal className="rounded-[20px] border border-line bg-white p-5 sm:p-6">
      <h3 className="flex items-center gap-2 text-[15px] font-semibold text-ink">
        <CircleAlert className="size-4 text-accent-strong" aria-hidden="true" /> Challenges we solve
      </h3>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {service.problems.map((p) => (
          <li key={p} className="flex gap-2.5 text-[14.5px] leading-snug text-ink-soft">
            <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ServiceSection({ page, index }: { page: ServicePage; index: number }) {
  const service = getService(page.slug)!;
  const flip = index % 2 === 1;
  const titleId = `${page.slug}-title`;

  return (
    <section
      id={page.slug}
      aria-labelledby={titleId}
      className={cn("py-20 sm:py-24", index % 2 === 1 ? "bg-bg-soft" : "bg-white")}
    >
      <div className="container-x grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Visual + the problems it solves */}
        <div className={cn("hidden min-w-0 lg:sticky lg:top-[calc(var(--header-h)+32px)] lg:block", flip && "lg:order-2")}>
          {/* desktop: photo + challenges beside the content (on phones they follow the intro) */}
          <Visual page={page} flip={flip} />
          <div className="mt-6">
            <Challenges page={page} />
          </div>
        </div>

        {/* What we deliver */}
        <div className={cn("min-w-0", flip && "lg:order-1")}>
          <div data-reveal className="flex items-center gap-3">
            <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-bg-blue text-accent-strong">
              <Icon name={page.icon} className="size-5" />
            </span>
            <span className="font-mono text-[12.5px] text-ink-soft">
              {String(index + 1).padStart(2, "0")} · {page.name}
            </span>
          </div>
          <h2 id={titleId} data-reveal className="mt-5 text-[2rem] leading-[1.1] font-semibold tracking-[-0.035em] text-balance text-ink sm:text-[2.6rem]">
            {page.heading}
          </h2>
          <p data-reveal className="mt-4 text-[17px] leading-relaxed text-ink-soft">
            {page.intro}
          </p>

          {/* phones/tablets: heading first, then the photo and the challenges */}
          <div className="mt-8 flex flex-col gap-6 lg:hidden">
            <Visual page={page} flip={flip} />
            <Challenges page={page} />
          </div>

          <div data-reveal className="mt-8">
            <h3 className="font-mono text-[12px] tracking-wide text-accent-strong uppercase">What we deliver</h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {page.capabilities.map((c) => (
                <li key={c} className="flex gap-3 text-[15.5px] leading-snug text-ink">
                  <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <div data-reveal className="mt-8">
            <h3 className="font-mono text-[12px] tracking-wide text-accent-strong uppercase">Business benefits</h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-3">
              {page.benefits.map((b) => (
                <li key={b} className="rounded-2xl border border-accent/15 bg-white p-4 text-[14.5px] leading-snug font-medium text-ink shadow-[0_8px_24px_-18px_rgb(8_40_60/0.35)]">
                  <TrendingUp className="mb-2 size-4 text-accent-strong" aria-hidden="true" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div data-reveal className="mt-8">
            <h3 className="font-mono text-[12px] tracking-wide text-accent-strong uppercase">Technologies we use</h3>
            <ul className="mt-3 flex flex-wrap gap-2" aria-label={`${page.name} technologies`}>
              {service.technologies.map((t) => (
                <li key={t} className="rounded-full border border-line bg-white px-3 py-1 font-mono text-[12px] text-ink-soft">
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {page.related.length > 0 && (
            <div data-reveal className="mt-8">
              <h3 className="font-mono text-[12px] tracking-wide text-accent-strong uppercase">Related work</h3>
              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                {page.related.map((r) => (
                  <li key={r.href}>
                    {r.external ? (
                      <a href={r.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[15px] font-medium text-ink underline decoration-accent/40 underline-offset-4 hover:text-accent-strong">
                        {r.label}
                        <ArrowUpRight className="size-3.5" aria-hidden="true" />
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    ) : (
                      <Link href={r.href} className="inline-flex items-center gap-1 text-[15px] font-medium text-ink underline decoration-accent/40 underline-offset-4 hover:text-accent-strong">
                        {r.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div data-reveal className="mt-10">
            <ButtonLink href={`/contact?type=${encodeURIComponent(service.projectType)}`} arrow>
              Discuss Your Project
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * All six detailed service sections. GSAP owns the scroll reveals (on the [data-reveal] wrappers only);
 * Motion owns the photo hover zoom on an inner element, so the two never animate the same node.
 */
export function ServiceDetails() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-reveal]");
        // Opacity only (no visibility: hidden), so links stay keyboard-focusable before they are revealed.
        gsap.set(items, { opacity: 0, y: 28 });
        ScrollTrigger.batch(items, {
          start: "top 90%",
          once: true,
          onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.08, overwrite: true }),
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      {servicePages.map((p, i) => (
        <ServiceSection key={p.slug} page={p} index={i} />
      ))}
    </div>
  );
}
