import { PageHero } from "@/components/ui/PageHero";
import { ContactExperience } from "@/components/contact/ContactExperience";
import { ContactHeadline } from "@/components/contact/ContactHeadline";
import { pageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";
import { ContactInfoCard } from "@/components/contact/ContactInfoCard";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Tell IKASLE Technologies about your software, web, mobile, ERP or AI project. We'll respond with next steps.",
  path: "/contact",
});

export default function ContactPage() {
  const { email } = siteConfig.contact;

  return (
    <>
      <PageHero
        eyebrow="Contact"
        path="/contact"
        title="Let's Turn Your Vision Into Software."
        heading={<ContactHeadline id="contact-title" />}
        description="Share a few details about what you want to build. The more context you give, the more useful our first reply will be."
      />

      <section aria-label="Contact form" className="pb-24 sm:pb-32">
        <div className="container-x">
          <ContactExperience fallbackEmail={email} aside={<ContactInfoCard />} />
        </div>
      </section>
    </>
  );
}
