import { Suspense } from "react";
import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { StackingSections } from "@/components/home/StackingSections";
import { TechStack } from "@/components/home/TechStack";
import { DevelopmentPhilosophy } from "@/components/home/DevelopmentPhilosophy";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { WorksSection } from "@/components/home/WorksSection";
import { ClientsSection } from "@/components/home/ClientsSection";
import { ProcessTimeline } from "@/components/home/ProcessTimeline";
import { ArchitectureSection } from "@/components/home/ArchitectureSection";
import { ContactCta } from "@/components/home/ContactCta";
import { siteConfig } from "@/lib/site";

const title = `Software Development Company in Coimbatore | ${siteConfig.name}`;
const description =
  "IKASLE Technologies is a software development company in Coimbatore, building custom software, web and mobile apps, ERP platforms and intelligent automation.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
  // Page-level openGraph/twitter replace the layout's objects, so the shared fields are repeated here.
  openGraph: { type: "website", siteName: siteConfig.name, title, description, url: "/", locale: "en_US" },
  twitter: { card: "summary_large_image", title, description },
};

export default function HomePage() {
  // Each section below the hero is its own Suspense boundary, so React hydrates them as separate,
  // interruptible units (yielding to input and paint between them) instead of one long task. The server
  // HTML stays visible throughout; nothing here suspends or shows a fallback.
  return (
    <>
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
        <WorksSection />
      </Suspense>
      <Suspense>
        <ClientsSection />
      </Suspense>
      <Suspense>
        <ProcessTimeline />
      </Suspense>
      <Suspense>
        <ArchitectureSection />
      </Suspense>
      <Suspense>
        <ContactCta />
      </Suspense>
    </>
  );
}
