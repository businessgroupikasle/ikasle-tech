import { PageHero } from "@/components/ui/PageHero";
import { ContactExperience } from "@/components/contact/ContactExperience";
import { ContactHeadline } from "@/components/contact/ContactHeadline";
import { pageMetadata } from "@/lib/metadata";
import { siteConfig, absoluteUrl } from "@/lib/site";
import { ContactInfoCard } from "@/components/contact/ContactInfoCard";

export const metadata = pageMetadata({
  title: "Contact IKASLÉ Technologies | Start Your Software Project",
  description:
    "Contact IKASLÉ Technologies to discuss custom software, website development, mobile apps, ERP solutions and AI automation. Let's build your next digital solution.",
  path: "/contact",
  absoluteTitle: true,
});

const contactJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${siteConfig.url}/contact#webpage`,
    url: `${siteConfig.url}/contact`,
    name: "Contact IKASLE Technologies",
    description: "Discuss your custom software, web, mobile, ERP or AI project with the IKASLE Technologies team.",
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    about: { "@id": `${siteConfig.url}/#organization` },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
        { "@type": "ListItem", position: 2, name: "Contact", item: absoluteUrl("/contact") },
      ],
    },
  },
];

export default function ContactPage() {
  const { email } = siteConfig.contact;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd).replace(/</g, "\\u003c") }}
      />
      <PageHero
        eyebrow="Contact"
        path="/contact"
        breadcrumbItems={[{ label: "Contact" }]}
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
