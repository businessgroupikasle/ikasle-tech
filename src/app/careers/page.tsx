import { PageHero } from "@/components/ui/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { companyContact } from "@/data/company-contact";
import { pageMetadata } from "@/lib/metadata";
import { siteConfig, absoluteUrl } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Careers & Internships | Join the Engineering Team",
  description:
    "Explore engineering jobs and technical internships at IKASLE Technologies in Coimbatore, India. Build the future in code with us.",
  path: "/careers",
});

const careersJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteConfig.url}/careers#webpage`,
    url: `${siteConfig.url}/careers`,
    name: "Careers & Opportunities at IKASLE Technologies",
    description: "Explore career opportunities, developer roles, and internships at IKASLE Technologies.",
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    about: { "@id": `${siteConfig.url}/#organization` },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
        { "@type": "ListItem", position: 2, name: "Careers", item: absoluteUrl("/careers") },
      ],
    },
  },
];

export default function CareersPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(careersJsonLd).replace(/</g, "\\u003c") }}
      />
      <PageHero
        eyebrow="Careers"
        path="/careers"
        breadcrumbItems={[{ label: "Careers" }]}
        title="Build your future with us."
        description="Explore career and internship opportunities at IKASLE Technologies."
      />
    <section className="container-x pb-20 sm:pb-24">
      <div className="rounded-3xl border border-line bg-bg-soft p-6 sm:p-10">
        <h2 className="text-2xl font-semibold text-ink">No Current Openings</h2>
        <p className="mt-3 max-w-2xl text-ink-soft">There are currently no listed job or internship opportunities. You can still send your resume for future consideration.</p>
        <p className="mt-3 mb-6 text-ink-soft">Include your preferred role or internship, a short introduction, and your resume as an attachment in your email.</p>
        <ButtonLink href={`mailto:${companyContact.email}?subject=Career%20or%20Internship%20Application`} arrow>Submit your resume</ButtonLink>
      </div>
    </section>
    </>
  );
}
