import { MagneticButton } from "@/components/animations/MagneticButton";
import { ButtonLink } from "@/components/ui/Button";
import { HeroBackdrop } from "./HeroBackdrop";
import { HeroLogo } from "./HeroLogo";
import { HeroHeadline } from "./HeroHeadline";

export function Hero() {
  return (
    // Full-screen: min-height (never a fixed height) is the small viewport, so the hero fills the first screen
    // without jumping as mobile toolbars collapse, and still grows on short screens. The fixed header is
    // counted once, in the top padding; the content is centred in the space below it.
    // Stacking layer 0 (bottom): sticky under the next section — see StackingSections.
    <section data-stack-layer="0" className="stack-sticky relative z-0 flex min-h-svh flex-col justify-center overflow-hidden pt-[calc(var(--header-h)+32px)] pb-12 lg:pt-[calc(var(--header-h)+24px)]" aria-labelledby="hero-title">
      <HeroBackdrop />

      {/* Top-aligned with a fixed desktop min-height, so the web-font swap in the left column
          can neither move the visual nor change the section height (both caused CLS).
          The grid itself is click-through while the columns stay interactive. */}
      <div className="container-x pointer-events-none relative grid items-start gap-10 lg:min-h-[440px] lg:grid-cols-[1.12fr_0.88fr] lg:gap-10 xl:grid-cols-[1fr_1fr]">
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
