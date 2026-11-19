import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, Clock } from "lucide-react";
import { CountryFlag as FlagArt } from "@/components/ui/CountryFlags";

export type CountryHub = {
  code: string;
  country: string;
  region: string;
  city: string;
  role: string;
  badge: string;
  badgeType: "emerald" | "blue";
  topAccent: string;
  timezone: string;
  icon: LucideIcon;
  serviceType: string;
  description: string;
};

/** Hover glow for each card, taken from its flag. */
const GLOW: Record<string, string> = {
  IN: "rgb(255 153 51 / 0.45)",
  GB: "rgb(1 33 105 / 0.4)",
  AE: "rgb(0 115 47 / 0.4)",
};

/**
 * Footprint card that flips on hover. The front is the card; the back shows the national flag at full
 * strength on a dark panel. Touch devices keep the front, whose small flag crest is the static cue.
 * Motion and the hover, touch and reduced-motion rules live in globals.css (`.country-card`, `.country-flip`, `.country-face*`).
 */
export function CountryCard({ hub }: { hub: CountryHub }) {
  const HubIcon = hub.icon;
  const isEmerald = hub.badgeType === "emerald";

  return (
    <div className="country-card group relative h-full rounded-[26px]" style={{ "--glow": GLOW[hub.code] ?? "rgb(8 40 60 / 0.35)" } as CSSProperties}>
      <div className="country-flip">
        {/* Front: the card */}
        <div className="country-face relative flex h-full flex-col justify-between overflow-hidden rounded-[26px] border border-white bg-gradient-to-b from-white via-white to-[#f5faff] shadow-[0_1px_0_rgb(255_255_255/0.9)_inset,0_30px_60px_-32px_rgb(8_40_60/0.22)] ring-1 ring-line/60 transition-[border-color,box-shadow] duration-500 hover:shadow-[0_1px_0_rgb(255_255_255/0.9)_inset,0_36px_70px_-30px_rgb(0_140_248/0.28)]">
          {/* Top signature gradient accent line */}
          <div className={`h-1.5 w-full bg-gradient-to-r ${hub.topAccent}`} />

          <div className="flex h-full flex-col justify-between p-6 sm:p-7">
            <div>
              {/* Header: flag crest, region, status badge */}
              <div className="flex items-center justify-between gap-3 border-b border-line/50 pb-5">
                <div className="flex items-center gap-2.5">
                  <div className="h-6 w-9 shrink-0 overflow-hidden rounded-md border border-line shadow-2xs ring-1 ring-black/5">
                    <FlagArt code={hub.code} className="size-full object-cover" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-ink">{hub.country}</span>
                    <span className="block font-mono text-[10.5px] text-ink-soft">{hub.region}</span>
                  </div>
                </div>

                <span
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10.5px] font-semibold ${
                    isEmerald
                      ? "border border-emerald-500/25 bg-emerald-500/10 text-emerald-700"
                      : "border border-accent/25 bg-accent/[0.08] text-accent-strong"
                  }`}
                >
                  {isEmerald ? (
                    <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                  ) : (
                    <span className="size-1.5 rounded-full bg-accent" />
                  )}
                  {hub.badge}
                </span>
              </div>

              {/* City title and role */}
              <div className="mt-5">
                <h3 className="text-[22px] font-semibold tracking-[-0.02em] text-ink sm:text-2xl">{hub.city}</h3>
                <p className="mt-1 font-mono text-[11px] font-semibold tracking-wider text-accent-strong uppercase">// {hub.role}</p>
              </div>

              {/* Narrative */}
              <p className="mt-4 text-[14.5px] leading-[1.7] text-ink-soft text-justify">{hub.description}</p>
            </div>

            {/* Bottom dock: service type and timezone */}
            <div className="mt-6 flex items-center justify-between border-t border-line/50 pt-4 font-mono text-xs text-ink-soft">
              <span className="inline-flex items-center gap-1.5 text-[11.5px]">
                <HubIcon className="size-3.5 text-accent" />
                <span>{hub.serviceType}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1 text-[11px] font-semibold text-ink shadow-[0_2px_8px_-4px_rgb(8_40_60/0.2)]">
                <Clock className="size-3 text-accent" />
                {hub.timezone}
              </span>
            </div>
          </div>
        </div>

        {/* Back: full-bleed flag with a glass info panel */}
        <div
          aria-hidden="true"
          className="country-face country-face--back overflow-hidden rounded-[26px] border border-white/10 bg-[#041c30] text-white shadow-[0_24px_48px_-16px_rgb(6_36_61/0.5)]"
        >
          {/* The flag fills the card; the 4:3 box is centred and cropped at the sides, like object-cover. */}
          <div className="country-flag-wave absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/2 h-full aspect-[4/3] -translate-x-1/2">
              <FlagArt code={hub.code} className="size-full" />
            </div>
          </div>

          {/* Depth: darker toward the bottom so the panel reads, lighter at the top so the flag shows */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#041c30] via-[#041c30]/40 to-[#041c30]/5" aria-hidden="true" />
          <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${hub.topAccent}`} aria-hidden="true" />

          {/* Glass chip: code and region */}
          <div className="absolute top-5 left-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 font-mono text-[10.5px] font-semibold tracking-[0.18em] uppercase backdrop-blur-md">
            {hub.code} · {hub.region}
          </div>

          {/* Glass info panel: country, city and an arrow */}
          <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 rounded-2xl border border-white/15 bg-white/10 p-4 shadow-[inset_0_1px_0_rgb(255_255_255/0.15)] backdrop-blur-xl sm:inset-x-5 sm:bottom-5 sm:p-5">
            <div className="min-w-0">
              <p className="font-mono text-[10.5px] font-semibold tracking-[0.2em] text-white/65 uppercase">{hub.country}</p>
              <p className="mt-1 truncate text-lg font-semibold tracking-tight">{hub.city}</p>
            </div>
            <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/25 bg-white/10">
              <ArrowUpRight className="size-4" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
