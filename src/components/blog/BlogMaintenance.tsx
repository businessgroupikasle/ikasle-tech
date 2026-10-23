import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";

/** Shown at /blog while the blog is switched off (see `blogUnderMaintenance` in src/lib/blog.ts). */
export function BlogMaintenance() {
  return (
    <section aria-labelledby="blog-maintenance-title" className="relative overflow-hidden pt-[calc(var(--header-h)+48px)] pb-24 sm:pb-32 lg:pt-[calc(var(--header-h)+72px)]">
      <div className="ambient" aria-hidden="true" />
      <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_50%_35%,#000_15%,transparent_70%)]" aria-hidden="true" />
      <div className="container-x relative flex flex-col items-center text-center">
        <div className="relative">
          <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgb(0_140_248/0.14),transparent_70%)]" aria-hidden="true" />
          <Image
            src="/images/blog/under-maintenance.webp"
            alt="Illustration of a worker in a hard hat carrying a large wrench and a red toolbox"
            width={323}
            height={312}
            priority
            className="relative h-auto w-[220px] select-none sm:w-[300px]"
            draggable={false}
          />
        </div>
        <p className="mt-8 font-mono text-[13px] tracking-wide text-accent-strong">{"// BLOG · UNDER MAINTENANCE"}</p>
        <h1 id="blog-maintenance-title" className="mt-4 max-w-2xl text-[2.2rem] leading-[1.08] font-semibold tracking-[-0.035em] text-balance text-ink sm:text-5xl">
          Our Blog Is Under Maintenance
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-pretty text-ink-soft">
          We&apos;re working on this section. Please check back soon — in the meantime, explore our services or get in touch.
        </p>
        <div className="mt-8 flex w-full flex-col justify-center gap-3 xs:w-auto xs:flex-row">
          <ButtonLink href="/" size="lg" arrow className="w-full xs:w-auto">
            Back to Home
          </ButtonLink>
          <ButtonLink href="/services" size="lg" variant="secondary">
            Explore Services
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
