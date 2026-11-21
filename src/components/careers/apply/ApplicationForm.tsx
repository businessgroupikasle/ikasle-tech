"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch, type FieldErrors, type FieldPath, type Resolver } from "react-hook-form";
import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, ArrowLeft, ArrowRight, Check, Loader2, RotateCcw, Save, Send } from "lucide-react";
import {
  applicationObject,
  conditionalIssues,
  EMPLOYMENT_OPTIONS,
  emptyApplication,
  EXPERIENCE_OPTIONS,
  HEARD_FROM_OPTIONS,
  NOTICE_OPTIONS,
  positionOptions,
  positionTitle,
  QUALIFICATION_OPTIONS,
  roleKindFor,
  stepFields,
  stepTitles,
  YES_NO,
  type ApplicationValues,
  type FileRef,
  type SubmitResponse,
} from "@/lib/careers/application-schema";
import { internshipTracks, roleFormConfig } from "@/lib/careers/form-config";
import { cn } from "@/lib/cn";
import { ChipsField, RadioField, SelectField, TextAreaField, TextField } from "./fields";
import { FileField } from "./FileField";
import { ReviewStep } from "./ReviewStep";

const DRAFT_KEY = "ikt-careers-application-v1";
const LAST = stepTitles.length - 1;

type Draft = { values: ApplicationValues; step: number; furthest: number; savedAt: number };

/** Puts an error at a dotted path ("roleLinks.showreel") in RHF's nested error object. */
function setError(errors: Record<string, unknown>, path: string, message: string) {
  const keys = path.split(".");
  let node = errors;
  keys.forEach((key, i) => {
    if (i === keys.length - 1) {
      if (!node[key]) node[key] = { type: "validation", message };
    } else {
      node[key] = (node[key] as Record<string, unknown>) ?? {};
      node = node[key] as Record<string, unknown>;
    }
  });
}

/** Validates the whole application (field rules + role rules); RHF shows only the fields being checked. */
const resolver: Resolver<ApplicationValues> = async (values) => {
  const parsed = applicationObject.safeParse(values);
  const issues = [...(parsed.success ? [] : parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message }))), ...conditionalIssues(values)];
  if (issues.length === 0) return { values, errors: {} };
  const errors: Record<string, unknown> = {};
  for (const issue of issues) setError(errors, issue.path, issue.message);
  return { values: {}, errors: errors as FieldErrors<ApplicationValues> };
};

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) => (Number(c) ^ (Math.random() * 16) >> (Number(c) / 4)).toString(16));

/**
 * The multi-step job application.
 *
 * - Seven steps with a progress indicator; Next validates the current step, completed steps can be revisited.
 * - Questions adapt to the role (role config in lib/careers/form-config.ts): developers get technical skills and
 *   GitHub, video editors editing tools and a showreel, interns a track picker instead of salary/notice fields…
 * - Progress (including uploaded files) is saved in this browser and restored on return.
 * - Files upload as they're picked (/api/careers/uploads); the final step reviews everything before submitting.
 */
/** Starting state: the draft saved in this browser if there is one, otherwise a fresh application. Browser-only. */
function loadInitial(initialPosition: string, positionFromLink: boolean) {
  let draft: Draft | null = null;
  try {
    draft = JSON.parse(localStorage.getItem(DRAFT_KEY) ?? "null") as Draft | null;
  } catch {
    draft = null;
  }
  if (draft?.values?.draftId) {
    // Keep everything they entered; a link to a specific job sets the position.
    const position = positionFromLink ? initialPosition : draft.values.position;
    return {
      values: { ...emptyApplication(position), ...draft.values, position, privacyConsent: false, accuracyConfirmed: false },
      step: Math.min(draft.step ?? 0, LAST),
      furthest: Math.min(draft.furthest ?? 0, LAST),
      savedAt: draft.savedAt ?? null,
      restored: true,
    };
  }
  return { values: { ...emptyApplication(initialPosition), draftId: newId(), startedAt: Date.now() }, step: 0, furthest: 0, savedAt: null, restored: false };
}

export function ApplicationForm({ initialPosition, positionFromLink, contactEmail }: { initialPosition: string; positionFromLink: boolean; contactEmail: string }) {
  const router = useRouter();
  const top = useRef<HTMLDivElement>(null);
  // This component renders in the browser only (see ApplicationFormClient), so the draft can be read up front.
  const [initial] = useState(() => loadInitial(initialPosition, positionFromLink));
  const [step, setStep] = useState(initial.step);
  const [furthest, setFurthest] = useState(initial.furthest);
  const [restored, setRestored] = useState(initial.restored);
  const [savedAt, setSavedAt] = useState<number | null>(initial.savedAt);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<{ tone: "error" | "info"; text: string } | null>(null);

  const form = useForm<ApplicationValues>({ resolver, mode: "onTouched", defaultValues: initial.values, shouldFocusError: true });
  const { register, setValue, getValues, trigger, reset, handleSubmit, setError: setFieldError, formState } = form;
  /** Live form values for rendering (one subscription; re-renders as the candidate types). */
  const v = useWatch({ control: form.control }) as ApplicationValues;
  const errors = formState.errors;

  const save = useCallback(
    (nextStep = step, nextFurthest = furthest) => {
      try {
        const values = getValues();
        const now = Date.now();
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ values: { ...values, privacyConsent: false, accuracyConfirmed: false }, step: nextStep, furthest: nextFurthest, savedAt: now } satisfies Draft));
        setSavedAt(now);
      } catch {
        /* storage unavailable (private mode): the form still works, just without saving */
      }
    },
    [getValues, step, furthest],
  );

  // Save the draft shortly after the candidate stops typing.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const unsubscribe = form.subscribe({
      formState: { values: true },
      callback: () => {
        clearTimeout(timer);
        timer = setTimeout(() => save(), 600);
      },
    });
    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, [form, save]);

  // ---------- Role-dependent questions ----------
  const position = v.position;
  const kind = roleKindFor(position);
  const config = roleFormConfig[kind];
  const isIntern = kind === "intern";
  const employed = v.employmentStatus === "Employed";

  const fieldsFor = (s: number): FieldPath<ApplicationValues>[] =>
    stepFields[s]!.flatMap((f) => (f === "roleLinks" ? config.links.map((l) => `roleLinks.${l.key}` as FieldPath<ApplicationValues>) : [f as FieldPath<ApplicationValues>]));

  const goTo = (s: number) => {
    const next = Math.max(0, Math.min(LAST, s));
    const nextFurthest = Math.max(furthest, next);
    setStep(next);
    setFurthest(nextFurthest);
    save(next, nextFurthest);
    setNotice(null);
    requestAnimationFrame(() => top.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const next = async () => {
    if (await trigger(fieldsFor(step), { shouldFocus: true })) goTo(step + 1);
  };

  const firstStepWithError = (fieldErrors: Record<string, unknown>) => stepFields.findIndex((fields) => fields.some((f) => f in fieldErrors));

  const onValid = async (values: ApplicationValues) => {
      setSubmitting(true);
      setNotice(null);
      try {
        const res = await fetch("/api/careers/applications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
        const data = (await res.json()) as SubmitResponse;
        if (data.ok) {
          try {
            localStorage.removeItem(DRAFT_KEY);
          } catch {
            /* ignore */
          }
          const params = new URLSearchParams({ ref: data.reference, position: data.position, date: data.submittedAt });
          router.push(`/careers/application-success?${params.toString()}`);
          return;
        }
        if (data.code === "validation" && data.fieldErrors) {
          for (const [path, message] of Object.entries(data.fieldErrors)) setFieldError(path as FieldPath<ApplicationValues>, { type: "server", message });
          const s = firstStepWithError(Object.fromEntries(Object.keys(data.fieldErrors).map((k) => [k.split(".")[0], true])));
          if (s >= 0 && s !== step) goTo(s);
        }
        setNotice({
          tone: "error",
          text: data.code === "not_configured" ? `${data.message} You can email it to ${contactEmail}.` : data.message,
        });
      } catch {
        setNotice({ tone: "error", text: "We couldn't reach the server. Please check your connection and try again — your progress is saved." });
      } finally {
        setSubmitting(false);
      }
  };

  const onInvalid = (fieldErrors: FieldErrors<ApplicationValues>) => {
    const s = firstStepWithError(fieldErrors as Record<string, unknown>);
    if (s >= 0 && s < LAST) {
      goTo(s);
      setNotice({ tone: "error", text: `Please complete the highlighted fields in “${stepTitles[s]}”.` });
    }
  };

  // Validates everything, then submits (or jumps to the first step that needs attention).
  const submit = () => handleSubmit(onValid, onInvalid)();

  const startOver = () => {
    if (!window.confirm("Clear everything you've entered and start a new application?")) return;
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* ignore */
    }
    reset({ ...emptyApplication(initialPosition), draftId: newId(), startedAt: Date.now() });
    setStep(0);
    setFurthest(0);
    setRestored(false);
    setSavedAt(null);
  };

  const err = (path: string) => {
    const node = path.split(".").reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], errors);
    return (node as { message?: string } | undefined)?.message;
  };
  const files = (name: "workSamples" | "supportingDocs") => v[name] ?? [];
  const single = (name: "resume" | "portfolioFile") => {
    const file = v[name];
    return file ? [file] : [];
  };
  const draftId = v.draftId;
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div ref={top} className="scroll-mt-[calc(var(--header-h)+16px)]">
      {/* ---------- Progress ---------- */}
      <div className="rounded-3xl border border-line bg-white p-5 shadow-[0_12px_32px_-26px_rgb(8_40_60/0.4)] sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[13px] font-medium text-ink-soft">
            Step <span className="font-semibold text-ink">{step + 1}</span> of {stepTitles.length}
            <span className="hidden sm:inline"> · {stepTitles[step]}</span>
          </p>
          <p className="flex items-center gap-1.5 text-[12.5px] text-ink-soft" aria-live="polite">
            {savedAt && (
              <>
                <Save className="size-3.5" aria-hidden="true" /> Progress saved
              </>
            )}
          </p>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-bg-soft" role="progressbar" aria-label="Application progress" aria-valuemin={1} aria-valuemax={stepTitles.length} aria-valuenow={step + 1}>
          <motion.div className="h-full rounded-full bg-linear-to-r from-accent to-accent-strong" animate={{ width: `${((step + 1) / stepTitles.length) * 100}%` }} transition={{ duration: 0.4 }} />
        </div>
        <ol className="mt-5 hidden grid-cols-7 gap-2 lg:grid">
          {stepTitles.map((title, i) => {
            const done = i < step || (i <= furthest && i !== step);
            const reachable = i <= furthest;
            return (
              <li key={title}>
                <button
                  type="button"
                  disabled={!reachable}
                  onClick={() => goTo(i)}
                  aria-current={i === step ? "step" : undefined}
                  className="group flex w-full flex-col items-center gap-2 text-center disabled:cursor-not-allowed"
                >
                  <span
                    className={cn(
                      "grid size-9 place-items-center rounded-full border-2 text-[13px] font-semibold transition-colors",
                      i === step ? "border-accent-strong bg-accent-strong text-white" : done ? "border-accent-strong bg-bg-blue text-accent-strong" : "border-line bg-white text-ink-soft",
                    )}
                  >
                    {done && i !== step ? <Check className="size-4" aria-hidden="true" /> : i + 1}
                  </span>
                  <span className={cn("text-[11.5px] leading-tight font-medium", i === step ? "text-ink" : "text-ink-soft group-enabled:group-hover:text-ink")}>{title}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {restored && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-accent/25 bg-bg-blue px-5 py-3.5 text-[14px] text-ink">
          <span>Welcome back — we restored the application you started on this device.</span>
          <button type="button" onClick={startOver} className="inline-flex items-center gap-1.5 font-semibold text-accent-strong hover:underline">
            <RotateCcw className="size-4" aria-hidden="true" /> Start over
          </button>
        </div>
      )}

      <form onSubmit={(e) => e.preventDefault()} noValidate className="mt-6">
        {/* Honeypot (hidden from people). */}
        <div className="hidden" aria-hidden="true">
          <label>
            Nickname <input tabIndex={-1} autoComplete="off" {...register("nickname")} />
          </label>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.section
            key={step}
            aria-labelledby={`step-${step}-title`}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-3xl border border-line bg-white p-6 shadow-[0_12px_32px_-26px_rgb(8_40_60/0.4)] sm:p-9"
          >
            <h2 id={`step-${step}-title`} className="text-[1.5rem] font-semibold tracking-[-0.02em] text-ink sm:text-[1.7rem]">
              {stepTitles[step]}
            </h2>

            {step === 0 && (
              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <TextField label="Full Name" required autoComplete="name" error={err("fullName")} {...register("fullName")} />
                <TextField label="Email Address" required type="email" autoComplete="email" error={err("email")} {...register("email")} />
                <TextField label="Mobile Number" required type="tel" autoComplete="tel" placeholder="+91 98765 43210" error={err("mobile")} {...register("mobile")} />
                <TextField label="WhatsApp Number" type="tel" placeholder="If different from mobile" error={err("whatsapp")} {...register("whatsapp")} />
                <TextField label="Current Location" required autoComplete="address-level2" placeholder="City, State" error={err("location")} {...register("location")} />
                <TextField label="Date of Birth" type="date" max={today} error={err("dateOfBirth")} {...register("dateOfBirth")} />
                <TextField label="LinkedIn Profile" type="url" placeholder="https://linkedin.com/in/your-name" error={err("linkedin")} {...register("linkedin")} />
                <TextField label="Portfolio / Personal Website" type="url" placeholder="https://" error={err("website")} {...register("website")} />
              </div>
            )}

            {step === 1 && (
              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <SelectField label="Applying For" required options={positionOptions} error={err("position")} className="sm:col-span-2" {...register("position")} />
                {isIntern && <SelectField label="Internship Track" required options={internshipTracks} error={err("internshipTrack")} className="sm:col-span-2" {...register("internshipTrack")} />}
                <SelectField label="Total Experience" required options={EXPERIENCE_OPTIONS} error={err("totalExperience")} {...register("totalExperience")} />
                <SelectField label="Current Employment Status" required options={EMPLOYMENT_OPTIONS} error={err("employmentStatus")} {...register("employmentStatus")} />
                {employed && (
                  <>
                    <TextField label="Current Company" required autoComplete="organization" error={err("currentCompany")} {...register("currentCompany")} />
                    <TextField label="Current Designation" required autoComplete="organization-title" error={err("currentDesignation")} {...register("currentDesignation")} />
                  </>
                )}
                {!isIntern && <TextField label="Current CTC" placeholder="e.g. 3.6 LPA" error={err("currentCtc")} {...register("currentCtc")} />}
                <TextField
                  label={isIntern ? "Expected Stipend" : "Expected Salary"}
                  required={!isIntern}
                  placeholder={isIntern ? "If any" : "e.g. 4.5 LPA"}
                  error={err("expectedSalary")}
                  {...register("expectedSalary")}
                />
                {!isIntern && <SelectField label="Notice Period" required options={NOTICE_OPTIONS} error={err("noticePeriod")} {...register("noticePeriod")} />}
                {!isIntern && <TextField label="Available Joining Date" required type="date" min={today} error={err("joiningDate")} {...register("joiningDate")} />}
              </div>
            )}

            {step === 2 && (
              <div className="mt-7 grid gap-6">
                <TextField label="Primary Skills" required placeholder="Your strongest 3–5 skills, separated by commas" error={err("primarySkills")} {...register("primarySkills")} />
                <ChipsField label={config.skillsLabel} options={config.skillOptions} value={v.roleSkills} onChange={(v) => setValue("roleSkills", v, { shouldDirty: true })} />
                <ChipsField label={config.toolsLabel} options={config.toolOptions} value={v.tools} onChange={(v) => setValue("tools", v, { shouldDirty: true })} />
                <SelectField label="Years of Experience in This Field" required options={EXPERIENCE_OPTIONS} error={err("relevantExperience")} {...register("relevantExperience")} />
                <TextAreaField
                  label="Brief Professional Summary"
                  required
                  maxLength={1500}
                  count={v.summary?.length}
                  placeholder="Who you are, what you're good at, and what you're looking for (60+ characters)."
                  error={err("summary")}
                  {...register("summary")}
                />
                <TextAreaField label="Previous Project Details" maxLength={2000} count={v.projects?.length} placeholder={config.projectsHint} error={err("projects")} {...register("projects")} />
                {config.links.map((link) => (
                  <TextField
                    key={link.key}
                    label={link.label}
                    required={link.required}
                    type="url"
                    placeholder={link.placeholder}
                    error={err(`roleLinks.${link.key}`)}
                    {...register(`roleLinks.${link.key}` as FieldPath<ApplicationValues>)}
                  />
                ))}
                <TextAreaField
                  label="Portfolio Links & Work Samples"
                  maxLength={1000}
                  rows={3}
                  count={v.portfolioLinks?.length}
                  placeholder="Links to more of your work — one per line (Drive, Behance, GitHub, YouTube…)"
                  error={err("portfolioLinks")}
                  {...register("portfolioLinks")}
                />
              </div>
            )}

            {step === 3 && (
              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <SelectField label="Highest Qualification" required options={QUALIFICATION_OPTIONS} error={err("qualification")} {...register("qualification")} />
                <TextField label="Graduation Year" required inputMode="numeric" maxLength={4} placeholder={isIntern ? "Expected year" : "e.g. 2023"} error={err("graduationYear")} {...register("graduationYear")} />
                <TextField label="College / University" required className="sm:col-span-2" error={err("institution")} {...register("institution")} />
                <TextAreaField label="Additional Certifications" className="sm:col-span-2" rows={3} maxLength={1000} count={v.certifications?.length} placeholder="Courses or certifications relevant to the role" error={err("certifications")} {...register("certifications")} />
              </div>
            )}

            {step === 4 && draftId && (
              <div className="mt-7 grid gap-7">
                <FileField kind="resume" label="Resume" required draftId={draftId} value={single("resume")} onChange={(v) => setValue("resume", v[0] ?? null, { shouldValidate: true, shouldDirty: true })} error={err("resume")} />
                <FileField
                  kind="portfolio"
                  label="Portfolio"
                  hint={kind === "design" || kind === "video" ? "Recommended for creative roles: a PDF of your best work." : undefined}
                  draftId={draftId}
                  value={single("portfolioFile")}
                  onChange={(v) => setValue("portfolioFile", v[0] ?? null, { shouldDirty: true })}
                />
                <FileField
                  kind="work_sample"
                  label="Work Samples"
                  hint={kind === "video" ? "For videos, share links in the previous step — upload stills, storyboards or PDFs here." : "Screenshots, designs or documents that show your work."}
                  draftId={draftId}
                  value={files("workSamples")}
                  onChange={(v) => setValue("workSamples", v, { shouldDirty: true })}
                />
                <FileField kind="supporting" label="Supporting Documents" hint="Certificates, mark sheets or recommendation letters." draftId={draftId} value={files("supportingDocs")} onChange={(v) => setValue("supportingDocs", v, { shouldDirty: true })} />
              </div>
            )}

            {step === 5 && (
              <div className="mt-7 grid gap-6">
                <TextAreaField label="Why do you want to join our company?" required maxLength={1500} count={v.whyJoin?.length} error={err("whyJoin")} {...register("whyJoin")} />
                <TextAreaField label="Why should we hire you?" required maxLength={1500} count={v.whyHire?.length} error={err("whyHire")} {...register("whyHire")} />
                <TextAreaField label="What are your career goals?" required maxLength={1500} count={v.careerGoals?.length} error={err("careerGoals")} {...register("careerGoals")} />
                <RadioField label="Are you comfortable working with a team?" required name="teamwork" options={YES_NO} value={v.teamwork} onChange={(v) => setValue("teamwork", v, { shouldValidate: true, shouldDirty: true })} error={err("teamwork")} />
                <RadioField
                  label="Are you willing to work from our office in Coimbatore?"
                  required
                  name="officeWork"
                  options={YES_NO}
                  value={v.officeWork}
                  onChange={(v) => setValue("officeWork", v, { shouldValidate: true, shouldDirty: true })}
                  error={err("officeWork")}
                />
                <SelectField label="How did you hear about this opportunity?" required options={HEARD_FROM_OPTIONS} error={err("heardFrom")} {...register("heardFrom")} />
              </div>
            )}

            {step === LAST && (
              <ReviewStep values={v} kind={kind} positionLabel={positionTitle(position)} onEdit={goTo} register={register} err={err} />
            )}
          </motion.section>
        </AnimatePresence>

        {notice && (
          <div role="alert" className={cn("mt-5 flex gap-3 rounded-2xl px-5 py-4 text-[14.5px]", notice.tone === "error" ? "bg-red-50 text-red-700" : "bg-bg-blue text-ink")}>
            <AlertTriangle className="mt-0.5 size-4.5 shrink-0" aria-hidden="true" />
            {notice.text}
          </div>
        )}

        {/* ---------- Navigation ---------- */}
        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => goTo(step - 1)}
            disabled={step === 0 || submitting}
            className="inline-flex h-12 items-center gap-2 rounded-full border border-line bg-white px-5 text-[15px] font-medium text-ink transition-colors hover:border-accent/50 hover:text-accent-strong disabled:invisible"
          >
            <ArrowLeft className="size-4" aria-hidden="true" /> Previous
          </button>
          {step < LAST ? (
            <button
              type="button"
              onClick={() => void next()}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-accent-strong px-6 text-[15px] font-medium text-white shadow-[0_8px_24px_-8px_rgb(0_114_209/0.55)] transition-colors hover:bg-accent-hover"
            >
              {step === LAST - 1 ? "Review application" : "Next"} <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void submit()}
              disabled={submitting}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-accent-strong px-6 text-[15px] font-medium text-white shadow-[0_8px_24px_-8px_rgb(0_114_209/0.55)] transition-colors hover:bg-accent-hover disabled:opacity-70"
            >
              {submitting ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Send className="size-4" aria-hidden="true" />}
              {submitting ? "Submitting…" : "Submit Application"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export type { FileRef };
