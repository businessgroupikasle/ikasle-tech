"use client";

import { useRef } from "react";
import { ClipboardList, Code2, PenTool, Rocket, type LucideIcon } from "lucide-react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { SectionHeading } from "@/components/ui/SectionHeading";

const STEPS: { title: string; text: string; icon: LucideIcon }[] = [
  { title: "Understand Your Requirements", text: "We learn your goals, users and constraints, and agree on a clear scope.", icon: ClipboardList },
  { title: "Design the Solution", text: "Workflows, screens and architecture, shared with you before we build.", icon: PenTool },
  { title: "Develop & Test", text: "Short iterations you can review, with automated tests on every change.", icon: Code2 },
  { title: "Launch & Support", text: "A smooth go-live, then monitoring, fixes and improvements as you grow.", icon: Rocket },
];

/** Four-step process. GSAP: the connector line draws across, then the steps rise in. */
export function ServicesProcess() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: "[data-steps]", start: "top 85%", once: true } })
          .from("[data-line]", { scaleX: 0, duration: 1, ease: "power2.inOut" })
          .from("[data-step]", { opacity: 0, y: 24, duration: 0.6, ease: "power3.out", stagger: 0.12 }, 0.15)
          .from("[data-step-icon]", { scale: 0.6, duration: 0.5, ease: "back.out(2)", stagger: 0.12 }, 0.25);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="process-steps-title" className="py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading
          id="process-steps-title"
          eyebrow="Our process"
          path="process/"
          title="How We Bring Your Idea to Life"
          description="A simple, transparent path from first conversation to a working product."
        />
        <div data-steps className="relative mt-12">
          <span data-line className="absolute top-7 right-[12.5%] left-[12.5%] hidden h-px origin-left bg-gradient-to-r from-accent/20 via-accent/60 to-accent/20 lg:block" aria-hidden="true" />
          <ol className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {STEPS.map((s, i) => (
              <li key={s.title} data-step className="flex flex-col items-start rounded-[22px] border border-line bg-white p-6 shadow-soft lg:items-center lg:text-center">
                <span data-step-icon className="relative inline-flex size-14 items-center justify-center rounded-2xl bg-accent-strong text-white shadow-[0_12px_28px_-12px_rgb(0_114_209/0.7)]">
                  <s.icon className="size-6" aria-hidden="true" />
                  <span className="absolute -top-2 -right-2 inline-flex size-6 items-center justify-center rounded-full border-2 border-white bg-ink font-mono text-[11px] font-semibold text-white">
                    {i + 1}
                  </span>
                </span>
                <h3 className="mt-5 text-lg font-semibold tracking-tight text-ink">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
