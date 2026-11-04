import { AboutCta } from "@/components/about/AboutCta";
import { AboutHero } from "@/components/about/AboutHero";
import { OurJourney } from "@/components/about/OurJourney";
import { OurStory } from "@/components/about/OurStory";
import { VisionMission } from "@/components/about/VisionMission";
import { OurApproach } from "@/components/about/OurApproach";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "About",
  description: "Learn about IKASLE Technologies and how we turn business ideas into dependable digital products.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <OurStory />
      <OurJourney />
      <VisionMission />
      <OurApproach />
      <AboutCta />
    </>
  );
}
