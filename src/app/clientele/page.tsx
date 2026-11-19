import { ClientsSection } from "@/components/home/ClientsSection";
import { ContactCta } from "@/components/home/ContactCta";
import { PageHero } from "@/components/ui/PageHero";
import { pageMetadata } from "@/lib/metadata";
import { siteConfig, absoluteUrl } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Clientele & Portfolio | Trusted by Leading Businesses",
  description:
    "Discover the businesses and enterprise brands across India, the UK, UAE and worldwide that partner with IKASLE Technologies for custom software and digital products.",
  path: "/clientele",
});

const clienteleJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteConfig.url}/clientele#webpage`,
    url: `${siteConfig.url}/clientele`,
    name: "Clientele & Partnerships | IKASLE Technologies",
    description: "Businesses and organisations that trust IKASLE Technologies for software and digital engineering.",
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    about: { "@id": `${siteConfig.url}/#organization` },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
        { "@type": "ListItem", position: 2, name: "Clientele", item: absoluteUrl("/clientele") },
      ],
    },
  },
];

export default function ClientelePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(clienteleJsonLd).replace(/</g, "\\u003c") }}
      />
      <PageHero
        eyebrow="Our Clientele"
        path="/clientele"
        breadcrumbItems={[{ label: "Clientele" }]}
        title="Partnerships Driven By Purpose And Performance."
        highlight={["Purpose", "And", "Performance."]}
        description="We collaborate with forward-thinking businesses to solve complex challenges, unlock new opportunities and build digital solutions that create lasting impact."
      />
      <ClientsSection />
      <ContactCta />
    </>
  );
}
