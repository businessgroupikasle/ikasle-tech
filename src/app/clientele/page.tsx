import { ClientsSection } from "@/components/home/ClientsSection";
import { ContactCta } from "@/components/home/ContactCta";
import { PageHero } from "@/components/ui/PageHero";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ title: "Clientele", description: "Discover the organisations and industries IKASLE Technologies serves.", path: "/clientele" });

export default function ClientelePage() {
  return (
    <>
      <PageHero eyebrow="Our Clientele" path="/clientele" title="Partnerships built on trust and outcomes." description="We work with ambitious teams across industries to turn operational challenges and new ideas into useful, lasting digital products." />
      <ClientsSection />
      <ContactCta />
    </>
  );
}
