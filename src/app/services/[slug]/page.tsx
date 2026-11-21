import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetail } from "@/components/services/ServiceDetail";
import { ContactCta } from "@/components/home/ContactCta";
import { ServiceFaq } from "@/components/services/ServiceFaq";
import { getServiceDetail, servicePages } from "@/data/service-pages";
import { SERVICE_SLUGS } from "@/data/service-slugs";
import { pageMetadata } from "@/lib/metadata";
import { absoluteUrl, siteConfig } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

const SERVICE_SEO: Record<string, { title: string; description: string }> = {
  [SERVICE_SLUGS.customSoftware]: {
    title: "Custom Software Development Company | IKASLÉ Technologies",
    description:
      "Discover custom software development by IKASLÉ Technologies. We build business applications, enterprise software and tailored digital solutions for businesses worldwide.",
  },
  [SERVICE_SLUGS.websiteDevelopment]: {
    title: "Website Development Company | IKASLÉ Technologies",
    description:
      "Professional website development for businesses worldwide. Explore modern, responsive and SEO-friendly website solutions by IKASLÉ Technologies.",
  },
  [SERVICE_SLUGS.webApplications]: {
    title: "Web Application Development Company | IKASLÉ Technologies",
    description:
      "Build SaaS platforms, business applications, customer portals and dashboards with web application development services from IKASLÉ Technologies.",
  },
  [SERVICE_SLUGS.mobileApps]: {
    title: "Mobile App Development Company | IKASLÉ Technologies",
    description:
      "Develop Android, iOS and cross-platform mobile applications with IKASLÉ Technologies. Transform your business ideas into digital products.",
  },
  [SERVICE_SLUGS.erp]: {
    title: "ERP Software Development Company | IKASLÉ Technologies",
    description:
      "Explore ERP solutions for inventory, sales, purchasing, manufacturing and business operations with IKASLÉ Technologies.",
  },
  [SERVICE_SLUGS.ai]: {
    title: "AI & Business Automation Services | IKASLÉ Technologies",
    description:
      "Discover AI integrations, intelligent workflows and business automation solutions designed to simplify operations and improve productivity.",
  },
  [SERVICE_SLUGS.productDesign]: {
    title: "UI/UX & Product Design Services | IKASLÉ Technologies",
    description:
      "Explore user research, UI/UX design, interactive prototyping and product design services for websites, applications and digital products.",
  },
};

// Only the seven services exist; any other slug is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return servicePages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const detail = getServiceDetail(slug);
  if (!detail) return {};
  const { page, service } = detail;
  const seo = SERVICE_SEO[slug];
  return pageMetadata({
    title: seo?.title ?? page.name,
    description: seo?.description ?? page.intro,
    path: `/services/${page.slug}`,
    absoluteTitle: true,
    image: { src: service.image.src, alt: service.image.alt, width: service.image.width, height: service.image.height },
  });
}

export default async function ServicePage({ params }: Params) {
  const { slug } = await params;
  const detail = getServiceDetail(slug);
  if (!detail) notFound();
  const { page, service } = detail;
  const seo = SERVICE_SEO[page.slug];

  const cta = page.ctaSection;
  const url = absoluteUrl(`/services/${page.slug}`);
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Services", item: absoluteUrl("/services") },
        { "@type": "ListItem", position: 3, name: page.name, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: seo?.title ?? page.name,
      description: seo?.description ?? page.intro,
      url,
      provider: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    },
    ...(page.faq
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: page.faq.items.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
          },
        ]
      : []),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <ServiceDetail slug={page.slug} />
      <ContactCta
        eyebrow={cta?.eyebrow ?? "// let's talk"}
        title={cta?.title ?? "Have a Challenge? Let's Build the Solution."}
        highlight={cta?.highlight ?? ["Solution."]}
        text={cta?.text ?? "Tell us what you want to achieve. We'll help you explore the right technology approach for your business."}
        primary={page.cta ?? { label: cta?.primaryLabel ?? "Start a Project", href: `/contact?type=${encodeURIComponent(service.projectType)}` }}
        secondary={cta?.secondary ?? { label: "All Services", href: "/services" }}
      />
      {page.faq && <ServiceFaq idPrefix={page.slug} faq={page.faq} />}
    </>
  );
}
