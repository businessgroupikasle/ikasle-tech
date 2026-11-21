import { IndustriesSection } from "@/components/home/IndustriesSection";
import { ContactCta } from "@/components/home/ContactCta";
import { PageHero } from "@/components/ui/PageHero";
import { pageMetadata } from "@/lib/metadata";
import { siteConfig, absoluteUrl } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Industries We Serve | Enterprise Software Engineering",
  description:
    "Explore the industries IKASLÉ Technologies builds software for: Manufacturing, Retail & E-commerce, Healthcare, Logistics, Professional Services, and Startups.",
  path: "/industries",
  absoluteTitle: true,
});

const industriesJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteConfig.url}/industries#webpage`,
    url: `${siteConfig.url}/industries`,
    name: "Industries We Serve | IKASLE Technologies",
    description: "Technology and digital solutions built around the workflows and goals of key industries.",
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    about: { "@id": `${siteConfig.url}/#organization` },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
        { "@type": "ListItem", position: 2, name: "Industries", item: absoluteUrl("/industries") },
      ],
    },
  },
];

export default function IndustriesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(industriesJsonLd).replace(/</g, "\\u003c") }}
      />
      <PageHero
        eyebrow="Industries"
        path="/industries"
        breadcrumbItems={[{ label: "Industries" }]}
        title="Technology Built Around Your Industry."
        highlight={["Industry."]}
        description="Every industry operates differently. We engineer digital solutions around the workflows, operational requirements and business goals that matter to your organization."
      />
      <IndustriesSection />
      <ContactCta />
    </>
  );
}

