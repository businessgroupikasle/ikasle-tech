"use client";

import { Suspense, useCallback, useState, type ReactNode } from "react";
import type { ContactFormInput } from "@/lib/contact-schema";
import { ContactForm } from "./ContactForm";
import { WindowFrame } from "@/components/ui/Frames";

const show = (v: unknown) => (typeof v === "string" && v.trim() ? JSON.stringify(v.trim().slice(0, 42) + (v.trim().length > 42 ? "…" : "")) : null);

/** Code-themed illustration: the form's request payload, updating live as the visitor types. */
function PayloadPreview({ values }: { values: Partial<ContactFormInput> }) {
  const rows: [string, string | null][] = [
    ["name", show(values.fullName)],
    ["email", show(values.email)],
    ["company", show(values.company)],
    ["projectType", show(values.projectType)],
    ["description", show(values.description)],
  ];
  return (
    <WindowFrame dark title="POST /api/contact" className="shadow-soft">
      <div className="code-surface p-5 text-[12.5px]" aria-hidden="true">
        <p>
          <span className="tok-keyword">await</span> <span className="tok-fn">fetch</span>
          <span className="tok-punct">(</span>
          <span className="tok-string">&quot;/api/contact&quot;</span>
          <span className="tok-punct">, {"{"}</span>
        </p>
        <p className="pl-4">
          <span className="tok-prop">method</span>
          <span className="tok-punct">: </span>
          <span className="tok-string">&quot;POST&quot;</span>
          <span className="tok-punct">,</span>
        </p>
        <p className="pl-4">
          <span className="tok-prop">body</span>
          <span className="tok-punct">: </span>
          <span className="tok-type">JSON</span>
          <span className="tok-punct">.</span>
          <span className="tok-fn">stringify</span>
          <span className="tok-punct">({"{"}</span>
        </p>
        {rows.map(([k, v]) => (
          <p key={k} className="truncate pl-8">
            <span className="tok-prop">{k}</span>
            <span className="tok-punct">: </span>
            {v ? <span className="tok-string">{v}</span> : <span className="tok-comment">undefined</span>}
            <span className="tok-punct">,</span>
          </p>
        ))}
        <p className="pl-4">
          <span className="tok-punct">{"}),"}</span>
        </p>
        <p>
          <span className="tok-punct">{"});"}</span>
          <span className="caret" />
        </p>
      </div>
    </WindowFrame>
  );
}

/** Request preview + company contact details (left), enquiry form (right; first on phones). */
export function ContactExperience({ fallbackEmail, aside }: { fallbackEmail: string | null; aside?: ReactNode }) {
  const [values, setValues] = useState<Partial<ContactFormInput>>({});
  const onValuesChange = useCallback((v: Partial<ContactFormInput>) => setValues({ ...v }), []);

  return (
    <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
      <div className="order-2 flex flex-col gap-8 lg:order-1">
        <div>
          <PayloadPreview values={values} />
          <p className="mt-3 font-mono text-[11px] text-ink-soft">{"// live preview of the request this form sends"}</p>
        </div>
        {aside}
      </div>
      <div id="contact-form" className="order-1 scroll-mt-[calc(var(--header-h)+24px)] rounded-[28px] border border-line bg-white p-6 shadow-float sm:p-9 lg:order-2">
        <h2 className="text-2xl font-semibold tracking-tight text-ink">Tell us about your project</h2>
        <p className="mt-2 mb-8 text-[15px] text-ink-soft">Fields marked optional can be left blank.</p>
        <Suspense fallback={<div className="h-[640px] rounded-2xl shimmer" />}>
          <ContactForm fallbackEmail={fallbackEmail} onValuesChange={onValuesChange} />
        </Suspense>
      </div>
    </div>
  );
}
