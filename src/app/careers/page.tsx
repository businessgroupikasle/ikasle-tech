import { CareersHero } from "@/components/careers/CareersHero";
import { CultureGallery } from "@/components/careers/CultureGallery";
import { HiringTimeline } from "@/components/careers/HiringTimeline";
import { JobBoard } from "@/components/careers/JobBoard";
import { WhyJoin } from "@/components/careers/WhyJoin";
import { ContactCta } from "@/components/home/ContactCta";
import { pageMetadata } from "@/lib/metadata";
import { siteConfig, absoluteUrl } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Careers & Opportunities | Join IKASLÉ Technologies",
  description:
    "Join IKASLÉ Technologies in Coimbatore. Explore engineering jobs, developer roles, designers, and internships. Build impactful digital products with us.",
  path: "/careers",
  absoluteTitle: true,
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
      <CareersHero />
      <WhyJoin />
      <JobBoard />

      <section aria-labelledby="process-title" className="border-t border-line py-20 sm:py-24">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-[12px] tracking-wide text-accent-strong uppercase">How we hire</p>
            <h2 id="process-title" className="mt-3 text-[2rem] leading-[1.1] font-semibold tracking-[-0.035em] text-balance text-ink sm:text-[2.6rem]">
              Our Hiring Process
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-ink-soft">Five clear steps, so you always know where your application stands.</p>
          </div>
          <HiringTimeline className="mt-14" />
        </div>
      </section>

      <CultureGallery />

      <ContactCta
        eyebrow="// we're hiring"
        title="Your Next Opportunity Starts Here."
        highlight={["Starts", "Here."]}
        text="Have the skills and passion to make a difference? We would love to hear from you."
        primary={{ label: "Explore Opportunities", href: "#openings" }}
        secondary={{ label: "Submit Your Resume", href: "/careers/apply" }}
      />
    </>
  );
}
