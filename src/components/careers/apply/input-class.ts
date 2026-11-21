import { cn } from "@/lib/cn";

/**
 * Shared input look for the careers forms and admin pages: soft border, blue focus ring, red when invalid.
 * Kept in a plain module (not a "use client" file) so server components can use it too.
 */
export const inputClass = (invalid?: boolean) =>
  cn(
    "w-full rounded-xl border bg-white px-4 text-[15px] text-ink shadow-sm transition-[border-color,box-shadow] outline-none placeholder:text-ink-soft/60",
    "focus:border-accent focus:ring-3 focus:ring-accent/15 disabled:bg-bg-soft",
    invalid ? "border-red-400 focus:border-red-500 focus:ring-red-500/15" : "border-line",
  );
