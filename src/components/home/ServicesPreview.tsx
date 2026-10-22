import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/data/services";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCards } from "./ServiceCards";

export function ServicesPreview() {
  return (
    <section aria-labelledby="services-title" className="relative py-24 sm:py-32">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            id="services-title"
            eyebrow="What we do"
            path="/services"
            title="Engineering Digital Experiences That Matter."
            description="Six disciplines, one engineering team. We take products from first sketch to production — and keep them running."
          />
          <Link href="/services" className="group inline-flex shrink-0 items-center gap-1.5 font-medium text-accent-strong">
            All services
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </Link>
        </div>

        <ServiceCards services={services} />
      </div>
    </section>
  );
}
