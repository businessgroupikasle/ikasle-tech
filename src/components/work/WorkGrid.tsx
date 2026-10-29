"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, FolderSearch, MessageSquare } from "lucide-react";
import type { Project, ProjectCategory } from "@/types";
import type { Work } from "@/data/works";
import { ProjectVisual } from "./ProjectVisual";
import { Badge } from "@/components/ui/Badge";
import { BrowserFrame, PhoneFrame } from "@/components/ui/Frames";
import { cn } from "@/lib/cn";

type Filter = "All Projects" | ProjectCategory;

/** A Work-page entry: a written case study, or a live product (real screenshot, external link). */
export type WorkEntry = { kind: "case"; project: Project } | { kind: "live"; work: Work };

const slugOf = (e: WorkEntry) => (e.kind === "case" ? e.project.slug : e.work.slug);
const categoriesOf = (e: WorkEntry) => (e.kind === "case" ? e.project.categories : e.work.categories);

const visualBox = "overflow-hidden rounded-[28px] border border-line bg-gradient-to-br from-bg-soft to-[#EAF6FF] p-5 transition-shadow duration-300 group-hover:shadow-float sm:p-7";

/** Illustrative phone screen for apps without published screenshots. */
function AppScreen({ name, variant }: { name: string; variant: 0 | 1 }) {
  return (
    <div className="flex h-full flex-col gap-2.5 px-3.5 pt-9 pb-3">
      <p className="text-[13px] font-bold tracking-tight text-ink">{name}</p>
      {variant === 0 ? (
        <>
          <span className="h-[30%] shrink-0 rounded-xl bg-gradient-to-br from-accent-2 to-accent-strong" />
          <span className="h-2 w-[92%] rounded-full bg-line" />
          <span className="h-2 w-[78%] rounded-full bg-line" />
          <span className="h-2 w-[86%] rounded-full bg-line" />
        </>
      ) : (
        <>
          <span className="grid grid-cols-2 gap-2">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={cn("aspect-square rounded-lg", i === 0 ? "bg-gradient-to-br from-accent-2 to-accent-strong" : "bg-bg-blue")} />
            ))}
          </span>
          <span className="h-2 w-[82%] rounded-full bg-line" />
        </>
      )}
      <span className="mt-auto flex justify-around border-t border-line pt-2.5" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={cn("size-1.5 rounded-full", i === 0 ? "bg-accent" : "bg-[#C3D6E6]")} />
        ))}
      </span>
    </div>
  );
}

function LiveVisual({ work, priority }: { work: Work; priority: boolean }) {
  if (work.shot) {
    const host = work.url ? new URL(work.url).hostname : work.slug;
    return (
      <BrowserFrame url={host}>
        <div className="relative h-[220px] bg-bg-soft sm:h-[300px]">
          <Image
            src={work.shot.src}
            alt={work.shot.alt}
            fill
            sizes="(min-width: 1024px) 560px, 92vw"
            priority={priority}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            style={{ objectPosition: work.shot.cover }}
          />
        </div>
      </BrowserFrame>
    );
  }
  return (
    <figure className="flex flex-col items-center">
      <div className="flex h-[252px] items-end justify-center gap-5 sm:h-[340px]" role="img" aria-label={`${work.name} — illustrative mobile app mockup`}>
        <PhoneFrame className="w-[118px] sm:w-[150px]">
          <AppScreen name={work.name} variant={0} />
        </PhoneFrame>
        <PhoneFrame className="mb-6 w-[118px] sm:w-[150px]">
          <AppScreen name={work.name} variant={1} />
        </PhoneFrame>
      </div>
      <figcaption className="mt-3 font-mono text-[11.5px] text-ink-soft">Illustrative mockup — not app screenshots</figcaption>
    </figure>
  );
}

function CardText({ kicker, title, summary, categories, filter }: { kicker: string; title: string; summary: string; categories: ProjectCategory[]; filter: Filter }) {
  return (
    <div>
      <p className="font-mono text-[12px] text-accent-strong">{kicker}</p>
      <h2 className="mt-1 text-2xl font-semibold tracking-tight text-ink">{title}</h2>
      <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-ink-soft">{summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map((c) => (
          <Badge key={c} tone={c === filter ? "accent" : "neutral"}>
            {c}
          </Badge>
        ))}
      </div>
    </div>
  );
}

const roundIcon =
  "inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-line bg-white text-ink transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-white";

/** Card body. `wide` lays the visual and text side by side (the last card of an odd-sized list). */
function EntryCard({ entry, filter, wide, first }: { entry: WorkEntry; filter: Filter; wide: boolean; first: boolean }) {
  const layout = cn(wide && "lg:grid lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-10");
  const text = cn("mt-5 flex items-start justify-between gap-4 px-1", wide && "lg:mt-0");

  if (entry.kind === "case") {
    const p = entry.project;
    return (
      <Link href={`/work/${p.slug}`} className={cn("block rounded-[28px] focus-visible:outline-offset-4", layout)} aria-label={`${p.title} — view case study`}>
        <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 24 }} className={visualBox}>
          <div className="transition-transform duration-700 ease-out group-hover:scale-[1.02]">
            <ProjectVisual kind={p.mockup} size="md" />
          </div>
        </motion.div>
        <div className={text}>
          <CardText kicker={p.kicker} title={p.title} summary={p.summary} categories={p.categories} filter={filter} />
          <span className={roundIcon}>
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </span>
        </div>
      </Link>
    );
  }

  const w = entry.work;
  const visual = (
    <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 24 }} className={visualBox}>
      <LiveVisual work={w} priority={first} />
    </motion.div>
  );
  if (w.url) {
    const host = new URL(w.url).hostname;
    return (
      <a href={w.url} target="_blank" rel="noopener noreferrer" className={cn("block rounded-[28px] focus-visible:outline-offset-4", layout)} aria-label={`${w.name} — ${w.cta.toLowerCase()} (opens ${host} in a new tab)`}>
        {visual}
        <div className={text}>
          <div>
            <CardText kicker={w.type} title={w.name} summary={w.description} categories={w.categories} filter={filter} />
            <p className="mt-3 font-mono text-[12px] text-ink-soft">{host}</p>
          </div>
          <span className={roundIcon}>
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </span>
        </div>
      </a>
    );
  }
  // No public link yet: no dead card link — the action is to start a similar project.
  return (
    <div className={layout}>
      {visual}
      <div className={text}>
        <div>
          <CardText kicker={w.type} title={w.name} summary={w.description} categories={w.categories} filter={filter} />
          <Link
            href={`/contact?type=${encodeURIComponent("Mobile Application")}`}
            className="mt-4 inline-flex items-center gap-2 text-[14px] font-medium text-accent-strong underline-offset-4 hover:underline"
          >
            <MessageSquare className="size-4" aria-hidden="true" />
            Discuss a similar app
          </Link>
        </div>
      </div>
    </div>
  );
}

export function WorkGrid({ entries, categories }: { entries: WorkEntry[]; categories: ProjectCategory[] }) {
  const [filter, setFilter] = useState<Filter>("All Projects");
  const filters: Filter[] = ["All Projects", ...categories];
  const visible = filter === "All Projects" ? entries : entries.filter((e) => categoriesOf(e).includes(filter));
  // Counts are always derived from the data, never hard-coded.
  const count = (f: Filter) => (f === "All Projects" ? entries.length : entries.filter((e) => categoriesOf(e).includes(f)).length);

  return (
    <div className="min-w-0">
      <label className="mb-2 block text-sm font-medium text-ink sm:hidden" htmlFor="work-category">Project category</label>
      <select id="work-category" value={filter} onChange={(event) => setFilter(event.target.value as Filter)} className="block w-full min-w-0 max-w-full rounded-xl border border-line bg-white px-3 py-3 text-sm text-ink sm:hidden">
        {filters.map((f) => <option key={f} value={f}>{f} ({count(f)})</option>)}
      </select>
      <div role="group" aria-label="Filter projects by category" className="hidden min-w-0 flex-wrap gap-2 pb-2 sm:flex">
        {filters.map((f) => {
          const active = f === filter;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={active}
              className={cn(
                "relative shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200",
                active ? "border-transparent text-white" : "border-line bg-white text-ink-soft hover:text-ink",
              )}
            >
              {active && <motion.span layoutId="work-filter" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 400, damping: 34 }} aria-hidden="true" />}
              <span className="relative">
                {f} <span className={cn("ml-1 font-mono text-[11px]", active ? "text-white/70" : "text-ink-soft/70")}>{count(f)}</span>
              </span>
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        {visible.length} {visible.length === 1 ? "project" : "projects"} shown
      </p>

      <motion.div layout className="mt-10 grid gap-x-8 gap-y-12 lg:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {visible.map((e, i) => {
            const wide = visible.length % 2 === 1 && i === visible.length - 1;
            return (
              <motion.article
                key={slugOf(e)}
                id={slugOf(e)}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className={cn("group min-w-0", wide && "lg:col-span-2")}
              >
                <EntryCard entry={e} filter={filter} wide={wide} first={i === 0} />
              </motion.article>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {visible.length === 0 && (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-3xl border border-dashed border-line bg-bg-soft px-6 py-16 text-center">
          <FolderSearch className="size-8 text-ink-soft" aria-hidden="true" />
          <p className="font-semibold text-ink">No published projects in this category yet</p>
          <p className="max-w-sm text-[15px] text-ink-soft">New projects are added as they are approved for publication.</p>
        </div>
      )}
    </div>
  );
}
