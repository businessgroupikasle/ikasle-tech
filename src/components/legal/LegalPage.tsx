import { ClipboardCheck } from "lucide-react";
import type { LegalDocument } from "@/content/legal/types";
import { InlineText } from "@/components/blog/ArticleBody";
import { formatDate } from "@/lib/blog";

/** Readable legal page: header, draft notice, table of contents and numbered sections with review flags. */
export function LegalPage({ doc }: { doc: LegalDocument }) {
  const draft = doc.status === "draft";
  return (
    <div className="pt-[calc(var(--header-h)+48px)] pb-24 lg:pt-[calc(var(--header-h)+72px)]">
      <div className="container-x">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[12.5px] tracking-wide text-accent-strong">{"// LEGAL"}</p>
          <h1 className="mt-4 text-[2.4rem] leading-[1.06] font-semibold tracking-[-0.035em] text-ink sm:text-[3.2rem]">{doc.title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">{doc.intro}</p>
          <p className="mt-4 text-[14px] text-ink-soft">
            {doc.effectiveDate ? <>Effective {formatDate(doc.effectiveDate)}</> : <>Not yet published — no effective date has been set.</>}
          </p>

          {draft && (
            <div role="note" className="mt-8 rounded-2xl border border-dashed border-warning/50 bg-warning/[0.07] px-5 py-4 text-[14.5px] leading-relaxed text-[#7a4b00]">
              <p className="font-semibold">Draft — pending review by IKASLE Technologies</p>
              <p className="mt-1">
                This page is an editable draft. Sections marked “To confirm” need business (and, where noted, legal) review before this policy is
                published. It does not yet claim compliance with any specific law.
              </p>
            </div>
          )}

          <nav aria-label="On this page" className="mt-10 rounded-2xl border border-line bg-bg-soft p-5">
            <p className="font-mono text-[12px] tracking-wider text-ink-soft uppercase">On this page</p>
            <ol className="mt-3 grid gap-x-6 gap-y-1.5 text-[15px] sm:grid-cols-2">
              {doc.sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-ink-soft hover:text-accent-strong">
                    {i + 1}. {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="mt-6 text-[16.5px] leading-[1.8] text-ink-soft">
            {doc.sections.map((s, i) => (
              <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="border-b border-line py-8 last:border-0">
                <h2 id={`${s.id}-title`} className="text-[1.4rem] leading-snug font-semibold tracking-tight text-ink">
                  <span className="mr-2 font-mono text-[0.8em] text-accent-strong">{String(i + 1).padStart(2, "0")}</span>
                  {s.title}
                </h2>
                {s.body.map((b, j) =>
                  "p" in b ? (
                    <p key={j} className="mt-4">
                      <InlineText content={b.p} />
                    </p>
                  ) : (
                    <ul key={j} className="mt-4 list-disc space-y-2 pl-6 marker:text-accent">
                      {b.list.map((item, k) => (
                        <li key={k}>
                          <InlineText content={item} />
                        </li>
                      ))}
                    </ul>
                  ),
                )}
                {draft && s.review && (
                  <p className="mt-4 flex items-start gap-2.5 rounded-xl border border-warning/30 bg-warning/[0.06] px-4 py-3 text-[14px] leading-relaxed text-[#7a4b00]">
                    <ClipboardCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    <span>
                      <strong className="font-semibold">To confirm: </strong>
                      {s.review}
                    </span>
                  </p>
                )}
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
