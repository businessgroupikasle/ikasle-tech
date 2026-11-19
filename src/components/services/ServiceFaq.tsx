import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { cn } from "@/lib/cn";

/** One paragraph of an answer: plain text, or text led by a bold label ("Website examples: …"). */
export type FaqParagraph = string | { label: string; text: string };

export type FaqContent = {
  eyebrow?: string;
  /** Sub-heading under the section title. */
  heading?: string;
  /** A string is one paragraph; an array is several. */
  items: { question: string; answer: string | FaqParagraph[] }[];
};

const paragraphs = (answer: string | FaqParagraph[]) => (typeof answer === "string" ? [answer] : answer);

/** Answer as plain text, for FAQPage structured data. */
export const faqAnswerText = (answer: string | FaqParagraph[]) =>
  paragraphs(answer)
    .map((p) => (typeof p === "string" ? p : `${p.label} ${p.text}`))
    .join(" ");

/**
 * FAQ section: heading on the left (pinned while scrolling on desktop), shared FAQ accordion on the right.
 * Used at the end of each service page (after the CTA, so only bottom padding) and on the services listing.
 */
export function ServiceFaq({ idPrefix, faq, className = "pb-20 sm:pb-24" }: { idPrefix: string; faq: FaqContent; className?: string }) {
  return (
    <section aria-labelledby={`${idPrefix}-faq`} className={className}>
      <div className="container-x grid items-start gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
        <div className="min-w-0 lg:sticky lg:top-[calc(var(--header-h)+32px)]">
          <h2 id={`${idPrefix}-faq`} className="text-[1.75rem] leading-[1.15] font-semibold tracking-[-0.03em] text-balance text-ink sm:text-[2.1rem]">
            Frequently Asked Questions
          </h2>
          {faq.eyebrow && <p className="mt-2 font-mono text-[12px] tracking-wide text-accent-strong uppercase">{faq.eyebrow}</p>}
          {faq.heading && (
            <p className="mt-5 text-[1.2rem] leading-snug font-semibold tracking-[-0.02em] text-balance text-ink sm:text-[1.3rem]">{faq.heading}</p>
          )}
          <p className={cn("max-w-sm text-justify text-[16px] leading-relaxed text-ink-soft", faq.heading ? "mt-3" : "mt-5")}>
            Can&apos;t find what you&apos;re looking for? Our team is happy to answer questions about your project.
          </p>
          <Link
            href="/contact"
            className="group mt-4 inline-flex items-center gap-1.5 text-[15px] font-semibold text-accent-strong focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Ask us a question
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>
        <div className="min-w-0">
          <FaqAccordion
            headingLevel="h3"
            items={faq.items.map((item, i) => ({
              id: `${idPrefix}-${i + 1}`,
              question: item.question,
              answer: paragraphs(item.answer).map((p, j) => (
                <p key={j} className={cn("text-justify", j ? "mt-3" : undefined)}>
                  {typeof p === "string" ? (
                    p
                  ) : (
                    <>
                      <strong className="font-semibold text-ink">{p.label}</strong> {p.text}
                    </>
                  )}
                </p>
              )),
            }))}
          />
        </div>
      </div>
    </section>
  );
}
