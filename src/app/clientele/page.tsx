import { ClientsSection } from "@/components/home/ClientsSection";
import { ContactCta } from "@/components/home/ContactCta";
import { PageHero } from "@/components/ui/PageHero";
import { pageMetadata } from "@/lib/metadata";
import { siteConfig, absoluteUrl } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Client Portfolio & Our Clients | IKASLÉ Technologies",
  description:
    "Explore IKASLÉ Technologies' client portfolio. Discover businesses across industries that partner with us for software development, digital solutions and technology services.",
  path: "/clientele",
  absoluteTitle: true,
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
