import { MagneticButton } from "@/components/animations/MagneticButton";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/SectionHeading";
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
        <div className="pointer-events-auto relative z-10 flex flex-col items-start gap-6">

          <div className="enter-up [animation-delay:50ms]">
            <Eyebrow>GLOBAL SOFTWARE ENGINEERING PARTNER</Eyebrow>
          </div>

          <HeroHeadline id="hero-title" />

          {/* CSS entrances: they start at first paint instead of waiting for hydration (better LCP). */}
          <div className="enter-up flex max-w-xl flex-col gap-4 text-justify text-ink-soft [animation-delay:150ms]">
            <p className="text-base leading-relaxed text-pretty text-ink-soft sm:text-[17px]">
              We turn ambitious ideas into powerful digital products. From custom software and SaaS platforms to enterprise applications and AI-powered solutions, we engineer technology that helps businesses move forward.
            </p>
            <p className="text-base leading-relaxed text-pretty text-ink-soft sm:text-[17px]">
              Based in Coimbatore, India. Open to projects from businesses worldwide, with portfolio experience in the United Kingdom and United Arab Emirates.
            </p>
          </div>

          <div className="enter-up flex w-full flex-col gap-3.5 [animation-delay:250ms] xs:w-auto xs:flex-row xs:items-center">
            <MagneticButton className="flex">
              <ButtonLink href="/contact" size="lg" arrow className="w-full xs:w-auto">
                Start a Project
              </ButtonLink>
            </MagneticButton>
            <MagneticButton className="flex">
              <ButtonLink href="/clientele" variant="secondary" size="lg" arrow className="w-full xs:w-auto">
                Explore Our Work
              </ButtonLink>
            </MagneticButton>
          </div>

          <p className="enter-up font-mono text-xs tracking-wide text-ink-soft sm:text-[13px] [animation-delay:300ms]">
            <span className="font-semibold text-accent" aria-hidden="true">{"// "}</span>
            Engineering ideas. Solving challenges. Building what comes next.
          </p>

        </div>

        {/* ---------- Brand visual: the official IKASLE Technologies logo ---------- */}
        <div className="pointer-events-auto relative lg:-mt-6">
          <HeroLogo />
        </div>
      </div>
    </section>
  );
}
