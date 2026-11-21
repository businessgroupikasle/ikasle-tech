"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Search, X } from "lucide-react";
import { jobCategories, jobs, type JobCategory } from "@/data/careers";
import { cn } from "@/lib/cn";
import { JobCard } from "./JobCard";

type Filter = "All" | JobCategory;
const filters: Filter[] = ["All", ...jobCategories];
const labels: Record<Filter, string> = { All: "All roles", Development: "Development", Creative: "Design & Video", Marketing: "Marketing", Internship: "Internships" };

/**
 * "Current Openings": category filter buttons plus a search box (title, department, description) over the job cards.
 * Cards animate in and out as the results change; the result count is announced to screen readers.
 */
export function JobBoard() {
  const [filter, setFilter] = useState<Filter>("All");
  const [search, setSearch] = useState("");

  const results = useMemo(() => {
    const q = search.trim().toLowerCase();
    return jobs.filter(
      (job) =>
        (filter === "All" || job.category === filter) &&
        (!q || [job.title, job.department, job.summary, job.employmentType, ...(job.tracks?.map((t) => t.title) ?? [])].some((v) => v.toLowerCase().includes(q))),
    );
  }, [filter, search]);

  return (
    <section id="openings" aria-labelledby="openings-title" className="scroll-mt-[calc(var(--header-h)+16px)] py-20 sm:py-24">
      <div className="container-x">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-[12px] tracking-wide text-accent-strong uppercase">Join the team</p>
            <h2 id="openings-title" className="mt-3 text-[2rem] leading-[1.1] font-semibold tracking-[-0.035em] text-ink sm:text-[2.6rem]">
              Current Openings
            </h2>
            <p className="mt-3 text-[17px] leading-relaxed text-ink-soft">Find the role that fits your skills — or start your career with an internship.</p>
          </div>
          <label className="relative block w-full lg:w-80">
            <span className="sr-only">Search roles</span>
            <Search className="pointer-events-none absolute top-1/2 left-4 size-4.5 -translate-y-1/2 text-ink-soft" aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search roles, skills or departments"
              className="h-12 w-full rounded-full border border-line bg-white pr-11 pl-11 text-[15px] text-ink shadow-sm transition-colors outline-none placeholder:text-ink-soft/70 focus:border-accent focus:ring-3 focus:ring-accent/15"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute top-1/2 right-3 grid size-7 -translate-y-1/2 place-items-center rounded-full text-ink-soft hover:bg-bg-soft hover:text-ink"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            )}
          </label>
        </div>

        <div role="group" aria-label="Filter roles by category" className="mt-8 flex flex-wrap gap-2">
          {filters.map((f) => {
            const active = f === filter;
            const count = f === "All" ? jobs.length : jobs.filter((j) => j.category === f).length;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(f)}
                className={cn(
                  "relative inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[14px] font-medium transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                  active ? "border-transparent text-white" : "border-line bg-white text-ink-soft hover:border-accent/40 hover:text-ink",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="careers-filter"
                    className="absolute inset-0 rounded-full bg-accent-strong shadow-[0_8px_20px_-10px_rgb(0_110_200/0.8)]"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    aria-hidden="true"
                  />
                )}
                <span className="relative">{labels[f]}</span>
                <span className={cn("relative rounded-full px-1.5 font-mono text-[11px] leading-5", active ? "bg-white/20" : "bg-bg-soft")}>{count}</span>
              </button>
            );
          })}
        </div>

        <p className="sr-only" aria-live="polite">
          {results.length === 1 ? "1 role found" : `${results.length} roles found`}
        </p>

        <motion.ul layout className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {results.map((job) => (
              <motion.li
                key={job.slug}
                layout
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <JobCard job={job} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        {results.length === 0 && (
          <div className="mt-10 rounded-3xl border border-dashed border-line bg-bg-soft px-6 py-12 text-center">
            <p className="text-[17px] font-semibold text-ink">No roles match your search.</p>
            <p className="mt-2 text-ink-soft">Try a different keyword, or send us your resume for future openings.</p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setFilter("All");
              }}
              className="mt-5 inline-flex h-10 items-center rounded-full border border-line bg-white px-4 text-[14px] font-medium text-ink hover:border-accent/50 hover:text-accent-strong"
            >
              Show all roles
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
