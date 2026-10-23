import type { ReactNode } from "react";
import { SectionHeading } from "./SectionHeading";

/** Top-of-page hero for inner pages: H1 + intro, with an optional visual slot. */
export function PageHero({
  eyebrow,
  path,
  title,
  description,
  heading,
  children,
}: {
  eyebrow?: string;
  path?: string;
  title: string;
  description: ReactNode;
  /** Custom H1 element, replacing the default animated title. */
  heading?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden pt-[calc(var(--header-h)+56px)] pb-16 sm:pb-20 lg:pt-[calc(var(--header-h)+80px)]">
      <div className="ambient" aria-hidden="true" />
      <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_50%_0%,#000_10%,transparent_65%)]" aria-hidden="true" />
      <div className="container-x relative">
        <SectionHeading as="h1" eyebrow={eyebrow} path={path} title={title} description={description} heading={heading} />
        {children}
      </div>
    </section>
  );
}
