"use client";

import { Suspense, type ReactNode } from "react";
import { ContactForm } from "./ContactForm";

function ConsultationInfo() {
  return (
    <div className="rounded-3xl border border-line bg-white p-6 shadow-soft sm:p-7">
      <h2 className="text-lg font-semibold tracking-tight text-ink sm:text-xl">What to Expect</h2>
      <ul className="mt-4 space-y-4">
        <li className="flex items-start gap-3">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-bg-blue font-mono text-xs font-semibold text-accent-strong">
            01
          </span>
          <div>
            <h3 className="text-sm font-semibold text-ink">Prompt Initial Reply</h3>
            <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">
              Our engineering team reviews your requirements and responds within 24 hours.
            </p>
          </div>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-bg-blue font-mono text-xs font-semibold text-accent-strong">
            02
          </span>
          <div>
            <h3 className="text-sm font-semibold text-ink">Technical Consultation</h3>
            <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">
              We discuss architecture, milestones, integrations, and the right tech stack for your goals.
            </p>
          </div>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-bg-blue font-mono text-xs font-semibold text-accent-strong">
            03
          </span>
          <div>
            <h3 className="text-sm font-semibold text-ink">Tailored Proposal</h3>
            <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">
              Transparent project scope, timeline, and delivery roadmap with zero hidden commitments.
            </p>
          </div>
        </li>
      </ul>
    </div>
  );
}

/** Company contact details + expectations (left), enquiry form (right; first on phones). */
export function ContactExperience({ fallbackEmail, aside }: { fallbackEmail: string | null; aside?: ReactNode }) {
  return (
    <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
      <div className="order-2 flex flex-col gap-6 lg:order-1">
        {aside}
        <ConsultationInfo />
      </div>
      <div id="contact-form" className="order-1 scroll-mt-[calc(var(--header-h)+24px)] rounded-[28px] border border-line bg-white p-5 xs:p-6 shadow-float sm:p-9 lg:order-2">
        <h2 className="mb-8 text-2xl font-semibold tracking-tight text-ink">Tell us about your project</h2>
        <Suspense fallback={<div className="h-[640px] rounded-2xl shimmer" />}>
          <ContactForm fallbackEmail={fallbackEmail} />
        </Suspense>
      </div>
    </div>
  );
}
