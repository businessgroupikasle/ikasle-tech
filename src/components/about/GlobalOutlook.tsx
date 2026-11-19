import { Globe, MapPin, Building, Compass } from "lucide-react";
import { RevealGroup, RevealItem } from "./AboutReveal";

export function GlobalOutlook() {
  return (
    <section id="global-outlook" className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_75%,rgb(0_140_248/0.05),transparent_30%),radial-gradient(circle_at_85%_25%,rgb(77_179_255/0.06),transparent_35%)]"
        aria-hidden="true"
      />
      <RevealGroup className="container-x relative">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          {/* Left Column: Content */}
          <div>
            <RevealItem>
              <p className="text-sm font-bold tracking-[0.06em] text-ink-deep uppercase sm:text-[15px]">
                OUR GLOBAL OUTLOOK
                <RevealItem as="span" kind="bar" delay={0.2} className="mt-2.5 block h-0.75 w-12 origin-left rounded-full bg-accent" aria-hidden />
              </p>
              <p className="mt-2 text-xs font-semibold tracking-wider uppercase text-accent">
                ROOTED IN INDIA. OPEN TO OPPORTUNITIES WORLDWIDE.
              </p>
            </RevealItem>
            <RevealItem delay={0.1}>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-ink-deep sm:text-3xl lg:text-[2.25rem]">
                Our Ambition Has No Borders.
              </h2>
            </RevealItem>

            <RevealItem delay={0.2}>
              <div className="mt-6 space-y-4 text-justify text-base leading-relaxed text-ink-soft sm:text-[17px]">
                <p>
                  IKASLÉ Technologies is based in Coimbatore, India, with a growing interest in working with businesses beyond our home market.
                </p>
                <p>
                  Our portfolio includes website projects from the United Kingdom and the United Arab Emirates. These experiences are part of our ongoing journey towards building meaningful international relationships.
                </p>
                <p>
                  We welcome opportunities to collaborate with businesses across India and other international markets.
                </p>
                <p className="font-medium text-ink-deep">
                  Our ambition is to grow through genuine partnerships, meaningful work and engineering that creates value.
                </p>
              </div>
            </RevealItem>
          </div>

          {/* Right Column: Global Presence Card & Markets Banner */}
          <div className="space-y-5">
            {/* Primary Markets Card */}
            <RevealItem delay={0.15} className="rounded-2xl border border-line/70 bg-bg-soft/50 p-6 shadow-xs sm:p-7">
              <div className="flex items-center gap-2 text-accent">
                <Globe className="size-5" />
                <span className="text-xs font-bold tracking-wider uppercase text-ink-deep">Portfolio Footprint</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                <span className="flex min-w-0 items-center gap-1.5 rounded-lg border border-line/80 bg-white px-3 py-2 text-sm leading-snug font-semibold text-ink-deep shadow-2xs">
                  <span className="size-2 shrink-0 rounded-full bg-emerald-500" />
                  India (HQ · Coimbatore)
                </span>
                <span className="flex min-w-0 items-center gap-1.5 rounded-lg border border-line/80 bg-white px-3 py-2 text-sm leading-snug font-semibold text-ink-deep shadow-2xs">
                  <span className="size-2 shrink-0 rounded-full bg-accent" />
                  United Kingdom
                </span>
                <span className="flex min-w-0 items-center gap-1.5 rounded-lg border border-line/80 bg-white px-3 py-2 text-sm leading-snug font-semibold text-ink-deep shadow-2xs">
                  <span className="size-2 shrink-0 rounded-full bg-accent" />
                  United Arab Emirates
                </span>
              </div>
            </RevealItem>

            {/* Global Enquiries Welcome Banner */}
            <RevealItem delay={0.25} className="rounded-2xl border border-line/70 bg-linear-to-br from-[#0c395c] to-[#06243d] p-6 text-white shadow-md sm:p-7">
              <div className="flex items-center gap-2 text-[#4db3ff]">
                <Compass className="size-5" />
                <span className="text-xs font-bold tracking-wider uppercase">Open to Global Opportunities</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/75 sm:text-[14.5px]">
                Open to new project opportunities and business enquiries from:
              </p>
              <div className="mt-3 text-sm font-semibold text-white/95">
                USA · Saudi Arabia · Canada · Australia · New Zealand and other international markets.
              </div>
            </RevealItem>
          </div>
        </div>
      </RevealGroup>
    </section>
  );
}

