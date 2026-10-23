import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/data/services";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCards } from "./ServiceCards";
import { Reveal } from "@/components/animations/Reveal";

export function ServicesPreview() {
  return (
    // Stacking layer 3 (top): covers Development Philosophy, then scrolls on normally at its natural height.
    <section data-stack-layer="3" aria-labelledby="services-title" className="stack-sheet relative z-30 bg-white py-20 sm:py-24">
      <div className="container-x">
        <Reveal className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            id="services-title"
            title="Engineering Digital Experiences That Matter."
            description="Six disciplines, one engineering team. We take products from first sketch to production — and keep them running."
          />
          <Link href="/services" className="group inline-flex shrink-0 items-center gap-1.5 font-medium text-accent-strong">
            All services
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </Link>
        </Reveal>

        <ServiceCards services={services} />
      </div>
    </section>
  );
}
