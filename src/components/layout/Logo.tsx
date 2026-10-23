import Image from "next/image";
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

/** Official IKASLE Technologies wordmark (transparent WebP, trimmed: 720 × 238). */
export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("inline-flex items-center rounded-lg", className)} aria-label="IKASLE Technologies — home">
      <Image
        src="/brand/ikasle-logo-flat.webp"
        alt="IKASLE Technologies"
        width={720}
        height={238}
        priority
        sizes="150px"
        className="h-10 w-auto select-none sm:h-11"
        draggable={false}
      />
    </Link>
  );
}
