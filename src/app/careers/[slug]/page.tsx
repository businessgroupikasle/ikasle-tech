import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  Clock,
  GraduationCap,
  Gift,
  Layers,
  MapPin,
  Sparkles,
  Target,
  type LucideIcon,
} from "lucide-react";
import { HiringTimeline } from "@/components/careers/HiringTimeline";
import { JobCard } from "@/components/careers/JobCard";
import { jobIcons } from "@/components/careers/job-icons";
import { ContactCta } from "@/components/home/ContactCta";
import { ButtonLink } from "@/components/ui/Button";
import { getJob, jobLocation, jobs, sharedOffer } from "@/data/careers";
import { pageMetadata } from "@/lib/metadata";
import { absoluteUrl } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

// Only the listed openings exist; any other slug is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return jobs.map((job) => ({ slug: job.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const job = getJob((await params).slug);
  if (!job) return {};
  return pageMetadata({ title: `${job.title} — Careers`, description: job.summary, path: `/careers/${job.slug}` });
}

function Section({ id, title, icon: Icon, children }: { id: string; title: string; icon: LucideIcon; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="scroll-mt-[calc(var(--header-h)+16px)] border-t border-line py-10 first:border-t-0 first:pt-0">
      <h2 id={id} className="flex items-center gap-3 text-[1.45rem] font-semibold tracking-[-0.02em] text-ink sm:text-[1.6rem]">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-bg-blue text-accent-strong" aria-hidden="true">
          <Icon className="size-5" strokeWidth={1.9} />
        </span>
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function CheckList({ items, columns = false }: { items: string[]; columns?: boolean }) {
  return (
    <ul className={columns ? "grid gap-3 sm:grid-cols-2" : "flex flex-col gap-3"}>
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-[15.5px] leading-relaxed text-ink-soft">
          <CheckCircle2 className="mt-1 size-4.5 shrink-0 text-success" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default async function JobPage({ params }: Params) {
  const job = getJob((await params).slug);
  if (!job) notFound();

  const Icon = jobIcons[job.icon];
  const applyHref = `/careers/apply?position=${job.slug}`;
  const facts = [
    { icon: Layers, label: "Department", value: job.department },
    { icon: Clock, label: "Experience", value: job.experience },
    { icon: BriefcaseBusiness, label: "Job type", value: job.employmentType },
    { icon: MapPin, label: "Location", value: jobLocation },
  ];
  // Same category first, then the rest; never the current job.
  const related = [...jobs.filter((j) => j.slug !== job.slug && j.category === job.category), ...jobs.filter((j) => j.slug !== job.slug && j.category !== job.category)].slice(0, 3);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Careers", item: absoluteUrl("/careers") },
      { "@type": "ListItem", position: 3, name: job.title, item: absoluteUrl(`/careers/${job.slug}`) },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }} />

      {/* ---------- Header ---------- */}
      <section aria-labelledby="job-title" className="relative overflow-hidden pt-[calc(var(--header-h)+32px)] pb-14 sm:pb-16">
        <div className="ambient" aria-hidden="true" />
        <div className="bg-grid pointer-events-none absolute inset-0 mask-[radial-gradient(ellipse_at_60%_20%,#000_15%,transparent_70%)]" aria-hidden="true" />
        <div className="container-x relative">
          <Link href="/careers#openings" className="enter-up inline-flex items-center gap-1.5 text-[14px] font-medium text-ink-soft transition-colors hover:text-accent-strong">
            <ArrowLeft className="size-4" aria-hidden="true" /> All openings
          </Link>
          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start">
            <span className="enter-up grid size-16 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-accent to-accent-strong text-white shadow-[0_18px_36px_-16px_rgb(0_110_200/0.8)] [animation-delay:60ms]" aria-hidden="true">
              <Icon className="size-8" strokeWidth={1.7} />
            </span>
            <div className="min-w-0">
              <h1 id="job-title" className="enter-up text-[2.3rem] leading-[1.06] font-semibold tracking-[-0.04em] text-balance text-ink [animation-delay:120ms] sm:text-5xl">
                {job.title}
              </h1>
              <p className="enter-up mt-4 max-w-2xl text-[17px] leading-relaxed text-ink-soft [animation-delay:180ms] sm:text-lg">{job.intro}</p>
            </div>
          </div>
          <dl className="enter-up mt-8 grid gap-3 [animation-delay:240ms] sm:grid-cols-2 lg:grid-cols-4">
            {facts.map((fact) => (
              <div key={fact.label} className="flex items-center gap-3 rounded-2xl border border-line bg-white/80 px-4 py-3.5 backdrop-blur">
                <fact.icon className="size-5 shrink-0 text-accent-strong" aria-hidden="true" />
                <div className="min-w-0">
                  <dt className="text-[12px] text-ink-soft">{fact.label}</dt>
                  <dd className="text-[14.5px] font-semibold text-ink">{fact.value}</dd>
                </div>
              </div>
            ))}
          </dl>
          <div className="enter-up mt-8 flex flex-col gap-3 [animation-delay:300ms] xs:flex-row">
            <ButtonLink href={applyHref} size="lg" arrow>
              Apply Now
            </ButtonLink>
            <ButtonLink href="#process" size="lg" variant="secondary">
              See the hiring process
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ---------- Body + sticky summary ---------- */}
      <div className="container-x grid gap-12 pb-20 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
        <article className="min-w-0">
          <Section id="about-role" title="About the Role" icon={Sparkles}>
            <div className="flex flex-col gap-4 text-[16.5px] leading-relaxed text-ink-soft">
              {job.about.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            {job.tracks && (
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {job.tracks.map((track) => (
                  <li key={track.title} className="rounded-2xl border border-line bg-bg-soft p-5">
                    <p className="text-[16px] font-semibold text-ink">{track.title}</p>
                    <p className="mt-1 text-[14.5px] leading-relaxed text-ink-soft">{track.text}</p>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section id="responsibilities" title="Key Responsibilities" icon={Target}>
            <CheckList items={job.responsibilities} columns />
          </Section>

          <Section id="skills" title="Required Skills" icon={BadgeCheck}>
            <ul className="flex flex-wrap gap-2.5">
              {job.skills.map((skill) => (
                <li key={skill} className="rounded-full border border-accent/20 bg-bg-blue px-4 py-2 text-[14.5px] font-medium text-ink">
                  {skill}
                </li>
              ))}
            </ul>
          </Section>

          <Section id="preferred" title="Preferred Qualifications" icon={Sparkles}>
            <CheckList items={job.preferred} />
          </Section>

          <Section id="education" title="Education Requirements" icon={GraduationCap}>
            <CheckList items={job.education} />
          </Section>

          <Section id="expectations" title="What We Expect From You" icon={Target}>
            <ol className="grid gap-3 sm:grid-cols-2">
              {job.expectations.map((item, i) => (
                <li key={item} className="flex gap-4 rounded-2xl border border-line bg-white p-5">
                  <span className="font-mono text-[13px] font-semibold text-accent-strong">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[15px] leading-relaxed text-ink-soft">{item}</span>
                </li>
              ))}
            </ol>
          </Section>

          <Section id="offer" title="What We Offer" icon={Gift}>
            <ul className="grid gap-3 sm:grid-cols-2">
              {[...sharedOffer, ...job.offerExtras].map((item) => (
                <li key={item} className="flex gap-3 rounded-2xl bg-bg-soft p-5 text-[15px] leading-relaxed text-ink">
                  <Gift className="mt-0.5 size-4.5 shrink-0 text-accent-strong" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </Section>
        </article>

        {/* Sticky summary with the Apply button (desktop); on phones it sits after the content. */}
        <aside className="lg:sticky lg:top-[calc(var(--header-h)+24px)] lg:self-start">
          <div className="rounded-3xl border border-line bg-white p-6 shadow-[0_20px_44px_-30px_rgb(8_40_60/0.4)]">
            <p className="font-mono text-[12px] tracking-wide text-accent-strong uppercase">{job.employmentType === "Internship" ? "Internship" : "Open position"}</p>
            <p className="mt-2 text-[20px] font-semibold text-ink">{job.title}</p>
            <ul className="mt-4 flex flex-col gap-2.5 border-t border-line pt-4">
              {facts.map((fact) => (
                <li key={fact.label} className="flex items-start gap-2.5 text-[14px] text-ink-soft">
                  <fact.icon className="mt-0.5 size-4 shrink-0 text-accent-strong" aria-hidden="true" />
                  <span>
                    <span className="sr-only">{fact.label}: </span>
                    {fact.value}
                  </span>
                </li>
              ))}
            </ul>
            <ButtonLink href={applyHref} arrow className="mt-6 w-full">
              Apply Now
            </ButtonLink>
            <p className="mt-3 text-center text-[12.5px] text-ink-soft">Takes about 10 minutes · Your progress is saved</p>
          </div>
        </aside>
      </div>

      {/* ---------- Hiring process ---------- */}
      <section id="process" aria-labelledby="process-title" className="scroll-mt-[calc(var(--header-h)+16px)] bg-bg-soft py-16 sm:py-20">
        <div className="container-x">
          <h2 id="process-title" className="text-center text-[1.9rem] font-semibold tracking-[-0.03em] text-ink sm:text-[2.2rem]">
            Hiring Process
          </h2>
          <HiringTimeline assessmentNote={job.assessment} className="mt-12" />
        </div>
      </section>

      {/* ---------- Related roles ---------- */}
      <section aria-labelledby="related-title" className="py-16 sm:py-20">
        <div className="container-x">
          <div className="flex items-end justify-between gap-4">
            <h2 id="related-title" className="text-[1.75rem] font-semibold tracking-[-0.03em] text-ink sm:text-[2rem]">
              Related Job Opportunities
            </h2>
            <Link href="/careers#openings" className="hidden items-center gap-1.5 text-[14.5px] font-medium text-accent-strong hover:underline sm:inline-flex">
              All openings <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <ul className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {related.map((r) => (
              <li key={r.slug}>
                <JobCard job={r} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ContactCta
        eyebrow="// ready to apply?"
        title={`Apply for ${job.title} Today.`}
        highlight={["Today."]}
        text="Send us your application — it takes about 10 minutes and you can come back to it any time."
        primary={{ label: "Apply Now", href: applyHref }}
        secondary={{ label: "All Openings", href: "/careers#openings" }}
      />
    </>
  );
}
