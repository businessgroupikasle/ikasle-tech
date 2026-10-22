import { BrowserFrame } from "@/components/ui/Frames";
import { ErpDashboard, ErpInventory, ErpProduction } from "@/components/mockups/ErpMockups";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import type { Project } from "@/types";

function Screen({ kind }: { kind: Project["screens"][number]["kind"] }) {
  switch (kind) {
    case "erp-dashboard":
      return (
        <BrowserFrame url="erp.ikasle.app/dashboard">
          <ErpDashboard className="h-[320px] sm:h-[420px]" />
        </BrowserFrame>
      );
    case "erp-inventory":
      return (
        <BrowserFrame url="erp.ikasle.app/inventory">
          <ErpInventory className="h-[300px]" />
        </BrowserFrame>
      );
    case "erp-production":
      return (
        <BrowserFrame url="erp.ikasle.app/production">
          <ErpProduction className="h-[300px]" />
        </BrowserFrame>
      );
  }
}

/** "Application screenshots" — rendered as live, illustrative React mockups. */
export function ScreenGallery({ screens }: { screens: Project["screens"] }) {
  const [first, ...rest] = screens;
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {first && (
        <ScrollReveal className="md:col-span-2">
          <figure>
            <Screen kind={first.kind} />
            <figcaption className="mt-3 font-mono text-[12px] text-ink-soft">{first.caption}</figcaption>
          </figure>
        </ScrollReveal>
      )}
      {rest.map((s, i) => (
        <ScrollReveal key={s.kind} delay={i * 0.08}>
          <figure>
            <Screen kind={s.kind} />
            <figcaption className="mt-3 font-mono text-[12px] text-ink-soft">{s.caption}</figcaption>
          </figure>
        </ScrollReveal>
      ))}
    </div>
  );
}
