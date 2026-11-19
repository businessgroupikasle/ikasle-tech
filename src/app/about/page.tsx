import { AboutCta } from "@/components/about/AboutCta";
import { AboutHero } from "@/components/about/AboutHero";
import { OurJourney } from "@/components/about/OurJourney";
import { OurStory } from "@/components/about/OurStory";
import { VisionMission } from "@/components/about/VisionMission";
import { WhatWeStandFor } from "@/components/about/WhatWeStandFor";
import { OurApproach } from "@/components/about/OurApproach";
import { PeopleBehindProgress } from "@/components/about/PeopleBehindProgress";
import { GlobalOutlook } from "@/components/about/GlobalOutlook";
import { pageMetadata } from "@/lib/metadata";
import { siteConfig, absoluteUrl } from "@/lib/site";

export const metadata = pageMetadata({
  title: "About Us | Software Engineering & Digital Products",
  description:
    "Learn about IKASLE Technologies, our engineering journey from 2020 to autonomous systems, and how we engineer dependable custom software and digital products for businesses worldwide.",
  path: "/about",
});

const aboutJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${siteConfig.url}/about#webpage`,
    url: `${siteConfig.url}/about`,
    name: "About IKASLE Technologies",
    description:
      "IKASLE Technologies is a software engineering company based in Coimbatore, India, engineering custom software, enterprise platforms and intelligent digital solutions for businesses worldwide.",
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    about: { "@id": `${siteConfig.url}/#organization` },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
        { "@type": "ListItem", position: 2, name: "About", item: absoluteUrl("/about") },
      ],
    },
  },
];

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd).replace(/</g, "\\u003c") }}
      />
      <AboutHero />
      <OurStory />
      <OurJourney />
      <VisionMission />
      <WhatWeStandFor />
      <OurApproach />
      <PeopleBehindProgress />
      <GlobalOutlook />
      <AboutCta />
    </>
  );
}
