import Link from "next/link";
import { cn } from "@/lib/cn";

/** Code-bracket monogram + wordmark. Pure SVG/CSS, so it stays crisp at any size. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="ik-g" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0072D1" />
          <stop offset="1" stopColor="#008CF8" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#ik-g)" />
      <path d="M11.5 10.5 6.5 16l5 5.5" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20.5 10.5 25.5 16l-5 5.5" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" opacity=".75" />
      <path d="M16 9v14" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2.5 rounded-lg", className)} aria-label="IKASLE Technologies — home">
      <LogoMark className="size-8 shrink-0 transition-transform duration-300 group-hover:rotate-[-6deg]" />
      <span className="flex items-baseline gap-1.5 leading-none">
        <span className="text-[17px] font-bold tracking-[-0.02em] text-ink">IKASLE</span>
        <span className="font-mono text-[12px] font-medium text-ink-soft">Technologies</span>
      </span>
    </Link>
  );
}
