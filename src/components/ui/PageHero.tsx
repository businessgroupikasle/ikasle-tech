import type { ReactNode } from "react";
import { SectionHeading } from "./SectionHeading";
import { Breadcrumbs, type BreadcrumbItem } from "./Breadcrumbs";

/** Top-of-page hero for inner pages: H1 + intro, with an optional visual slot. */
export function PageHero({
  eyebrow,
  path,
  title,
  description,
  heading,
  highlight,
  breadcrumbItems,
  children,
}: {
  eyebrow?: string;
  path?: string;
  title: string;
  description: ReactNode;
  /** Custom H1 element, replacing the default animated title. */
  heading?: ReactNode;
  /** Words of the title to render in the blue accent gradient. */
  highlight?: string[];
  breadcrumbItems?: BreadcrumbItem[];
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden pt-[calc(var(--header-h)+48px)] pb-16 sm:pb-20 lg:pt-[calc(var(--header-h)+72px)]">
      <div className="ambient" aria-hidden="true" />
      <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_50%_0%,#000_10%,transparent_65%)]" aria-hidden="true" />
      <div className="container-x relative">
        {breadcrumbItems && (
          <div className="mb-6">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
        )}
        <SectionHeading as="h1" eyebrow={eyebrow} path={path} title={title} description={description} heading={heading} highlight={highlight} />
        {children}
      </div>
    </section>
  );
}
