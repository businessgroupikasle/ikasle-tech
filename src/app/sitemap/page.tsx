import Link from "next/link";
import { ArrowUpRight, FileCode, Layers, Shield, Sparkles, Building2 } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { pageMetadata } from "@/lib/metadata";
import { siteConfig, absoluteUrl } from "@/lib/site";
import { servicePages } from "@/data/service-pages";

export const metadata = pageMetadata({
  title: "Website Sitemap | Navigation & Structure",
  description:
    "Explore the complete website sitemap for IKASLÉ Technologies. Browse all software engineering services, portfolio, company information and technical resources.",
  path: "/sitemap",
  absoluteTitle: true,
});

const sitemapJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteConfig.url}/sitemap#webpage`,
    url: `${siteConfig.url}/sitemap`,
    name: "Website Sitemap | IKASLÉ Technologies",
    description: "Complete navigation index of all pages, engineering services and technical resources.",
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
        { "@type": "ListItem", position: 2, name: "Sitemap", item: absoluteUrl("/sitemap") },
      ],
    },
  },
];

const mainPages = [
  { label: "Home", href: "/", description: "Software development company delivering custom applications, SaaS & AI solutions." },
  { label: "About Us", href: "/about", description: "Our story, journey, engineering philosophy and core team values." },
  { label: "Services", href: "/services", description: "Comprehensive software engineering, application development and AI solutions." },
  { label: "Industries", href: "/industries", description: "Technology solutions engineered around specific industry workflows and operations." },
  { label: "Our Clientele", href: "/clientele", description: "Trusted partner to businesses across India, UK, UAE and worldwide." },
  { label: "Careers", href: "/careers", description: "Join our engineering team in building impactful digital products." },
  { label: "Contact Us", href: "/contact", description: "Start a project, request a consultation or get in touch with our engineers." },
];

const insightPages = [
  { label: "Blog & Insights", href: "/blog", description: "Technical articles, software engineering insights and industry trends." },
  { label: "Frequently Asked Questions", href: "/faq", description: "Answers to common questions regarding process, tech stack and engagement." },
];

const legalPages = [
  { label: "Privacy Policy", href: "/privacy-policy", description: "How we collect, protect and handle client data and privacy." },
  { label: "Terms & Conditions", href: "/terms-and-conditions", description: "Official terms and service standards of IKASLÉ Technologies." },
];

const technicalFeeds = [
  { label: "XML Sitemap", href: "/sitemap.xml", description: "Standard XML index for Google Search Console and web crawlers." },
  { label: "Image Sitemap", href: "/sitemap-images.xml", description: "Dedicated media feed indexing official brand and client imagery." },
  { label: "LLMs Text Feed", href: "/llms.txt", description: "Structured AI-ready markdown context for generative engines." },
];

export default function SitemapPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(sitemapJsonLd).replace(/</g, "\\u003c") }}
      />
      <PageHero
        eyebrow="Structure & Index"
        path="/sitemap"
        breadcrumbItems={[{ label: "Sitemap" }]}
        title="Website Sitemap."
        highlight={["Sitemap."]}
        description="A structured overview and directory of all public pages, software development services, company insights and search engine feeds across IKASLÉ Technologies."
      />

      <section className="relative overflow-hidden bg-white pt-2 pb-24">
        <div className="container-x">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Core Pages */}
            <div className="rounded-3xl border border-line bg-bg-soft/60 p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent-strong">
                  <Building2 className="size-5" />
                </span>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-ink">Company &amp; Core Pages</h2>
                  <p className="font-mono text-xs text-ink-soft">Core website navigation</p>
                </div>
              </div>

              <ul className="mt-6 divide-y divide-line/70">
                {mainPages.map((item) => (
                  <li key={item.href} className="py-3.5 first:pt-0 last:pb-0">
                    <Link
                      href={item.href}
                      className="group flex items-start justify-between gap-4 transition-colors hover:text-accent-strong"
                    >
                      <div>
                        <span className="text-[15px] font-semibold text-ink group-hover:text-accent-strong">
                          {item.label}
                        </span>
                        <p className="mt-0.5 text-xs text-ink-soft leading-relaxed">{item.description}</p>
                      </div>
                      <ArrowUpRight className="mt-1 size-4 shrink-0 text-ink-soft/60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-strong" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Software Engineering Services */}
            <div className="rounded-3xl border border-line bg-bg-soft/60 p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent-strong">
                  <Layers className="size-5" />
                </span>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-ink">Engineering Services</h2>
                  <p className="font-mono text-xs text-accent-strong">
                    <Link href="/services" className="underline hover:text-accent">
                      /services
                    </Link>{" "}
                    overview &amp; solutions
                  </p>
                </div>
              </div>

              <ul className="mt-6 divide-y divide-line/70">
                {servicePages.map((s) => (
                  <li key={s.slug} className="py-3.5 first:pt-0 last:pb-0">
                    <Link
                      href={`/services/${s.slug}`}
                      className="group flex items-start justify-between gap-4 transition-colors hover:text-accent-strong"
                    >
                      <div>
                        <span className="text-[15px] font-semibold text-ink group-hover:text-accent-strong">
                          {s.name}
                        </span>
                        <p className="mt-0.5 text-xs text-ink-soft leading-relaxed">{s.intro}</p>
                      </div>
                      <ArrowUpRight className="mt-1 size-4 shrink-0 text-ink-soft/60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-strong" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Insights & Resources */}
            <div className="rounded-3xl border border-line bg-bg-soft/60 p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent-strong">
                  <Sparkles className="size-5" />
                </span>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-ink">Insights &amp; Support</h2>
                  <p className="font-mono text-xs text-ink-soft">Articles and help documentation</p>
                </div>
              </div>

              <ul className="mt-6 divide-y divide-line/70">
                {insightPages.map((item) => (
                  <li key={item.href} className="py-3.5 first:pt-0 last:pb-0">
                    <Link
                      href={item.href}
                      className="group flex items-start justify-between gap-4 transition-colors hover:text-accent-strong"
                    >
                      <div>
                        <span className="text-[15px] font-semibold text-ink group-hover:text-accent-strong">
                          {item.label}
                        </span>
                        <p className="mt-0.5 text-xs text-ink-soft leading-relaxed">{item.description}</p>
                      </div>
                      <ArrowUpRight className="mt-1 size-4 shrink-0 text-ink-soft/60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-strong" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal & Technical Feeds */}
            <div className="flex flex-col gap-8">
              {/* Legal Policies */}
              <div className="rounded-3xl border border-line bg-bg-soft/60 p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent-strong">
                    <Shield className="size-5" />
                  </span>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-ink">Legal &amp; Compliance</h2>
                    <p className="font-mono text-xs text-ink-soft">Policies &amp; terms</p>
                  </div>
                </div>

                <ul className="mt-6 divide-y divide-line/70">
                  {legalPages.map((item) => (
                    <li key={item.href} className="py-3.5 first:pt-0 last:pb-0">
                      <Link
                        href={item.href}
                        className="group flex items-start justify-between gap-4 transition-colors hover:text-accent-strong"
                      >
                        <div>
                          <span className="text-[15px] font-semibold text-ink group-hover:text-accent-strong">
                            {item.label}
                          </span>
                          <p className="mt-0.5 text-xs text-ink-soft leading-relaxed">{item.description}</p>
                        </div>
                        <ArrowUpRight className="mt-1 size-4 shrink-0 text-ink-soft/60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-strong" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Crawler & Engine Feeds */}
              <div className="rounded-3xl border border-line bg-bg-soft/60 p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent-strong">
                    <FileCode className="size-5" />
                  </span>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-ink">Search Engine Feeds</h2>
                    <p className="font-mono text-xs text-ink-soft">Machine-readable XML &amp; AI feeds</p>
                  </div>
                </div>

                <ul className="mt-6 divide-y divide-line/70">
                  {technicalFeeds.map((item) => (
                    <li key={item.href} className="py-3.5 first:pt-0 last:pb-0">
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-start justify-between gap-4 transition-colors hover:text-accent-strong"
                      >
                        <div>
                          <span className="text-[15px] font-semibold text-ink group-hover:text-accent-strong">
                            {item.label}
                          </span>
                          <p className="mt-0.5 text-xs text-ink-soft leading-relaxed">{item.description}</p>
                        </div>
                        <ArrowUpRight className="mt-1 size-4 shrink-0 text-ink-soft/60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-strong" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

