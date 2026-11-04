import type { ReactNode } from "react";

/**
 * Section wrapper for the tech-stack layer of the homepage stacking sections.
 * `isolate` creates a stacking context so the globe's z-indexed nodes can't paint over the fixed header.
 */
export function TechStackShell({ children, labelledBy }: { children: ReactNode; labelledBy: string }) {
  return (
    <section aria-labelledby={labelledBy} data-stack-layer="1" className="stack-sticky stack-sheet relative isolate z-10 flex flex-col justify-center overflow-hidden border-b border-line bg-bg-soft motion-reduce:border-t py-16 md:min-h-svh md:pt-[calc(var(--header-h)+24px)] md:pb-10">
      {children}
    </section>
  );
}
