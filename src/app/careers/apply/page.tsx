import Link from "next/link";
import { ArrowLeft, Clock, FileText, Lock, Save } from "lucide-react";
import { ApplicationFormClient } from "@/components/careers/apply/ApplicationFormClient";
import { jobIcons } from "@/components/careers/job-icons";
import { getJob, jobLocation } from "@/data/careers";
import { companyContact } from "@/data/company-contact";
import { GENERAL_POSITION } from "@/lib/careers/application-schema";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Apply — Careers",
  description: "Apply for a role or internship at IKASLÉ Technologies.",
  path: "/careers/apply",
  noindex: true,
});

type Props = { searchParams: Promise<{ position?: string | string[] }> };

/** /careers/apply?position=<job-slug> — the application form, pre-filled with the chosen role (or a general application). */
export default async function ApplyPage({ searchParams }: Props) {
  const raw = (await searchParams).position;
  const slug = Array.isArray(raw) ? raw[0] : raw;
  const job = slug ? getJob(slug) : undefined;
  const Icon = job ? jobIcons[job.icon] : FileText;

  return (
    <section aria-labelledby="apply-title" className="relative overflow-hidden pt-[calc(var(--header-h)+32px)] pb-20 sm:pb-24">
      <div className="ambient" aria-hidden="true" />
      <div className="container-x relative">
        <Link href={job ? `/careers/${job.slug}` : "/careers"} className="inline-flex items-center gap-1.5 text-[14px] font-medium text-ink-soft transition-colors hover:text-accent-strong">
          <ArrowLeft className="size-4" aria-hidden="true" /> {job ? `Back to ${job.title}` : "Back to careers"}
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12">
          <div className="min-w-0">
            <h1 id="apply-title" className="text-[2.1rem] leading-[1.08] font-semibold tracking-[-0.035em] text-balance text-ink sm:text-[2.6rem]">
              {job ? `Apply for ${job.title}` : "Submit Your Resume"}
            </h1>
            <p className="mt-3 max-w-2xl text-[16.5px] leading-relaxed text-ink-soft">
              {job ? "Tell us about yourself — it takes about 10 minutes." : "Not sure which role fits? Send a general application and we'll consider you for suitable openings."}
            </p>
            <div className="mt-8">
              <ApplicationFormClient initialPosition={job?.slug ?? GENERAL_POSITION} positionFromLink={Boolean(job)} contactEmail={companyContact.email} />
            </div>
          </div>

          <aside className="flex flex-col gap-4 lg:sticky lg:top-[calc(var(--header-h)+24px)] lg:self-start">
            <div className="rounded-3xl border border-line bg-white p-6">
              <span className="grid size-12 place-items-center rounded-2xl bg-bg-blue text-accent-strong" aria-hidden="true">
                <Icon className="size-6" strokeWidth={1.8} />
              </span>
              <p className="mt-4 text-[18px] font-semibold text-ink">{job?.title ?? "General Application"}</p>
              {job ? (
                <p className="mt-1 text-[14px] text-ink-soft">
                  {job.department} · {job.experience} · {job.employmentType}
                </p>
              ) : (
                <p className="mt-1 text-[14px] text-ink-soft">Any suitable role</p>
              )}
              <p className="mt-1 text-[14px] text-ink-soft">{jobLocation}</p>
            </div>
            <ul className="flex flex-col gap-3 rounded-3xl bg-bg-soft p-6 text-[14px] text-ink-soft">
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-4.5 shrink-0 text-accent-strong" aria-hidden="true" /> About 10 minutes, in 7 short steps.
              </li>
              <li className="flex gap-3">
                <Save className="mt-0.5 size-4.5 shrink-0 text-accent-strong" aria-hidden="true" /> Your progress is saved on this device, so you can come back later.
              </li>
              <li className="flex gap-3">
                <Lock className="mt-0.5 size-4.5 shrink-0 text-accent-strong" aria-hidden="true" /> Your documents are stored securely and only seen by our hiring team.
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
