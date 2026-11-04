import { ButtonLink } from "@/components/ui/Button";
import { RevealGroup, RevealItem } from "./AboutReveal";

/** Where the lines cross, as a share of the banner, matching the two points in the paths below. */
const NODES = [
  { left: "14.6%", top: "42%" },
  { left: "86.6%", top: "56%" },
] as const;

/** Closing banner for the About page. Other pages use the shared ContactCta. */
export function AboutCta() {
  return (
    <section aria-labelledby="about-cta-title" className="py-12 sm:py-16">
      <div className="container-x">
        <RevealGroup kind="rise" amount={0.4} className="relative overflow-hidden rounded-2xl bg-[radial-gradient(ellipse_at_50%_50%,#0c4064_0%,#07304f_55%,#05243e_100%)] px-6 py-10 text-center sm:py-8">
          {/* Stretched with the banner, so the strokes stay one pixel and the nodes are placed separately to stay round. */}
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

          <div className="relative flex flex-col items-center gap-5">
            <RevealItem delay={0.15}>
              <h2 id="about-cta-title" className="text-[1.75rem] leading-tight font-bold tracking-tight text-balance text-white sm:text-4xl">
                Let&rsquo;s build your next chapter.
              </h2>
            </RevealItem>
            <RevealItem delay={0.28}>
              <ButtonLink href="/contact" size="lg" arrow className="rounded-lg!">
                Start a Conversation
              </ButtonLink>
            </RevealItem>
          </div>
        </RevealGroup>
      </div>
    </section>
  );
}
