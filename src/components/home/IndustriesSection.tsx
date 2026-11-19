import { Factory, ShoppingBag, HeartPulse, Truck, Briefcase, Rocket } from "lucide-react";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/animations/Reveal";

const INDUSTRIES = [
  {
    number: "01",
    title: "Manufacturing & Industrial",
    description: "Digital systems for production workflows, inventory management, operational processes and business visibility.",
    icon: Factory,
  },
  {
    number: "02",
    title: "Retail & E-commerce",
    description: "Connected digital commerce experiences, product management systems and streamlined order operations.",
    icon: ShoppingBag,
  },
  {
    number: "03",
    title: "Healthcare & Wellness",
    description: "Digital platforms and business applications designed to support service delivery, operational workflows and customer engagement.",
    icon: HeartPulse,
  },
  {
    number: "04",
    title: "Logistics & Supply Chain",
    description: "Technology for coordinating operations, managing workflows, tracking information and improving process visibility.",
    icon: Truck,
  },
  {
    number: "05",
    title: "Professional Services",
    description: "Custom applications and business automation that simplify internal processes, service delivery and client management.",
    icon: Briefcase,
  },
  {
    number: "06",
    title: "Startups & SaaS Businesses",
    description: "Digital product engineering, MVP development and scalable SaaS platforms designed to support product evolution.",
    icon: Rocket,
  },
];

export function IndustriesSection() {
  return (
    <section aria-labelledby="industries-title" className="relative border-t border-line/60 bg-bg-soft py-20 sm:py-24">
      <div className="container-x">
        <Reveal className="flex flex-col items-center text-center">
          <Eyebrow>ENGINEERING FOR REAL-WORLD BUSINESS CHALLENGES</Eyebrow>

          <h2
            id="industries-title"
            className="mt-4 text-balance text-2xl font-semibold tracking-[-0.035em] text-ink sm:text-4xl lg:text-[2.75rem] leading-[1.15] max-w-3xl"
          >
            Technology Built Around Your Industry.
          </h2>

          <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-ink-soft sm:text-[17px]">
            Every industry operates differently. We engineer digital solutions around the workflows, operational requirements and business goals that matter to your organization.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map(({ number, title, description, icon: Icon }) => (
            <Reveal key={title}>
              <div className="group relative flex h-full flex-col justify-between rounded-2xl border border-line bg-white p-6 shadow-sm transition-all duration-300 hover:border-accent/40 hover:-translate-y-1 hover:shadow-soft">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-accent/10 to-accent-2/15 text-accent transition-transform duration-300 group-hover:scale-105">
                      <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <span className="font-mono text-xs font-semibold text-accent-strong">{number}</span>
                  </div>

                  <h3 className="mt-4 text-lg font-semibold tracking-tight text-ink sm:text-xl">{title}</h3>
                  <p className="mt-2.5 text-justify text-sm leading-relaxed text-ink-soft sm:text-[15px]">{description}</p>
                </div>

                <div className="mt-6 flex items-center gap-1.5 font-mono text-[11px] text-ink-soft/70">
                  <span className="size-1 rounded-full bg-accent/60" aria-hidden="true" />
                  <span>Engineered for outcomes</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

