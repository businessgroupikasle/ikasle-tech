import { ContactCta } from "@/components/home/ContactCta";
import { ServicesHero } from "@/components/services/ServicesHero";
import { ServicesOverview } from "@/components/services/ServicesOverview";
import { faqAnswerText, ServiceFaq } from "@/components/services/ServiceFaq";
import { servicePages } from "@/data/service-pages";
import { servicesFaq } from "@/data/services-faq";
import { pageMetadata } from "@/lib/metadata";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Services",
  description:
    "Custom software, business websites, web applications, mobile apps, ERP automation, AI solutions and UI/UX product design from IKASLE Technologies.",
  path: "/services",
});

const servicesJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: servicePages.map((s, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Service",
      name: s.name,
      description: s.intro,
      url: absoluteUrl(`/services/${s.slug}`),
      provider: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    },
  })),
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: servicesFaq.items.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: faqAnswerText(f.answer) } })),
};

export default function ServicesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }} />
      <ServicesHero />
      {/* Seven cards only: each opens its own page at /services/[slug] (details live there, not here). */}
      <ServicesOverview />
      <ContactCta
        eyebrow="// have more questions?"
        title="Every Business Has Different Technology Requirements. Let's Understand Yours."
        highlight={["Understand", "Yours."]}
        text=""
        primary={{ label: "Discuss Your Project", href: "/contact" }}
      />
      {/* After the CTA, as on the service pages: the CTA's padding spaces it, so the FAQ only pads the bottom. */}
      <ServiceFaq idPrefix="services" faq={servicesFaq} />
    </>
  );
}
