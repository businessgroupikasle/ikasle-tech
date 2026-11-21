import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Download, FileText, Mail, MessageCircle, Phone } from "lucide-react";
import { AdminStatusForm } from "@/components/careers/admin/AdminStatusForm";
import { StatusBadge } from "@/components/careers/admin/StatusBadge";
import { roleKindFor, statusLabels } from "@/lib/careers/application-schema";
import { fileKinds } from "@/lib/careers/file-rules";
import { roleFormConfig } from "@/lib/careers/form-config";
import { isAdmin } from "@/lib/careers/server/admin-auth";
import { UUID_PATTERN } from "@/lib/careers/server/http";
import { getApplication } from "@/lib/careers/server/repository";

type Props = { params: Promise<{ id: string }> };

const fmtDate = (d: Date) => d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });
const fmtSize = (b: number) => (b < 1024 * 1024 ? `${Math.max(1, Math.round(b / 1024))} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`);

function Block({ title, rows }: { title: string; rows: [string, string | string[] | undefined | null][] }) {
  return (
    <section aria-label={title} className="rounded-2xl border border-line bg-white">
      <h2 className="border-b border-line px-5 py-3.5 text-[15.5px] font-semibold text-ink">{title}</h2>
      <dl className="grid gap-x-6 gap-y-3 px-5 py-4 sm:grid-cols-[210px_1fr]">
        {rows.map(([label, value]) => {
          const text = Array.isArray(value) ? value.join(", ") : value;
          const isLink = typeof text === "string" && /^https?:\/\//.test(text) && !/\s/.test(text);
          return (
            <div key={label} className="contents">
              <dt className="text-[13.5px] text-ink-soft">{label}</dt>
              <dd className="min-w-0 text-[14.5px] break-words whitespace-pre-line text-ink">
                {!text ? (
                  <span className="text-ink-soft/60">—</span>
                ) : isLink ? (
                  <a href={text} target="_blank" rel="noopener noreferrer nofollow" className="text-accent-strong underline-offset-4 hover:underline">
                    {text}
                  </a>
                ) : (
                  text
                )}
              </dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}

/** One application in full: answers by section, downloadable documents, status/notes and the status history. */
export default async function AdminApplicationPage({ params }: Props) {
  const { id } = await params;
  if (!(await isAdmin())) redirect(`/admin/login?next=/admin/careers/${encodeURIComponent(id)}`);
  if (!UUID_PATTERN.test(id)) notFound();
  const app = await getApplication(id);
  if (!app) notFound();

  const d = app.data;
  const kind = roleKindFor(app.job_slug);
  const config = roleFormConfig[kind];
  const isIntern = kind === "intern";
  const whatsapp = (d.whatsapp || d.mobile).replace(/\D/g, "");

  return (
    <div className="container-x">
      <Link href="/admin/careers" className="inline-flex items-center gap-1.5 text-[14px] font-medium text-ink-soft hover:text-accent-strong">
        <ArrowLeft className="size-4" aria-hidden="true" /> All applications
      </Link>

      <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-[1.9rem] font-semibold tracking-[-0.03em] text-ink">{app.full_name}</h1>
            <StatusBadge status={app.status} />
          </div>
          <p className="mt-1 text-[15px] text-ink-soft">
            {d.internshipTrack ? `${app.job_title} — ${d.internshipTrack}` : app.job_title} · <span className="font-mono text-[13.5px]">{app.reference}</span> · {fmtDate(app.created_at)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={`mailto:${app.email}?subject=${encodeURIComponent(`Your application for ${app.job_title} (${app.reference})`)}`} className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-white px-4 text-[14px] font-medium text-ink hover:border-accent/50 hover:text-accent-strong">
            <Mail className="size-4" aria-hidden="true" /> Email
          </a>
          <a href={`tel:${d.mobile.replace(/[^\d+]/g, "")}`} className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-white px-4 text-[14px] font-medium text-ink hover:border-accent/50 hover:text-accent-strong">
            <Phone className="size-4" aria-hidden="true" /> Call
          </a>
          {whatsapp.length >= 10 && (
            <a href={`https://wa.me/${whatsapp.length === 10 ? `91${whatsapp}` : whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-white px-4 text-[14px] font-medium text-ink hover:border-accent/50 hover:text-accent-strong">
              <MessageCircle className="size-4" aria-hidden="true" /> WhatsApp
            </a>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex min-w-0 flex-col gap-5">
          <Block
            title="Personal Information"
            rows={[
              ["Email", d.email],
              ["Mobile", d.mobile],
              ["WhatsApp", d.whatsapp],
              ["Location", d.location],
              ["Date of birth", d.dateOfBirth],
              ["LinkedIn", d.linkedin],
              ["Website", d.website],
            ]}
          />
          <Block
            title="Professional Information"
            rows={[
              ["Applying for", app.job_title],
              ...(isIntern ? ([["Internship track", d.internshipTrack]] as [string, string][]) : []),
              ["Total experience", d.totalExperience],
              ["Employment status", d.employmentStatus],
              ["Current company", d.currentCompany],
              ["Current designation", d.currentDesignation],
              ["Current CTC", d.currentCtc],
              [isIntern ? "Expected stipend" : "Expected salary", d.expectedSalary],
              ["Notice period", d.noticePeriod],
              ["Joining date", d.joiningDate],
            ]}
          />
          <Block
            title="Skills & Experience"
            rows={[
              ["Primary skills", d.primarySkills],
              [config.skillsLabel, d.roleSkills],
              [config.toolsLabel, d.tools],
              ["Experience in this field", d.relevantExperience],
              ["Summary", d.summary],
              ["Previous projects", d.projects],
              ...Object.entries(d.roleLinks ?? {}).map(([key, value]) => [config.links.find((l) => l.key === key)?.label ?? key, value] as [string, string]),
              ["Portfolio links", d.portfolioLinks],
            ]}
          />
          <Block
            title="Education Details"
            rows={[
              ["Highest qualification", d.qualification],
              ["College / University", d.institution],
              ["Graduation year", d.graduationYear],
              ["Certifications", d.certifications],
            ]}
          />
          <Block
            title="Additional Questions"
            rows={[
              ["Why join us", d.whyJoin],
              ["Why hire them", d.whyHire],
              ["Career goals", d.careerGoals],
              ["Comfortable in a team", d.teamwork],
              ["Willing to work from office", d.officeWork],
              ["Heard about us via", d.heardFrom],
            ]}
          />
        </div>

        <aside className="flex flex-col gap-5">
          <section aria-label="Review" className="rounded-2xl border border-line bg-white p-5">
            <h2 className="mb-4 text-[15.5px] font-semibold text-ink">Review</h2>
            <AdminStatusForm id={app.id} status={app.status} notes={app.admin_notes} />
          </section>

          <section aria-label="Documents" className="rounded-2xl border border-line bg-white p-5">
            <h2 className="text-[15.5px] font-semibold text-ink">Documents</h2>
            {app.files.length === 0 ? (
              <p className="mt-3 text-[14px] text-ink-soft">No documents.</p>
            ) : (
              <ul className="mt-3 flex flex-col gap-2">
                {app.files.map((f) => (
                  <li key={f.id}>
                    <a
                      href={`/api/admin/careers/files/${f.id}`}
                      className="group flex items-center gap-3 rounded-xl border border-line px-3.5 py-3 transition-colors hover:border-accent/50"
                    >
                      <FileText className="size-5 shrink-0 text-accent-strong" aria-hidden="true" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14px] font-medium text-ink">{f.file_name}</span>
                        <span className="block text-[12px] text-ink-soft">
                          {fileKinds[f.kind].label} · {fmtSize(f.size_bytes)}
                        </span>
                      </span>
                      <Download className="size-4 shrink-0 text-ink-soft group-hover:text-accent-strong" aria-label="Download" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section aria-label="Status history" className="rounded-2xl border border-line bg-white p-5">
            <h2 className="text-[15.5px] font-semibold text-ink">History</h2>
            <ol className="mt-3 flex flex-col gap-3 border-l-2 border-line pl-4">
              {app.history.map((h, i) => (
                <li key={i} className="relative">
                  <span className="absolute top-1.5 -left-[21px] size-2.5 rounded-full bg-accent-strong" aria-hidden="true" />
                  <p className="text-[14px] font-medium text-ink">{statusLabels[h.status]}</p>
                  <p className="text-[12.5px] text-ink-soft">{fmtDate(h.changed_at)}</p>
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </div>
    </div>
  );
}
