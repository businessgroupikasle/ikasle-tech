import { CircleCheck } from "lucide-react";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { FireworksBackground } from "@/components/animate-ui/backgrounds/fireworks";
import { brand } from "@/lib/brand";
import { HeroLogo } from "./HeroLogo";
import { HeroHeadline } from "./HeroHeadline";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-[calc(var(--header-h)+40px)] pb-20 sm:pb-28 lg:pt-[calc(var(--header-h)+56px)]" aria-labelledby="hero-title">
      <div className="ambient" aria-hidden="true" />
      <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_70%_30%,#000_20%,transparent_70%)]" aria-hidden="true" />

      {/* Fireworks in brand blues (no navy, so particles never blend into the headline).
          Clicking empty hero space launches one; it pauses offscreen and is still under reduced motion. */}
      <FireworksBackground
        className="absolute! inset-0 opacity-80"
        color={[brand.blue, brand.blueTint, brand.blueAction]}
        population={1}
      />

      {/* Top-aligned with a fixed desktop min-height, so the web-font swap in the left column
          can neither move the visual nor change the section height (both caused CLS).
          The grid itself is click-through so empty space reaches the fireworks; columns stay interactive. */}
      <div className="container-x pointer-events-none relative grid items-start gap-10 lg:min-h-[640px] lg:grid-cols-[1fr_1.08fr] lg:gap-10">
        <div className="pointer-events-auto relative z-10 flex flex-col items-start gap-7">

          <HeroHeadline id="hero-title" />
          {/* CSS entrances: they start at first paint instead of waiting for hydration (better LCP). */}
          <p className="enter-up max-w-xl text-lg leading-relaxed text-pretty text-ink-soft [animation-delay:150ms]">
            We transform ambitious ideas into powerful digital products through modern software engineering, intelligent automation, and scalable technology.
          </p>
          <div className="enter-up flex w-full flex-col gap-3 [animation-delay:250ms] xs:w-auto xs:flex-row">
            <MagneticButton className="flex">
              <ButtonLink href="/contact" size="lg" arrow className="w-full xs:w-auto">
                Start a Project
              </ButtonLink>
            </MagneticButton>
            <ButtonLink href="/work" size="lg" variant="secondary">
              Explore Our Work
            </ButtonLink>
          </div>

        </div>

        {/* ---------- Brand visual: the official IKASLE Technologies logo ---------- */}
        <div className="pointer-events-auto relative lg:-mt-6">
          <HeroLogo />
        </div>
      </div>
    </section>
  );
}
