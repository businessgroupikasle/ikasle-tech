import { Suspense } from "react";
import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { TechStack } from "@/components/home/TechStack";
import { DevelopmentPhilosophy } from "@/components/home/DevelopmentPhilosophy";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { WorksSection } from "@/components/home/WorksSection";
import { ClientsSection } from "@/components/home/ClientsSection";
import { ProcessTimeline } from "@/components/home/ProcessTimeline";
import { ArchitectureSection } from "@/components/home/ArchitectureSection";
import { DevExperience } from "@/components/home/DevExperience";
import { ContactCta } from "@/components/home/ContactCta";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `${siteConfig.name} — ${siteConfig.tagline}` },
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  // Each section below the hero is its own Suspense boundary, so React hydrates them as separate,
  // interruptible units (yielding to input and paint between them) instead of one long task. The server
  // HTML stays visible throughout; nothing here suspends or shows a fallback.
  return (
    <>
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
        <DevExperience />
      </Suspense>
      <Suspense>
        <ContactCta />
      </Suspense>
    </>
  );
}
