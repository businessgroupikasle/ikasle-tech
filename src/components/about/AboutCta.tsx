import { ButtonLink } from "@/components/ui/Button";
import { RevealGroup, RevealItem } from "./AboutReveal";

/** Where the lines cross, as a share of the banner, matching the two points in the paths below. */
const NODES = [
  { left: "14.6%", top: "42%" },
  { left: "86.6%", top: "56%" },
] as const;

/** Closing banner for the About page. */
export function AboutCta() {
  return (
    <section aria-labelledby="about-cta-title" className="py-16 sm:py-20 lg:py-24">
      <div className="container-x">
        <RevealGroup kind="rise" amount={0.3} className="relative overflow-hidden rounded-3xl bg-[radial-gradient(ellipse_at_50%_40%,#0c456d_0%,#07304f_55%,#05223a_100%)] px-6 py-14 text-center sm:px-10 sm:py-16 lg:py-20 shadow-xl border border-white/10">
          <RevealItem kind="wipe" delay={0.25} className="pointer-events-none absolute inset-0" aria-hidden>
            <svg viewBox="0 0 1000 121" preserveAspectRatio="none" className="size-full" focusable="false">
              <g fill="none" stroke="#35c6f4">
                <path vectorEffect="non-scaling-stroke" strokeOpacity=".75" d="M15 121C70 96 110 72 146 51S176 20 192 0" />
                <path vectorEffect="non-scaling-stroke" strokeOpacity=".35" d="M40 121C70 84 110 62 146 51S196 34 224 0" />
                <path vectorEffect="non-scaling-stroke" strokeOpacity=".75" d="M760 121C790 98 830 80 866 68S950 36 1000 22" />
                <path vectorEffect="non-scaling-stroke" strokeOpacity=".35" d="M790 121C815 92 840 74 866 68S950 72 1000 108" />
              </g>
            </svg>
          </RevealItem>

          {NODES.map((node) => (
            <span key={node.left} className="pointer-events-none absolute hidden size-2 -translate-x-1/2 -translate-y-1/2 sm:block" style={node} aria-hidden="true">
              <RevealItem as="span" kind="pop" delay={0.85} className="absolute inset-0">
                <span className="absolute inset-0 animate-ping rounded-full bg-[#35c6f4]/70 motion-reduce:hidden" />
                <span className="absolute inset-0 rounded-full bg-white shadow-[0_0_10px_3px_rgb(53_198_244/0.75)]" />
              </RevealItem>
            </span>
          ))}

          <div className="relative mx-auto flex max-w-3xl flex-col items-center">
            <RevealItem>
              <p className="text-xs font-bold tracking-[0.14em] uppercase text-[#4db3ff] sm:text-sm">
                FINAL SECTION · THE STORY CONTINUES
              </p>
            </RevealItem>

            <RevealItem delay={0.1}>
              <h2 id="about-cta-title" className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] leading-[1.12]">
                The Best Is Still Being Built.
              </h2>
            </RevealItem>

            <RevealItem delay={0.2}>
              <div className="mt-5 w-full max-w-2xl space-y-3 text-center text-base leading-relaxed text-white/75 sm:text-[17px]">
                <p>
                  We started with an idea. We grew through experiences. We continue with a vision to create something meaningful.
                </p>
                <p>
                  As technology evolves and new opportunities emerge, our journey continues. If you believe in building with purpose, exploring possibilities and creating meaningful impact, we would love to connect.
                </p>
              </div>
            </RevealItem>

            <RevealItem delay={0.3} className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <ButtonLink href="/contact" size="lg" arrow className="rounded-xl! bg-accent text-white hover:bg-accent-strong">
                Let&apos;s Build What&apos;s Next
              </ButtonLink>
              <ButtonLink href="/services" size="lg" variant="secondary" arrow className="rounded-xl! bg-white/10 text-white hover:bg-white/20 border-white/20">
                Explore Our Services
              </ButtonLink>
            </RevealItem>

            <RevealItem delay={0.35} className="mt-10 pt-6 border-t border-white/10 w-full text-center">
              <p className="font-mono text-xs tracking-wider text-white/60 sm:text-sm">
                IKASLÉ Technologies · <span className="text-white/90 font-sans font-medium">Engineering Ideas Into Impact.</span>
              </p>
            </RevealItem>
          </div>
        </RevealGroup>
      </div>
    </section>
  );
}
