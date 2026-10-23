import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

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
