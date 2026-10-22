import { BrowserFrame } from "@/components/ui/Frames";
import { ErpDashboard, ErpInventory } from "@/components/mockups/ErpMockups";
import type { MockupKind } from "@/types";
import { cn } from "@/lib/cn";

/**
 * Layered product composition for case studies (Work grid and case-study pages).
 * `data-parallax` children are picked up by <ProjectReveal /> (GSAP) when wrapped in it.
 */
// `kind` will select the composition once there is more than one; ERP is the only published case study.
export function ProjectVisual({ className, size = "lg" }: { kind: MockupKind; className?: string; size?: "md" | "lg" }) {
  const h = size === "lg" ? "h-[300px] sm:h-[400px] lg:h-[440px]" : "h-[260px] sm:h-[340px]";
  return (
    <div className={cn("relative pb-10 sm:pr-10", className)}>
      <BrowserFrame url="erp.ikasle.app/dashboard">
        <ErpDashboard className={h} />
      </BrowserFrame>
      <div data-parallax="1.2" className="absolute right-0 -bottom-2 hidden w-[56%] sm:block">
        <BrowserFrame url="erp.ikasle.app/inventory" className="shadow-[0_30px_60px_-24px_rgb(0_70_130/0.45)]">
          <ErpInventory className="h-[190px]" />
        </BrowserFrame>
      </div>
    </div>
  );
}
