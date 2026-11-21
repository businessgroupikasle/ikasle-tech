import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Clock, Layers } from "lucide-react";
import type { Job } from "@/data/careers";
import { cn } from "@/lib/cn";
import { jobIcons } from "./job-icons";

/** An opening: icon, title, department / experience / type, short description, View Details and Apply Now. */
export function JobCard({ job, className }: { job: Job; className?: string }) {
  const Icon = jobIcons[job.icon];
  const meta = [
    { icon: Layers, label: "Department", value: job.department },
    { icon: Clock, label: "Experience", value: job.experience },
    { icon: BriefcaseBusiness, label: "Type", value: job.employmentType },
  ];
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white p-6 shadow-[0_8px_24px_-20px_rgb(8_40_60/0.35)] transition-[translate,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-accent/35 hover:shadow-[0_28px_48px_-30px_rgb(0_110_200/0.5)] motion-reduce:hover:translate-y-0 sm:p-7",
        className,
      )}
    >
      <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-linear-to-r from-accent to-accent-2 transition-transform duration-500 group-hover:scale-x-100" aria-hidden="true" />
      <div className="flex items-start justify-between gap-4">
        <span className="grid size-13 shrink-0 place-items-center rounded-2xl bg-bg-blue text-accent-strong transition-colors duration-300 group-hover:bg-accent-strong group-hover:text-white" aria-hidden="true">
          <Icon className="size-6" strokeWidth={1.8} />
        </span>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-[12px] font-semibold",
            job.employmentType === "Internship" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700",
          )}
        >
          {job.employmentType}
        </span>
      </div>

      <h3 className="mt-5 text-[20px] leading-snug font-semibold tracking-[-0.015em] text-ink">
        <Link href={`/careers/${job.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
          {job.title}
        </Link>
      </h3>
      <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {meta.map((m) => (
          <div key={m.label} className="flex items-center gap-1.5 text-[13.5px] text-ink-soft">
            <dt className="sr-only">{m.label}</dt>
            <m.icon className="size-3.5 text-accent-strong" aria-hidden="true" />
            <dd>{m.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 flex-1 text-[15px] leading-relaxed text-ink-soft">{job.summary}</p>

      {/* Buttons sit above the card-wide link so both stay clickable. */}
      <div className="relative z-10 mt-6 flex flex-wrap gap-3">
        <Link
          href={`/careers/${job.slug}`}
          className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line bg-white px-4 text-[14px] font-medium text-ink transition-colors hover:border-accent/50 hover:text-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          View Details
        </Link>
        <Link
          href={`/careers/apply?position=${job.slug}`}
          className="group/apply inline-flex h-10 items-center gap-1.5 rounded-full bg-accent-strong px-4 text-[14px] font-medium text-white shadow-[0_8px_20px_-10px_rgb(0_110_200/0.8)] transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Apply Now
          <ArrowRight className="size-4 transition-transform group-hover/apply:translate-x-0.5" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
