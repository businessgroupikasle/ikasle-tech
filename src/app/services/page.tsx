import { ServicesHero } from "@/components/services/ServicesHero";
import { ServicesOverview } from "@/components/services/ServicesOverview";
import { servicePages } from "@/data/service-pages";
import { pageMetadata } from "@/lib/metadata";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Services",
  description:
    "Custom software, web applications, mobile apps, ERP & business automation, AI & intelligent solutions and UI/UX product design from IKASLE Technologies.",
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

export default function ServicesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd).replace(/</g, "\\u003c") }} />
      <ServicesHero />
      {/* Six cards only: each opens its own page at /services/[slug] (details live there, not here). */}
      <ServicesOverview />
    </>
  );
}
