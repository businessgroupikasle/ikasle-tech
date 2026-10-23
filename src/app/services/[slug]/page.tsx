import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetail } from "@/components/services/ServiceDetail";
import { ContactCta } from "@/components/home/ContactCta";
import { getServiceDetail, servicePages } from "@/data/service-pages";
import { pageMetadata } from "@/lib/metadata";
import { absoluteUrl, siteConfig } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

// Only the six services exist; any other slug is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return servicePages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const detail = getServiceDetail(slug);
  if (!detail) return {};
  const { page, service } = detail;
  return pageMetadata({
    title: page.name,
    description: page.intro,
    path: `/services/${page.slug}`,
    image: { src: service.image.src, alt: service.image.alt, width: service.image.width, height: service.image.height },
  });
}

export default async function ServicePage({ params }: Params) {
  const { slug } = await params;
  const detail = getServiceDetail(slug);
  if (!detail) notFound();
  const { page, service } = detail;

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
      name: page.name,
      description: page.intro,
      url,
      provider: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <ServiceDetail slug={page.slug} />
      <ContactCta
        eyebrow="// let's talk"
        title="Have a Challenge? Let's Build the Solution."
        highlight={["Solution."]}
        text="Tell us what you want to achieve. We'll help you explore the right technology approach for your business."
        primary={{ label: "Start a Project", href: `/contact?type=${encodeURIComponent(service.projectType)}` }}
        secondary={{ label: "All Services", href: "/services" }}
      />
    </>
  );
}
