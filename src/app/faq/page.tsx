import { InlineText } from "@/components/blog/ArticleBody";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { ContactCta } from "@/components/home/ContactCta";
import { faqs } from "@/content/faq";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "FAQ",
  description: "Answers to common questions about IKASLE Technologies' software development services and how projects start.",
  path: "/faq",
});

const plain = (answer: (typeof faqs)[number]["answer"]) =>
  answer
    .map((para) => para.map((c) => (typeof c === "string" ? c : "text" in c ? c.text : "code" in c ? c.code : c.strong)).join(""))
    .join(" ");

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: plain(f.answer) } })),
};

export default function FaqPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }} />
      <section aria-labelledby="faq-title" className="relative overflow-hidden pt-[calc(var(--header-h)+48px)] pb-20 lg:pt-[calc(var(--header-h)+72px)]">
        <div className="ambient" aria-hidden="true" />
        <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_50%_0%,#000_10%,transparent_60%)]" aria-hidden="true" />
        <div className="container-x relative">
          <div className="mx-auto max-w-3xl">
            <p className="font-mono text-[12.5px] tracking-wide text-accent-strong">{"// FREQUENTLY ASKED"}</p>
            <h1 id="faq-title" className="mt-4 text-[2.4rem] leading-[1.06] font-semibold tracking-[-0.035em] text-balance text-ink sm:text-[3.2rem]">
              Questions, Answered.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">What we build, how we work, and how to start a conversation with our team.</p>
            <div className="mt-10">
              <FaqAccordion
                items={faqs.map((f) => ({
                  id: f.id,
                  question: f.question,
                  answer: f.answer.map((para, i) => (
                    <p key={i} className={i ? "mt-3" : undefined}>
                      <InlineText content={para} />
                    </p>
                  )),
                }))}
              />
            </div>
          </div>
        </div>
      </section>
      <ContactCta
        eyebrow="// still curious?"
        title="Have Another Question? Let's Talk."
        highlight={["Talk."]}
        text="Send us your question or tell us a little about your project through the contact page."
        primary={{ label: "Contact Us", href: "/contact" }}
        secondary={{ label: "Explore Services", href: "/services" }}
      />
    </>
  );
}
