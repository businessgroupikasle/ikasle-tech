"use client";

import { useId, useState, type ComponentProps, type ReactNode } from "react";
import { Check, Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import { inputClass } from "./input-class";

type FieldShellProps = { label: string; required?: boolean; hint?: ReactNode; error?: string; className?: string; children: (ids: { id: string; describedBy?: string }) => ReactNode };

/** Label, control, hint and error with the right ARIA wiring. */
function Field({ label, required, hint, error, className, children }: FieldShellProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;
  return (
    <div className={cn("flex flex-col", className)}>
      <label htmlFor={id} className="mb-1.5 text-[14px] font-medium text-ink">
        {label}
        {required ? <span className="ml-0.5 text-red-500" aria-hidden="true">*</span> : <span className="ml-1.5 text-[12.5px] font-normal text-ink-soft">(optional)</span>}
      </label>
      {children({ id, describedBy })}
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-[12.5px] leading-snug text-ink-soft">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-[13px] font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

type InputProps = Omit<ComponentProps<"input">, "className"> & { label: string; required?: boolean; hint?: ReactNode; error?: string; className?: string };

export function TextField({ label, required, hint, error, className, ...input }: InputProps) {
  return (
    <Field label={label} required={required} hint={hint} error={error} className={className}>
      {({ id, describedBy }) => <input id={id} aria-invalid={Boolean(error)} aria-describedby={describedBy} aria-required={required} className={cn(inputClass(Boolean(error)), "h-12")} {...input} />}
    </Field>
  );
}

type TextAreaProps = Omit<ComponentProps<"textarea">, "className"> & { label: string; required?: boolean; hint?: ReactNode; error?: string; className?: string; count?: number };

export function TextAreaField({ label, required, hint, error, className, count, maxLength, ...textarea }: TextAreaProps) {
  return (
    <Field
      label={label}
      required={required}
      error={error}
      className={className}
      hint={
        hint || maxLength ? (
          <span className="flex justify-between gap-3">
            <span>{hint}</span>
            {maxLength ? <span className="shrink-0 tabular-nums">{count ?? 0} / {maxLength}</span> : null}
          </span>
        ) : undefined
      }
    >
      {({ id, describedBy }) => (
        <textarea id={id} aria-invalid={Boolean(error)} aria-describedby={describedBy} aria-required={required} maxLength={maxLength} rows={4} className={cn(inputClass(Boolean(error)), "min-h-28 resize-y py-3 leading-relaxed")} {...textarea} />
      )}
    </Field>
  );
}

type SelectProps = Omit<ComponentProps<"select">, "className"> & { label: string; required?: boolean; hint?: ReactNode; error?: string; className?: string; options: readonly (string | { value: string; label: string })[]; placeholder?: string };

export function SelectField({ label, required, hint, error, className, options, placeholder = "Select an option", ...select }: SelectProps) {
  return (
    <Field label={label} required={required} hint={hint} error={error} className={className}>
      {({ id, describedBy }) => (
        <select id={id} aria-invalid={Boolean(error)} aria-describedby={describedBy} aria-required={required} className={cn(inputClass(Boolean(error)), "h-12 appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%235b7084%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-position-[right_14px_center] bg-no-repeat pr-10")} {...select}>
          <option value="">{placeholder}</option>
          {options.map((o) => {
            const opt = typeof o === "string" ? { value: o, label: o } : o;
            return (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            );
          })}
        </select>
      )}
    </Field>
  );
}

/** Pick-any chips with an "add your own" box. */
export function ChipsField({ label, options, value, onChange, hint, error }: { label: string; options: string[]; value: string[]; onChange: (next: string[]) => void; hint?: string; error?: string }) {
  const [custom, setCustom] = useState("");
  const id = useId();
  const all = [...options, ...value.filter((v) => !options.includes(v))];
  const toggle = (item: string) => onChange(value.includes(item) ? value.filter((v) => v !== item) : [...value, item]);
  const addCustom = () => {
    const item = custom.trim().slice(0, 60);
    if (item && !value.includes(item) && value.length < 30) onChange([...value, item]);
    setCustom("");
  };
  return (
    <fieldset aria-describedby={hint ? `${id}-hint` : undefined}>
      <legend className="mb-2 text-[14px] font-medium text-ink">
        {label} <span className="text-[12.5px] font-normal text-ink-soft">(choose all that apply)</span>
      </legend>
      <div className="flex flex-wrap gap-2">
        {all.map((item) => {
          const on = value.includes(item);
          return (
            <button
              key={item}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(item)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13.5px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                on ? "border-accent-strong bg-accent-strong text-white" : "border-line bg-white text-ink-soft hover:border-accent/50 hover:text-ink",
              )}
            >
              {on && <Check className="size-3.5" aria-hidden="true" />}
              {item}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex gap-2">
        <label htmlFor={`${id}-custom`} className="sr-only">
          Add another to {label}
        </label>
        <input
          id={`${id}-custom`}
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCustom();
            }
          }}
          placeholder="Add another…"
          maxLength={60}
          className={cn(inputClass(), "h-10 max-w-64 text-[14px]")}
        />
        <button type="button" onClick={addCustom} className="inline-flex h-10 items-center gap-1 rounded-xl border border-line bg-white px-3 text-[14px] font-medium text-ink hover:border-accent/50 hover:text-accent-strong">
          <Plus className="size-4" aria-hidden="true" /> Add
        </button>
      </div>
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-[12.5px] text-ink-soft">
          {hint}
        </p>
      )}
      {error && <p role="alert" className="mt-1.5 text-[13px] font-medium text-red-600">{error}</p>}
    </fieldset>
  );
}

/** A yes/no (or any short list) radio question shown as segmented buttons. */
export function RadioField({ label, name, options, value, onChange, error, required }: { label: string; name: string; options: readonly string[]; value: string; onChange: (v: string) => void; error?: string; required?: boolean }) {
  return (
    <fieldset>
      <legend className="mb-2 text-[14px] font-medium text-ink">
        {label}
        {required && <span className="ml-0.5 text-red-500" aria-hidden="true">*</span>}
      </legend>
      <div className="flex flex-wrap gap-2.5">
        {options.map((option) => (
          <label
            key={option}
            className={cn(
              "inline-flex cursor-pointer items-center gap-2 rounded-xl border px-5 py-2.5 text-[14.5px] font-medium transition-colors has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent",
              value === option ? "border-accent-strong bg-bg-blue text-accent-strong" : "border-line bg-white text-ink-soft hover:border-accent/40",
            )}
          >
            <input type="radio" name={name} value={option} checked={value === option} onChange={() => onChange(option)} className="sr-only" />
            <span className={cn("grid size-4 place-items-center rounded-full border-2", value === option ? "border-accent-strong" : "border-line")} aria-hidden="true">
              {value === option && <span className="size-2 rounded-full bg-accent-strong" />}
            </span>
            {option}
          </label>
        ))}
      </div>
      {error && <p role="alert" className="mt-1.5 text-[13px] font-medium text-red-600">{error}</p>}
    </fieldset>
  );
}
