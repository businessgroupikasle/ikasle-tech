"use client";

import Link from "next/link";
import type { UseFormRegister } from "react-hook-form";
import { FileText, PencilLine } from "lucide-react";
import type { RoleKind } from "@/data/careers";
import type { ApplicationValues, FileRef } from "@/lib/careers/application-schema";
import { roleFormConfig } from "@/lib/careers/form-config";

type Row = [label: string, value: string | string[] | FileRef[] | undefined | null];

function Value({ value }: { value: Row[1] }) {
  if (value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0)) return <span className="text-ink-soft/60">—</span>;
  if (Array.isArray(value)) {
    if (typeof value[0] === "object") {
      return (
        <ul className="flex flex-col gap-1">
          {(value as FileRef[]).map((f) => (
            <li key={f.id} className="flex items-center gap-1.5">
              <FileText className="size-3.5 shrink-0 text-accent-strong" aria-hidden="true" />
              <span className="truncate">{f.name}</span>
            </li>
          ))}
        </ul>
      );
    }
    return <span>{(value as string[]).join(", ")}</span>;
  }
  return <span className="whitespace-pre-line">{value}</span>;
}

/** Final step: everything entered, grouped by step with Edit links, then the declarations and submit. */
export function ReviewStep({
  values,
  kind,
  positionLabel,
  onEdit,
  register,
  err,
}: {
  values: ApplicationValues;
  kind: RoleKind | "general";
  positionLabel: string;
  onEdit: (step: number) => void;
  register: UseFormRegister<ApplicationValues>;
  err: (path: string) => string | undefined;
}) {
  const isIntern = kind === "intern";
  const sections: { title: string; step: number; rows: Row[] }[] = [
    {
      title: "Personal Information",
      step: 0,
      rows: [
        ["Full name", values.fullName],
        ["Email", values.email],
        ["Mobile", values.mobile],
        ["WhatsApp", values.whatsapp],
        ["Location", values.location],
        ["Date of birth", values.dateOfBirth],
        ["LinkedIn", values.linkedin],
        ["Website", values.website],
      ],
    },
    {
      title: "Professional Information",
      step: 1,
      rows: [
        ["Applying for", isIntern && values.internshipTrack ? `${positionLabel} — ${values.internshipTrack}` : positionLabel],
        ["Total experience", values.totalExperience],
        ["Employment status", values.employmentStatus],
        ...(values.employmentStatus === "Employed"
          ? ([
              ["Current company", values.currentCompany],
              ["Current designation", values.currentDesignation],
            ] as Row[])
          : []),
        ...(!isIntern ? ([["Current CTC", values.currentCtc]] as Row[]) : []),
        [isIntern ? "Expected stipend" : "Expected salary", values.expectedSalary],
        ...(!isIntern
          ? ([
              ["Notice period", values.noticePeriod],
              ["Joining date", values.joiningDate],
            ] as Row[])
          : []),
      ],
    },
    {
      title: "Skills & Experience",
      step: 2,
      rows: [
        ["Primary skills", values.primarySkills],
        [roleFormConfig[kind].skillsLabel, values.roleSkills],
        [roleFormConfig[kind].toolsLabel, values.tools],
        ["Experience in this field", values.relevantExperience],
        ["Summary", values.summary],
        ["Previous projects", values.projects],
        ...roleFormConfig[kind].links.map((l) => [l.label, values.roleLinks[l.key]] as Row),
        ["Portfolio links", values.portfolioLinks],
      ],
    },
    {
      title: "Education Details",
      step: 3,
      rows: [
        ["Highest qualification", values.qualification],
        ["College / University", values.institution],
        ["Graduation year", values.graduationYear],
        ["Certifications", values.certifications],
      ],
    },
    {
      title: "Resume & Documents",
      step: 4,
      rows: [
        ["Resume", values.resume ? [values.resume] : []],
        ["Portfolio", values.portfolioFile ? [values.portfolioFile] : []],
        ["Work samples", values.workSamples],
        ["Supporting documents", values.supportingDocs],
      ],
    },
    {
      title: "Additional Questions",
      step: 5,
      rows: [
        ["Why join us", values.whyJoin],
        ["Why hire you", values.whyHire],
        ["Career goals", values.careerGoals],
        ["Comfortable in a team", values.teamwork],
        ["Willing to work from office", values.officeWork],
        ["Heard about us via", values.heardFrom],
      ],
    },
  ];

  return (
    <div className="mt-6">
      <p className="text-[15px] leading-relaxed text-ink-soft">Please check your details before submitting. Use Edit to change anything.</p>
      <div className="mt-6 flex flex-col gap-4">
        {sections.map((section) => (
          <section key={section.title} aria-label={section.title} className="rounded-2xl border border-line">
            <div className="flex items-center justify-between gap-3 border-b border-line bg-bg-soft/60 px-5 py-3">
              <h3 className="text-[15.5px] font-semibold text-ink">{section.title}</h3>
              <button type="button" onClick={() => onEdit(section.step)} className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-accent-strong hover:underline">
                <PencilLine className="size-3.5" aria-hidden="true" /> Edit<span className="sr-only"> {section.title}</span>
              </button>
            </div>
            <dl className="grid gap-x-6 gap-y-3 px-5 py-4 sm:grid-cols-[200px_1fr]">
              {section.rows.map(([label, value]) => (
                <div key={label} className="contents">
                  <dt className="text-[13.5px] text-ink-soft">{label}</dt>
                  <dd className="min-w-0 text-[14.5px] break-words text-ink">
                    <Value value={value} />
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>

      <fieldset className="mt-8 flex flex-col gap-4 rounded-2xl bg-bg-soft p-5">
        <legend className="sr-only">Declaration</legend>
        <label className="flex cursor-pointer gap-3 text-[14.5px] leading-relaxed text-ink">
          <input type="checkbox" className="mt-1 size-4.5 shrink-0 accent-accent-strong" aria-invalid={Boolean(err("privacyConsent"))} {...register("privacyConsent")} />
          <span>
            I agree that IKASLÉ Technologies may store and process the information and documents in this application for recruitment purposes, as described in the{" "}
            <Link href="/privacy-policy" className="font-semibold text-accent-strong underline-offset-4 hover:underline" target="_blank" rel="noopener">
              Privacy Policy
            </Link>
            .<span className="text-red-500" aria-hidden="true"> *</span>
          </span>
        </label>
        {err("privacyConsent") && <p role="alert" className="-mt-2 ml-7.5 text-[13px] font-medium text-red-600">{err("privacyConsent")}</p>}
        <label className="flex cursor-pointer gap-3 text-[14.5px] leading-relaxed text-ink">
          <input type="checkbox" className="mt-1 size-4.5 shrink-0 accent-accent-strong" aria-invalid={Boolean(err("accuracyConfirmed"))} {...register("accuracyConfirmed")} />
          <span>
            I confirm that the information I have provided is accurate and complete.<span className="text-red-500" aria-hidden="true"> *</span>
          </span>
        </label>
        {err("accuracyConfirmed") && <p role="alert" className="-mt-2 ml-7.5 text-[13px] font-medium text-red-600">{err("accuracyConfirmed")}</p>}
      </fieldset>
    </div>
  );
}
