import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Badge({ children, className, tone = "neutral" }: { children: ReactNode; className?: string; tone?: "neutral" | "accent" | "pending" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11.5px] leading-none",
        tone === "neutral" && "border-line bg-white text-ink-soft",
        tone === "accent" && "border-accent/20 bg-accent/[0.06] text-accent-strong",
        tone === "pending" && "border-warning/30 bg-warning/10 text-[#9a6200]",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Labels interface mockups as illustrative so sample data is never mistaken for real data. */
export function DemoDataNote({ children = "Illustrative interface · sample data", className }: { children?: ReactNode; className?: string }) {
  return (
    <p className={cn("font-mono text-[11px] tracking-wide text-ink-soft", className)}>
      <span aria-hidden="true">{"// "}</span>
      {children}
    </p>
  );
}
