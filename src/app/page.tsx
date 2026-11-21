import { Suspense } from "react";
import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { StackingSections } from "@/components/home/StackingSections";
import { TechStack } from "@/components/home/TechStack";
import { DevelopmentPhilosophy } from "@/components/home/DevelopmentPhilosophy";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { IndustriesSection } from "@/components/home/IndustriesSection";
import { ProcessTimeline } from "@/components/home/ProcessTimeline";
import { ArchitectureSection } from "@/components/home/ArchitectureSection";
import { WhyUsSection } from "@/components/home/WhyUsSection";
import { GlobalPortfolioSection } from "@/components/home/GlobalPortfolioSection";
import { HomeFaqSection, HOME_FAQS } from "@/components/home/HomeFaqSection";
import { ContactCta } from "@/components/home/ContactCta";
import { siteConfig } from "@/lib/site";

const title = "Software Development Company in India | IKASLÉ Technologies";
const description =
  "IKASLÉ Technologies is a global software engineering partner in India, delivering custom software, SaaS platforms, enterprise applications, web and mobile development, and AI-powered solutions.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
  // Page-level openGraph/twitter replace the layout's objects, so the shared fields are repeated here.
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title,
    description,
    url: "/",
    locale: "en_US",
    images: [
      {
        url: `${siteConfig.url}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [`${siteConfig.url}/opengraph-image`],
  },
};

const homeJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteConfig.url}/#webpage`,
    url: siteConfig.url,
    name: title,
    description,
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    about: { "@id": `${siteConfig.url}/#organization` },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url }],
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOME_FAQS.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  },
];

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd).replace(/</g, "\\u003c") }}
      />
      {/* Book-style stacking: each section slides up over the one before (Hero → Stack → Philosophy → Services). */}
      <StackingSections>
        <Hero />
        <Suspense>
          <TechStack />
        </Suspense>
        <Suspense>
          <DevelopmentPhilosophy />
        </Suspense>
        <Suspense>
          <ServicesPreview />
        </Suspense>
      </StackingSections>
      <Suspense>
        <IndustriesSection />
      </Suspense>
      <Suspense>
        <ProcessTimeline />
      </Suspense>
      <Suspense>
        <ArchitectureSection />
      </Suspense>
      <Suspense>
        <WhyUsSection />
      </Suspense>
      <Suspense>
        <GlobalPortfolioSection />
      </Suspense>
      <Suspense>
        <HomeFaqSection />
      </Suspense>
      <Suspense>
        <ContactCta />
      </Suspense>
    </>
  );
}
