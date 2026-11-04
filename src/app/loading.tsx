import Image from "next/image";

export default function Loading() {
  return (
    <div
      className="relative z-[70] flex min-h-svh items-center justify-center overflow-hidden bg-white pt-[var(--header-h)]"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgb(0_140_248/0.12),transparent_34%)]"
        aria-hidden="true"
      />

      <div className="relative flex flex-col items-center">
        <div className="relative flex size-32 items-center justify-center sm:size-36">
          <span
            className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-accent border-r-accent/25"
            aria-hidden="true"
          />
          <span
            className="absolute inset-3 rounded-full border border-accent/15"
            aria-hidden="true"
          />
          <div className="flex size-24 items-center justify-center rounded-full bg-white shadow-[0_18px_50px_-18px_rgb(0_114_209/0.45)] sm:size-28">
            <Image
              src="/brand/ikasle-logo-flat.webp"
              alt=""
              width={720}
              height={238}
              priority
              sizes="96px"
              className="h-auto w-[82px] animate-pulse select-none sm:w-[94px]"
              draggable={false}
            />
          </div>
        </div>

        <p className="mt-5 text-xs font-semibold tracking-[0.22em] text-ink-soft uppercase">
          Loading
          <span className="loading-dots" aria-hidden="true">
            ...
          </span>
        </p>
      </div>
    </div>
  );
}
