import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/data/services";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { ServiceCards } from "./ServiceCards";
import { Reveal } from "@/components/animations/Reveal";

const HOME_SERVICE_OVERRIDES: Record<string, { title: string; summary: string }> = {
  "custom-software-development": {
    title: "Custom Software Development",
    summary:
      "Tailored software, business applications and enterprise systems engineered around your unique workflows. Built for reliability, integration and growth.",
  },
  "website-development": {
    title: "Website Development",
    summary:
      "High-performance, responsive and SEO-friendly websites that strengthen your digital presence, engage customers and drive business growth.",
  },
  "web-application-development": {
    title: "Web Application Development",
    summary:
      "Scalable SaaS platforms, business portals and intelligent web applications built with modern technologies and robust architecture.",
  },
  "mobile-app-development": {
    title: "Mobile App Development",
    summary:
      "Intuitive Android and iOS applications with seamless integrations, powerful functionality and exceptional user experiences.",
  },
  "erp-business-automation": {
    title: "ERP Solutions",
    summary:
      "Connected business systems for inventory, sales, purchasing, manufacturing and reporting. Simplify operations with intelligent ERP solutions.",
  },
  "ai-intelligent-solutions": {
    title: "AI & Automation",
    summary:
      "AI-powered solutions and intelligent workflows that eliminate repetitive tasks, connect business systems and improve operational efficiency.",
  },
  "ui-ux-product-design": {
    title: "UI/UX & Product Design",
    summary:
      "User-focused interfaces, interactive prototypes and digital product experiences that transform complex ideas into intuitive solutions.",
  },
};

export function ServicesPreview() {
  const homeServices = services.map((s) => ({
    ...s,
    title: HOME_SERVICE_OVERRIDES[s.slug]?.title ?? s.title,
    summary: HOME_SERVICE_OVERRIDES[s.slug]?.summary ?? s.summary,
  }));

  return (
    // Stacking layer 3 (top): covers Development Philosophy, then scrolls on normally at its natural height.
    <section data-stack-layer="3" aria-labelledby="services-title" className="stack-sheet relative z-30 bg-white py-20 sm:py-24">
      <div className="container-x">
        <Reveal className="flex flex-col items-center gap-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <Eyebrow>WHAT WE ENGINEER</Eyebrow>

            <h2
              id="services-title"
              className="text-balance text-2xl font-semibold tracking-[-0.035em] text-ink sm:text-4xl lg:text-[2.75rem] leading-[1.15] max-w-4xl"
            >
              Custom Software Development &amp; Digital Solutions for Growing Businesses.
            </h2>

            <p className="mt-2 max-w-3xl text-justify text-base leading-relaxed text-pretty text-ink-soft sm:text-[17px]">
              IKASLÉ builds software and digital products for startups, SMEs and enterprises. Modern technologies, product design and scalable architecture for business growth. Custom applications, enterprise platforms, SaaS and intelligent automation.
            </p>

            <p className="mt-2 font-mono text-xs tracking-wider text-accent-strong uppercase sm:text-[13px]">
              <span className="size-1.5 inline-block rounded-full bg-accent mr-2 align-middle" aria-hidden="true" />
              Seven Engineering Disciplines. One Technology Partner.
            </p>
          </div>

          <Link href="/services" className="group inline-flex shrink-0 items-center gap-1.5 font-medium text-accent-strong self-center">
            All services
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </Link>
        </Reveal>

        <ServiceCards services={homeServices} />
      </div>
    </section>
  );
}
