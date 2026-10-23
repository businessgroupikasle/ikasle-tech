import { ButtonLink } from "@/components/ui/Button";
import { AnimatedHeading } from "@/components/animations/AnimatedHeading";
import { Reveal } from "@/components/animations/Reveal";

const CODE_LINES = [
  "const idea = await discover(goals);",
  "const design = prototype(idea, users);",
  "const product = build(design, { typed: true });",
  "await test(product);",
  "await deploy(product, 'production');",
  "scale(product).forEver();",
  "// your idea goes here",
];

type CtaLink = { label: string; href: string };

/**
 * Closing CTA on a dark "editor" surface with a slow CSS code-scroll and network lines.
 * Copy and buttons default to the site-wide CTA; pages can pass their own.
 */
export function ContactCta({
  headingLevel = "h2",
  eyebrow = "// ready when you are",
  title = "Have an Idea? Let's Build Something Extraordinary.",
  highlight = ["Extraordinary."],
  text = "From your first concept to a scalable digital product, our team is ready to bring your vision to life.",
  primary = { label: "Start Your Project", href: "/contact" },
  secondary = { label: "Contact Our Team", href: "/contact#contact-form" },
}: {
  headingLevel?: "h2" | "h3";
  eyebrow?: string;
  title?: string;
  highlight?: string[];
  text?: string;
  primary?: CtaLink;
  secondary?: CtaLink;
}) {
  const rain = [...CODE_LINES, ...CODE_LINES, ...CODE_LINES, ...CODE_LINES].join("\n");
  return (
    <section aria-labelledby="cta-title" className="py-20 sm:py-24">
      <div className="container-x">
        <Reveal className="on-dark relative overflow-hidden rounded-[32px] bg-editor px-6 py-16 text-center sm:px-12 sm:py-24">
          {/* decorative code scroll */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-70 [mask-image:radial-gradient(ellipse_at_center,transparent_25%,#000_80%)]" aria-hidden="true">
            <pre className="code-rain absolute top-0 left-6 text-[#4db3ff]/20!">{rain}</pre>
            <pre className="code-rain absolute top-0 right-6 hidden text-right text-[#4db3ff]/20! [animation-duration:55s] md:block">{rain}</pre>
          </div>
          {/* network connection lines */}
          <svg className="pointer-events-none absolute inset-0 size-full" viewBox="0 0 800 400" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="cta-line" x1="0" x2="1">
                <stop offset="0" stopColor="#008CF8" stopOpacity="0" />
                <stop offset=".5" stopColor="#4DB3FF" stopOpacity=".7" />
                <stop offset="1" stopColor="#008CF8" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0 320 C 200 260, 300 360, 400 300 S 650 220, 800 280" fill="none" stroke="url(#cta-line)" strokeWidth="1.5" className="dash-flow" />
            <path d="M0 90 C 180 140, 320 40, 460 100 S 680 150, 800 70" fill="none" stroke="url(#cta-line)" strokeWidth="1.2" className="dash-flow [animation-duration:2.4s]" />
          </svg>
          <div className="absolute -top-24 left-1/2 h-64 w-[70%] -translate-x-1/2 rounded-full bg-accent/30 blur-[100px]" aria-hidden="true" />

          <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6">
            <p className="font-mono text-[12px] text-accent-2">{eyebrow}</p>
            <AnimatedHeading
              as={headingLevel}
              id="cta-title"
              text={title}
              highlight={highlight}
              className="text-[2rem] leading-[1.08] font-semibold tracking-[-0.035em] text-balance text-white sm:text-5xl lg:text-[3.4rem]"
            />
            <p className="max-w-xl text-[17px] leading-relaxed text-[#B7CCDD]">
              {text}
            </p>
            <div className="mt-2 flex w-full flex-col justify-center gap-3 xs:w-auto xs:flex-row">
              <ButtonLink href={primary.href} size="lg" arrow>
                {primary.label}
              </ButtonLink>
              <ButtonLink href={secondary.href} size="lg" variant="secondary" className="border-white/15! bg-white/5! text-white! hover:bg-white/10!">
                {secondary.label}
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
