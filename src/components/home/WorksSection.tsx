"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, FolderOpen } from "lucide-react";
import { works, type Work } from "@/data/works";
import { SectionHeading } from "@/components/ui/SectionHeading";
import "./WorksSection.css";
import { Reveal } from "@/components/animations/Reveal";

// Client-only: Folder derives its colour shades with a canvas, which the server can't, so a server render
// would never match. The stage reserves the folder's exact space, so nothing shifts when it mounts.
const Folder = dynamic(() => import("@/components/react-bits/Folder/Folder"), { ssr: false });

/* Folder geometry (flap mode, from the component): 224 × 196 px at size 1; three open pages spread to about
   1.55× its width and rise ~70px above it, and a zoomed page reaches ~40px above it. */
const FOLDER_W = 224;
const FOLDER_H = 196;
const SPREAD = 1.62;
const fitSize = (stageWidth: number) => Math.min(1.35, Math.max(0.6, (stageWidth - 32) / (FOLDER_W * SPREAD)));

function ShotPage({ work, index }: { work: Work; index: 0 | 1 }) {
  const shot = work.shot!;
  return (
    <div className="works-shot">
      <Image
        src={shot.src}
        alt={index === 0 ? shot.alt : `${shot.alt} (detail)`}
        fill
        sizes="360px"
        className="object-cover"
        style={{ objectPosition: shot.focus[index] }}
        draggable={false}
      />
    </div>
  );
}

function BriefPage({ work }: { work: Work }) {
  return (
    <div className="folder-doc works-brief">
      <span className="folder-doc-title">{work.name}</span>
      <span className="folder-doc-text">{work.type}</span>
      <span className="folder-doc-line" style={{ width: "92%" }} />
      <span className="folder-doc-line" style={{ width: "84%" }} />
      <span className="folder-doc-line" style={{ width: "70%" }} />
      <span className="works-brief-tags">
        {work.tags.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </span>
      <span className="works-brief-foot">IKASLE · works</span>
    </div>
  );
}

/** Illustrative phone screen for projects without screenshots — labelled as a mockup on the page itself. */
function PhonePage({ work, variant }: { work: Work; variant: 0 | 1 }) {
  return (
    <div className="works-phone" role="img" aria-label={`${work.name} — illustrative mobile app mockup`}>
      <div className="works-phone-frame">
        <div className="works-phone-screen">
          <span className="works-phone-notch" />
          <span className="works-phone-title">{work.name}</span>
          {variant === 0 ? (
            <>
              <span className="works-phone-hero" />
              <span className="works-phone-row" />
              <span className="works-phone-row" style={{ width: "78%" }} />
              <span className="works-phone-row" style={{ width: "86%" }} />
            </>
          ) : (
            <>
              <span className="works-phone-tiles">
                <span />
                <span />
                <span />
                <span />
              </span>
              <span className="works-phone-row" style={{ width: "82%" }} />
            </>
          )}
          <span className="works-phone-tabbar">
            <span />
            <span />
            <span />
            <span />
          </span>
        </div>
      </div>
      <span className="works-phone-note">Illustrative mockup</span>
    </div>
  );
}

function WorkCard({ work, index }: { work: Work; index: number }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(1);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const ro = new ResizeObserver(([entry]) => {
      const next = Math.round(fitSize(entry!.contentRect.width) * 100) / 100;
      setSize((prev) => (prev === next ? prev : next));
    });
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  const pages = work.shot
    ? [<ShotPage key="a" work={work} index={0} />, <BriefPage key="b" work={work} />, <ShotPage key="c" work={work} index={1} />]
    : [<PhonePage key="a" work={work} variant={0} />, <BriefPage key="b" work={work} />, <PhonePage key="c" work={work} variant={1} />];

  const titleId = `work-${work.slug}`;
  const domain = work.url ? new URL(work.url).hostname : null;

  return (
    <article aria-labelledby={titleId} className="works-card flex min-w-0 flex-col rounded-[24px] border border-line bg-white shadow-soft">
      <div
        ref={stageRef}
        className="relative flex justify-center"
        style={{ paddingTop: Math.round(78 * size + 18), paddingBottom: Math.round(28 * size + 10) }}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-t-[23px] bg-gradient-to-b from-bg-soft to-white" aria-hidden="true">
          <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_50%_60%,#000_35%,transparent_80%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_45%_55%_at_50%_70%,rgb(0_140_248/0.10),transparent_70%)]" />
        </div>
        <div className="relative" style={{ width: Math.round(FOLDER_W * size), height: Math.round(FOLDER_H * size) }}>
          <Folder
            label={work.name}
            color={work.color}
            paperColor="#ffffff"
            theme="light"
            size={size}
            open={open}
            onOpenChange={setOpen}
            draggable={false}
            tilt={0.35}
            bounce={0.35}
          >
            {pages}
          </Folder>
        </div>
      </div>

      <div className="flex flex-1 flex-col border-t border-line px-6 pt-6 pb-6 sm:px-7">
        <p className="font-mono text-[12px] text-accent-strong">
          {String(index + 1).padStart(2, "0")} — {work.type}
        </p>
        <h3 id={titleId} className="mt-2 text-2xl font-semibold tracking-tight text-ink">
          {work.name}
        </h3>
        <p className="mt-2.5 flex-1 text-[15px] leading-relaxed text-ink-soft">{work.description}</p>
        <ul className="mt-4 flex flex-wrap gap-2" aria-label={`${work.name} categories`}>
          {work.tags.map((t) => (
            <li key={t} className="rounded-full border border-line bg-bg-soft px-2.5 py-0.5 font-mono text-[11.5px] text-ink-soft">
              {t}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
          {work.url ? (
            <a
              href={work.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group/cta inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-strong"
            >
              {work.cta}
              <ArrowUpRight className="size-4 transition-transform group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" aria-hidden="true" />
              <span className="sr-only">(opens {domain} in a new tab)</span>
            </a>
          ) : (
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-strong"
            >
              {work.cta}
              <FolderOpen className="size-4" aria-hidden="true" />
            </button>
          )}
          {domain ? (
            <span className="font-mono text-[12px] text-ink-soft">{domain}</span>
          ) : (
            <span className="text-[12.5px] text-ink-soft">Previews are an illustrative mockup, not app screenshots.</span>
          )}
        </div>
      </div>
    </article>
  );
}

export function WorksSection() {
  return (
    <section aria-labelledby="works-title" className="relative overflow-hidden bg-white py-20 sm:py-24">
      <div className="container-x">
        <SectionHeading
          id="works-title"
          title="Works"
          description="Real products we’ve designed, built, and launched across e-commerce, ERP, and mobile."
        />
        <p className="mt-5 inline-flex items-center gap-2 font-mono text-[12px] text-ink-soft">
          <FolderOpen className="size-3.5 text-accent-strong" aria-hidden="true" />
          Open a folder to look inside · select a page to zoom
        </p>
        <Reveal className="mt-12 grid gap-6 md:grid-cols-2 lg:gap-8">
          {works.map((w, i) => (
            <WorkCard key={w.slug} work={w} index={i} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
