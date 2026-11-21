import { LegalPage } from "@/components/legal/LegalPage";
import { privacyPolicy } from "@/content/legal/privacy";
import { pageMetadata } from "@/lib/metadata";
import { siteConfig, absoluteUrl } from "@/lib/site";

export const metadata = pageMetadata({
  title: "IKASLÉ Technologies Privacy Policy | Data Protection & Privacy",
  description:
    "Learn how IKASLÉ Technologies collects, uses, protects and manages personal information submitted through our website, contact forms and digital services.",
  path: "/privacy-policy",
  noindex: privacyPolicy.status === "draft",
});

const privacyJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Privacy Policy", item: absoluteUrl("/privacy-policy") },
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(privacyJsonLd).replace(/</g, "\\u003c") }}
      />
      <LegalPage doc={privacyPolicy} />
    </>
  );
}
