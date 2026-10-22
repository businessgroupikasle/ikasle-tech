import type { Technology } from "@/data/technologies";
import { cn } from "@/lib/cn";

/** Brand mark from Simple Icons, or a wordmark tile when no mark is available. */
export function TechLogo({ tech, className }: { tech: Technology; className?: string }) {
  if (!tech.path) {
    return (
      <span
        aria-hidden="true"
        className={cn("inline-flex items-center justify-center rounded-[5px] bg-[#232f3e] font-mono text-[8px] font-bold text-[#ff9900]", className)}
      >
        aws
      </span>
    );
  }
  // Very dark brand colours read as black — fine on light backgrounds.
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill={tech.hex}>
      <path d={tech.path} />
    </svg>
  );
}
