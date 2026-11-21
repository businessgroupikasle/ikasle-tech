import { CalendarCheck, CheckCircle2, Hash, Mail } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { REFERENCE_PATTERN } from "@/lib/careers/application-schema";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Application Submitted — Careers",
  description: "Your application to IKASLÉ Technologies has been submitted.",
  path: "/careers/application-success",
  noindex: true,
});

type Props = { searchParams: Promise<{ ref?: string; position?: string; date?: string }> };

/** Shown after a successful application, with the reference, position and submission date from the form's redirect. */
export default async function ApplicationSuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const reference = typeof params.ref === "string" && REFERENCE_PATTERN.test(params.ref) ? params.ref : null;
  const position = typeof params.position === "string" ? params.position.slice(0, 80) : null;
  const date = typeof params.date === "string" && !Number.isNaN(Date.parse(params.date)) ? new Date(params.date) : null;
  const submitted = date?.toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short", timeZone: "Asia/Kolkata" });

  const details = [
    { icon: Hash, label: "Application Reference", value: reference },
    { icon: CheckCircle2, label: "Applied Position", value: position },
    { icon: CalendarCheck, label: "Submitted", value: submitted ? `${submitted} IST` : null },
  ].filter((d) => d.value);

  return (
    <section aria-labelledby="success-title" className="relative overflow-hidden pt-[calc(var(--header-h)+48px)] pb-24">
      <div className="ambient" aria-hidden="true" />
      <div className="container-x relative">
        <div className="mx-auto max-w-2xl rounded-[32px] border border-line bg-white px-6 py-12 text-center shadow-[0_30px_70px_-40px_rgb(8_40_60/0.45)] sm:px-12">
          <div className="enter-up mx-auto grid size-20 place-items-center rounded-full bg-emerald-50">
            <span className="grid size-14 place-items-center rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 text-white shadow-[0_14px_30px_-12px_rgb(16_150_100/0.7)]">
              <CheckCircle2 className="size-8" strokeWidth={2} aria-hidden="true" />
            </span>
          </div>
          <h1 id="success-title" className="enter-up mt-7 text-[1.9rem] leading-tight font-semibold tracking-[-0.03em] text-balance text-ink [animation-delay:100ms] sm:text-[2.3rem]">
            Your Application Has Been Successfully Submitted!
          </h1>
          <p className="enter-up mx-auto mt-4 max-w-lg text-[16.5px] leading-relaxed text-ink-soft [animation-delay:180ms]">
            Thank you for your interest in joining our team. Our recruitment team will review your application and contact you if your profile matches our
            requirements.
          </p>

          {details.length > 0 && (
            <dl className="enter-up mt-9 grid gap-3 text-left [animation-delay:260ms] sm:grid-cols-3">
              {details.map((d) => (
                <div key={d.label} className="rounded-2xl border border-line bg-bg-soft/60 p-4">
                  <dt className="flex items-center gap-1.5 text-[12.5px] text-ink-soft">
                    <d.icon className="size-3.5 text-accent-strong" aria-hidden="true" />
                    {d.label}
                  </dt>
                  <dd className="mt-1 text-[15px] font-semibold break-words text-ink">{d.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {reference && (
            <p className="enter-up mt-6 flex items-center justify-center gap-2 text-[14px] text-ink-soft [animation-delay:320ms]">
              <Mail className="size-4" aria-hidden="true" /> Keep your reference number for any questions about your application.
            </p>
          )}

          <div className="enter-up mt-9 flex flex-col justify-center gap-3 [animation-delay:380ms] xs:flex-row">
            <ButtonLink href="/careers" size="lg" arrow>
              Back to Careers
            </ButtonLink>
            <ButtonLink href="/" size="lg" variant="secondary">
              Go to Homepage
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
