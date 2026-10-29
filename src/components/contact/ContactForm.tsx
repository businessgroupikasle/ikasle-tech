"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { CircleAlert, CircleCheck, LoaderCircle, Send, TriangleAlert } from "lucide-react";
import {
  PROJECT_TYPES,
  contactSchema,
  type ContactFormInput,
  type ContactFormValues,
  type ContactResponse,
} from "@/lib/contact-schema";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type Status =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success" }
  | { state: "error"; code: string; message: string };

const fieldBase =
  "block w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-ink placeholder:text-ink-soft/60 shadow-sm transition-[border-color,box-shadow] duration-150 " +
  "focus:border-accent focus:ring-4 focus:ring-accent/15 focus:outline-none aria-[invalid=true]:border-danger aria-[invalid=true]:focus:ring-danger/15";

const selectCls = cn(
  fieldBase,
  "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2364748b%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:14px] bg-[right_14px_center] bg-no-repeat pr-10",
);

function Field({
  label,
  optional,
  error,
  hint,
  children,
  id,
}: {
  label: string;
  optional?: boolean;
  error?: string;
  hint?: string;
  children: (props: { id: string; "aria-invalid": boolean; "aria-describedby"?: string }) => ReactNode;
  id: string;
}) {
  const describedBy = [error ? `${id}-error` : null, hint ? `${id}-hint` : null].filter(Boolean).join(" ") || undefined;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="flex items-baseline justify-between text-[14px] font-medium text-ink">
        {label}
        {optional && <span className="font-mono text-[11px] font-normal text-ink-soft">optional</span>}
      </label>
      {children({ id, "aria-invalid": Boolean(error), "aria-describedby": describedBy })}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-[12.5px] text-ink-soft">
          {hint}
        </p>
      )}
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={`${id}-error`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-1.5 text-[13px] text-[#b42318]"
          >
            <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ContactForm({ fallbackEmail, onValuesChange }: { fallbackEmail: string | null; onValuesChange?: (v: Partial<ContactFormInput>) => void }) {
  const uid = useId();
  const params = useSearchParams();
  const [status, setStatus] = useState<Status>({ state: "idle" });

  const typeParam = params.get("type");
  const initialType = PROJECT_TYPES.find((t) => t === typeParam);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    subscribe,
    getValues,
    setFocus,
    formState: { errors },
  } = useForm<ContactFormInput, unknown, ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      company: "",
      // Preselected from ?type= links on service and work pages; empty shows the placeholder.
      projectType: (initialType ?? "") as ContactFormInput["projectType"],
      description: "",
      website: "",
      startedAt: 0,
    },
  });

  // Time-trap baseline: (re)set whenever a fresh form is shown — on mount and after "send another".
  useEffect(() => {
    if (status.state === "idle") setValue("startedAt", Date.now());
  }, [status.state, setValue]);

  useEffect(() => {
    if (!onValuesChange) return;
    onValuesChange(getValues());
    return subscribe({
      formState: { values: true },
      callback: ({ values }) => onValuesChange(values as Partial<ContactFormInput>),
    });
  }, [subscribe, getValues, onValuesChange]);

  const onSubmit = async (values: ContactFormValues) => {
    if (status.state === "submitting") return;
    setStatus({ state: "submitting" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json().catch(() => null)) as ContactResponse | null;
      if (data?.ok) {
        setStatus({ state: "success" });
        reset();
        return;
      }
      if (data && !data.ok && data.fieldErrors) {
        let first: keyof ContactFormValues | null = null;
        for (const [key, message] of Object.entries(data.fieldErrors)) {
          const k = key as keyof ContactFormValues;
          first ??= k;
          setError(k, { type: "server", message });
        }
        if (first && first !== "website" && first !== "startedAt") setFocus(first);
      }
      setStatus({
        state: "error",
        code: data && !data.ok ? data.code : "unknown",
        message: data && !data.ok ? data.message : "Something went wrong. Please try again.",
      });
    } catch {
      setStatus({ state: "error", code: "network", message: "Network error — please check your connection and try again." });
    }
  };

  const submitting = status.state === "submitting";
  const reg = (name: keyof ContactFormInput): UseFormRegisterReturn => register(name);

  if (status.state === "success") {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-start gap-4 rounded-3xl border border-success/25 bg-success/[0.05] p-8" role="status">
        <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-success/15 text-success">
          <CircleCheck className="size-6" aria-hidden="true" />
        </span>
        <h2 className="text-2xl font-semibold tracking-tight text-ink">Message sent</h2>
        <p className="text-[15.5px] leading-relaxed text-ink-soft">Thanks for reaching out. Your enquiry was delivered to our team and we&apos;ll reply to the email address you provided.</p>
        <Button variant="secondary" onClick={() => setStatus({ state: "idle" })}>
          Send another message
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5" aria-describedby={status.state === "error" ? `${uid}-status` : undefined}>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={`${uid}-name`} label="Full Name" error={errors.fullName?.message}>
          {(a) => (
            <input
              {...a}
              {...reg("fullName")}
              autoComplete="name"
              className={fieldBase}
              onKeyDown={(e) => {
                if (!e.ctrlKey && !e.metaKey && !e.altKey && /^[0-9]$/.test(e.key)) {
                  e.preventDefault();
                }
              }}
            />
          )}
        </Field>
        <Field id={`${uid}-email`} label="Business Email" error={errors.email?.message}>
          {(a) => <input {...a} {...reg("email")} type="email" autoComplete="email" inputMode="email" className={fieldBase} />}
        </Field>
        <Field id={`${uid}-phone`} label="Phone Number" optional error={errors.phone?.message}>
          {(a) => <input {...a} {...reg("phone")} type="tel" autoComplete="tel" inputMode="tel" className={fieldBase} />}
        </Field>
        <Field id={`${uid}-company`} label="Company Name" optional error={errors.company?.message}>
          {(a) => <input {...a} {...reg("company")} autoComplete="organization" className={fieldBase} />}
        </Field>
        <Field id={`${uid}-type`} label="Project Type" error={errors.projectType?.message}>
          {(a) => (
            <select {...a} {...reg("projectType")} className={selectCls}>
              <option value="" disabled>
                Select a project type
              </option>
              {PROJECT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          )}
        </Field>
      </div>

      <Field id={`${uid}-desc`} label="Project Description" error={errors.description?.message} hint="What are you building, who is it for, and what does success look like?">
        {(a) => <textarea {...a} {...reg("description")} rows={6} className={cn(fieldBase, "resize-y")} />}
      </Field>

      {/* Honeypot — hidden from people and assistive tech */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" tabIndex={-1} autoComplete="off" {...reg("website")} />
        </label>
      </div>
      <input type="hidden" {...register("startedAt", { valueAsNumber: true })} />

      <AnimatePresence>
        {status.state === "error" && (
          <motion.div
            id={`${uid}-status`}
            role="alert"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={cn(
              "flex items-start gap-3 rounded-2xl border px-4 py-3 text-[14px]",
              status.code === "not_configured" ? "border-warning/40 bg-warning/[0.07] text-[#7a4b00]" : "border-danger/30 bg-danger/[0.05] text-[#b42318]",
            )}
          >
            <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <div>
              <p>{status.message}</p>
              {status.code === "not_configured" && fallbackEmail && (
                <p className="mt-1">
                  Email us directly at{" "}
                  <a className="font-medium underline" href={`mailto:${fallbackEmail}`}>
                    {fallbackEmail}
                  </a>
                  .
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[12.5px] text-ink-soft">We only use your details to respond to this enquiry.</p>
        <Button type="submit" size="lg" disabled={submitting} aria-busy={submitting} className="min-w-[180px]">
          {submitting ? (
            <>
              <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> Sending…
            </>
          ) : (
            <>
              Send message <Send className="size-4" aria-hidden="true" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
