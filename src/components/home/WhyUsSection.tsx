import { Target, Cpu, Scaling, Users, CheckCircle2, HeartHandshake } from "lucide-react";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/animations/Reveal";

const REASONS = [
  {
    number: "01",
    title: "Business-First Thinking",
    description: "We begin by understanding your business objectives and translating them into practical technology solutions.",
    icon: Target,
  },
  {
    number: "02",
    title: "End-to-End Engineering",
    description: "From discovery and product design to development, deployment and ongoing support, we cover the complete product lifecycle.",
    icon: Cpu,
  },
  {
    number: "03",
    title: "Scalable Architecture",
    description: "We build with maintainability, performance and future expansion in mind.",
    icon: Scaling,
  },
  {
    number: "04",
    title: "Transparent Collaboration",
    description: "Clear communication, structured workflows and regular progress visibility keep projects aligned.",
    icon: Users,
  },
  {
    number: "05",
    title: "Technology That Fits",
    description: "We select technologies based on your requirements, not simply because they are popular.",
    icon: CheckCircle2,
  },
  {
    number: "06",
    title: "Long-Term Partnership",
    description: "We support products beyond launch, helping businesses maintain, improve and expand their digital capabilities.",
    icon: HeartHandshake,
  },
];

export function WhyUsSection() {
  return (
    <section aria-labelledby="why-us-title" className="relative border-t border-line/60 bg-white py-20 sm:py-24">
      <div className="container-x">
        <Reveal className="flex flex-col items-center text-center">
          <Eyebrow>YOUR ENGINEERING PARTNER FROM CONCEPT TO SCALE</Eyebrow>

          <h2
            id="why-us-title"
            className="mt-4 text-balance text-2xl font-semibold tracking-[-0.035em] text-ink sm:text-4xl lg:text-[2.75rem] leading-[1.15] max-w-4xl"
          >
            More Than Developers. Your Technology Engineering Partner.
          </h2>

          <div className="mt-4 flex max-w-3xl flex-col gap-3 text-pretty text-base leading-relaxed text-ink-soft sm:text-[17px]">
            <p>
              The right software development partner understands your objectives, makes thoughtful engineering decisions and stays focused on long-term success.
            </p>
            <p className="font-medium text-ink-soft">
              At IKASLÉ Technologies, we bring strategy, design and engineering together to build technology with purpose.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map(({ number, title, description, icon: Icon }) => (
            <Reveal key={title}>
              <div className="group relative flex h-full flex-col justify-between rounded-2xl border border-line bg-bg-soft/70 p-6 transition-all duration-300 hover:border-accent/40 hover:bg-white hover:-translate-y-1 hover:shadow-soft">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex size-11 items-center justify-center rounded-xl bg-white text-accent shadow-sm ring-1 ring-line/80 transition-transform duration-300 group-hover:scale-105">
                      <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <span className="font-mono text-xs font-semibold text-accent-strong">{number}</span>
                  </div>

                  <h3 className="mt-4 text-lg font-semibold tracking-tight text-ink sm:text-xl">{title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-soft sm:text-[15px]">{description}</p>
                </div>

                <div className="mt-6 flex items-center gap-1.5 font-mono text-[11px] text-ink-soft/70">
                  <span className="size-1 rounded-full bg-accent/60" aria-hidden="true" />
                  <span>IKASLÉ standard</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="font-mono text-xs tracking-wide text-ink-soft sm:text-[13px]">
            <span className="font-semibold text-accent" aria-hidden="true">{"// "}</span>
            Your vision sets the direction. Our engineering makes it possible.
          </p>
        </div>
      </div>
    </section>
  );
}

