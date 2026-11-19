import { LegalPage } from "@/components/legal/LegalPage";
import { termsAndConditions } from "@/content/legal/terms";
import { pageMetadata } from "@/lib/metadata";
import { siteConfig, absoluteUrl } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Terms & Conditions | IKASLE Technologies",
  description: "Terms and conditions governing the use of IKASLE Technologies website, services, and digital offerings.",
  path: "/terms-and-conditions",
  // Draft: kept out of search results until approved.
  noindex: termsAndConditions.status === "draft",
});

const termsJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Terms & Conditions", item: absoluteUrl("/terms-and-conditions") },
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(termsJsonLd).replace(/</g, "\\u003c") }}
      />
      <LegalPage doc={termsAndConditions} />
    </>
  );
}
