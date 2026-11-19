"use client";

import { useState, useEffect } from "react";
import {
  Globe2,
  Briefcase,
  Handshake,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Building2,
  Laptop
} from "lucide-react";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/animations/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { CountryFlag as SvgCountryFlag } from "@/components/ui/CountryFlags";

function useLiveTime(timeZone: string) {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const update = () => {
      try {
        const str = new Intl.DateTimeFormat("en-US", {
          timeZone,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }).format(new Date());
        setTime(str);
      } catch {
        setTime("");
      }
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [timeZone]);

  return time;
}

const CORE_HUBS = [
  {
    code: "IN",
    country: "India",
    region: "Asia Pacific",
    hubType: "Headquarters & Core Hub",
    city: "Coimbatore, India",
    role: "Engineering Headquarters",
    badge: "Core Engineering Center",
    badgeStyle: "border-accent/25 bg-accent/10 text-accent-strong",
    pulseDot: "bg-accent",
    topGradient: "from-orange-500 via-white to-emerald-500",
    hoverBorder: "hover:border-accent hover:shadow-[0_20px_45px_-12px_rgba(0,140,248,0.18)]",
    tzId: "Asia/Kolkata",
    tzAbbr: "IST (UTC+5:30)",
    fallbackTime: "05:00:00 PM",
    icon: Building2,
    serviceType: "Full-Stack & Web Engineering",
    description:
      "Our primary engineering center delivering end-to-end custom software development, modern web applications, scalable SaaS architectures, and cloud solutions for growing businesses.",
  },
  {
    code: "GB",
    country: "United Kingdom",
    region: "Europe",
    hubType: "International Portfolio",
    city: "United Kingdom",
    role: "International Portfolio",
    badge: "Web & Digital Platforms",
    badgeStyle: "border-sky-500/25 bg-sky-500/10 text-sky-700",
    pulseDot: "bg-sky-500",
    topGradient: "from-blue-600 via-white to-rose-600",
    hoverBorder: "hover:border-sky-500 hover:shadow-[0_20px_45px_-12px_rgba(2,132,199,0.18)]",
    tzId: "Europe/London",
    tzAbbr: "GMT / BST (UTC+0)",
    fallbackTime: "11:30:00 AM",
    icon: Laptop,
    serviceType: "Website & Digital Systems",
    description:
      "Delivered modern responsive website development, high-performance web applications, and digital platforms engineered for UK clients adhering to European performance and security standards.",
  },
  {
    code: "AE",
    country: "United Arab Emirates",
    region: "Middle East",
    hubType: "International Portfolio",
    city: "United Arab Emirates",
    role: "International Portfolio",
    badge: "Enterprise Web Solutions",
    badgeStyle: "border-emerald-500/25 bg-emerald-500/10 text-emerald-700",
    pulseDot: "bg-emerald-500",
    topGradient: "from-emerald-600 via-white to-red-600",
    hoverBorder: "hover:border-emerald-500 hover:shadow-[0_20px_45px_-12px_rgba(16,185,129,0.18)]",
    tzId: "Asia/Dubai",
    tzAbbr: "GST (UTC+4)",
    fallbackTime: "03:30:00 PM",
    icon: Globe2,
    serviceType: "Cloud & Enterprise Apps",
    description:
      "Engineered custom web applications, reliable enterprise software solutions, and cloud-driven business platforms for forward-thinking commercial and enterprise clients in the UAE.",
  },
];

const GLOBAL_MARKETS = [
  { name: "United States", code: "US" },
  { name: "Saudi Arabia", code: "KSA" },
  { name: "Canada", code: "CA" },
  { name: "Australia", code: "AU" },
  { name: "New Zealand", code: "NZ" },
  { name: "United Kingdom", code: "UK" },
  { name: "United Arab Emirates", code: "UAE" },
  { name: "India", code: "IN" },
];

function HubCard({ hub }: { hub: (typeof CORE_HUBS)[number] }) {
  const liveTime = useLiveTime(hub.tzId);

  return (
    <div
      className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-[26px] border border-line/80 bg-white p-7 sm:p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-[0_16px_36px_-10px_rgba(0,140,248,0.14)] ${hub.hoverBorder}`}
    >
      {/* Top Hairline Ambient Accent Stripe */}
      <div
        className={`pointer-events-none absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${hub.topGradient}`}
        aria-hidden="true"
      />

      {/* Soft Ambient Radial Tint on Hover */}
      <div
        className="pointer-events-none absolute -top-12 -right-12 size-36 rounded-full bg-accent/[0.03] blur-2xl transition-all duration-300 group-hover:bg-accent/[0.08]"
        aria-hidden="true"
      />

      <div className="relative z-10">
        {/* Top Flag Crest & Regional Badge */}
        <div className="flex items-start gap-3 border-b border-line/70 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-7 w-10 shrink-0 overflow-hidden rounded-md border border-line shadow-xs ring-1 ring-black/5">
              <SvgCountryFlag code={hub.code} className="size-full object-cover" />
            </div>
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-ink">
                {hub.country}
              </span>
              <span className="block font-mono text-[11px] text-ink-soft">
                {hub.region}
              </span>
            </div>
          </div>

        </div>

        {/* Status badge on its own row, so every card's badge sits at the same height */}
        <div className="mt-4">
          <span
            className={`inline-flex max-w-full items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1 font-mono text-[11px] font-semibold ${hub.badgeStyle}`}
          >
            <span className={`size-1.5 shrink-0 rounded-full ${hub.pulseDot} animate-pulse`} />
            {hub.badge}
          </span>
        </div>

        {/* City Title & Engineering Role */}
        <div className="mt-5">
          <h3 className="text-xl font-bold tracking-tight text-ink sm:text-[22px]">
            {hub.city}
          </h3>
          <p className="mt-1 font-mono text-xs font-medium tracking-wide uppercase text-accent-strong">
            // {hub.role}
          </p>
        </div>

        {/* Web & Software Focused Narrative */}
        <p className="mt-3.5 text-sm leading-relaxed text-ink-soft text-justify sm:text-[14.5px]">
          {hub.description}
        </p>

      </div>

      {/* Bottom Dock: Service Category & Real-Time Local Clock */}
      <div className="relative z-10 mt-7 border-t border-line/70 pt-4 flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          <hub.icon className="size-4 shrink-0 text-accent" />
          <span className="text-xs font-semibold text-ink">{hub.serviceType}</span>
        </div>

        {/* Real-time Local Clock Bar */}
        <div className="flex items-center justify-between rounded-xl border border-line/90 bg-bg-soft/90 px-3.5 py-2 font-mono text-xs shadow-xs">
          <span className="inline-flex items-center gap-1.5 text-ink-soft text-[11.5px]">
            <Clock className="size-3.5 text-accent animate-pulse" />
            <span>{hub.tzAbbr}</span>
          </span>
          <span className="font-bold tabular-nums text-ink text-[12.5px]">
            {liveTime || hub.fallbackTime}
          </span>
        </div>
      </div>
    </div>
  );
}

export function GlobalPortfolioSection() {
  return (
    <section aria-labelledby="global-title" className="relative overflow-hidden border-t border-line/60 bg-gradient-to-b from-bg via-bg-soft/40 to-bg pt-20 pb-10 sm:pt-28 sm:pb-12">
      {/* Background ambient lighting */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_15%,rgb(0_140_248/0.06),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="container-x relative">
        {/* Section Header */}
        <Reveal className="flex flex-col items-center text-center">
          <Eyebrow>ENGINEERED IN INDIA · DELIVERED WORLDWIDE</Eyebrow>

          <h2
            id="global-title"
            className="mt-4 text-balance text-2xl font-semibold tracking-[-0.035em] text-ink sm:text-4xl lg:text-[2.75rem] leading-[1.15] max-w-3xl"
          >
            Building Beyond Borders.
          </h2>

          <div className="mt-4 flex max-w-2xl flex-col gap-2.5 text-center text-base leading-relaxed text-ink-soft sm:text-[17px]">
            <p className="font-medium text-ink">
              Great technology creates opportunities beyond geographical boundaries.
            </p>
            <p className="text-justify text-pretty">
              Based in Coimbatore, India, we engineer custom software and digital products for businesses worldwide — with active portfolio experience in the United Kingdom, the United Arab Emirates, and India.
            </p>
          </div>
        </Reveal>

        {/* 3 CREATIVE HIGH-TECH COMMAND CARDS */}
        <div className="mt-14 grid gap-6 md:grid-cols-3 lg:gap-7">
          {CORE_HUBS.map((hub) => (
            <Reveal key={hub.city}>
              <HubCard hub={hub} />
            </Reveal>
          ))}
        </div>

        {/* Worldwide Collaboration Banner (Rich Gradient Command Showcase) */}
        <Reveal className="mt-12 overflow-hidden rounded-[32px] border border-accent/30 bg-gradient-to-br from-[#0c395c] via-[#072d4c] to-[#041c30] p-8 text-white shadow-lg sm:p-12 lg:p-14">
          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-14">
            {/* Left Content */}
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#4db3ff]/30 bg-[#4db3ff]/10 px-3.5 py-1 font-mono text-xs font-semibold text-[#4db3ff] uppercase tracking-wide">
                <Globe2 className="size-3.5" aria-hidden="true" />
                <span>Open to International Partnerships</span>
              </div>
              <h3 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                We Welcome Project Enquiries from Businesses Worldwide.
              </h3>
              <p className="mt-4 text-base leading-relaxed text-white/75 text-justify sm:text-[17px]">
                Whether you are launching a SaaS startup, developing a bespoke business platform, or modernizing enterprise software, we provide frictionless collaboration, clear roadmaps, and reliable engineering delivery.
              </p>

              {/* 3 Key Trust Signals */}
              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.05] p-3 backdrop-blur-xs">
                  <Clock className="size-4 shrink-0 text-[#4db3ff]" />
                  <span className="text-xs font-medium text-white/90">Timezone Overlap</span>
                </div>
                <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.05] p-3 backdrop-blur-xs">
                  <ShieldCheck className="size-4 shrink-0 text-[#4db3ff]" />
                  <span className="text-xs font-medium text-white/90">NDA &amp; IP Protection</span>
                </div>
                <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.05] p-3 backdrop-blur-xs">
                  <Sparkles className="size-4 shrink-0 text-[#4db3ff]" />
                  <span className="text-xs font-medium text-white/90">Direct Engineer Access</span>
                </div>
              </div>
            </div>

            {/* Right: Active Countries Interactive Grid */}
            <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-6 backdrop-blur-md lg:max-w-md">
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-[#4db3ff]">
                Target Markets &amp; Active Collaboration
              </p>
              <p className="mt-1 text-xs text-white/70">
                We actively work with and welcome business partners across:
              </p>

              <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-2">
                {GLOBAL_MARKETS.map((m) => (
                  <div
                    key={m.name}
                    className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 transition-all duration-200 hover:border-[#4db3ff]/50 hover:bg-white/[0.10]"
                  >
                    <div className="h-4 w-6 shrink-0 overflow-hidden rounded-xs border border-white/20 shadow-xs">
                      <SvgCountryFlag code={m.code} className="size-full object-cover" />
                    </div>
                    <span className="truncate text-xs font-medium text-white">
                      {m.name}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/10 pt-5">
                <span className="text-xs text-white/70">Ready to consult on your timezone?</span>
                <ButtonLink
                  href="/contact"
                  variant="secondary"
                  arrow
                  className="shrink-0 font-semibold !text-ink !bg-white hover:!bg-white/90"
                >
                  Get in Touch
                </ButtonLink>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Flexible Engagement Models */}
        <div className="mt-16 sm:mt-20">
          <div className="text-center">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-accent-strong">
              {"// HOW WE ENGAGE INTERNATIONALLY"}
            </p>
            <h3 className="mt-2 text-xl font-bold tracking-tight text-ink sm:text-2xl">
              Flexible Partnership Models
            </h3>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {/* Model 1: Project-Based */}
            <Reveal>
              <div className="group relative flex h-full flex-col justify-between rounded-3xl border border-line/80 bg-white p-7 shadow-sm transition-all duration-300 hover:border-accent/40 hover:shadow-soft sm:p-8">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-accent/[0.08] text-accent-strong">
                      <Briefcase className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-accent-strong">
                        Milestone Driven
                      </span>
                      <h4 className="text-lg font-semibold text-ink sm:text-xl">
                        Project-Based Development
                      </h4>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-ink-soft text-justify sm:text-[15px]">
                    Ideal for startups and companies with well-defined deliverables, fixed scopes, and timeline goals.
                  </p>

                  <ul className="mt-6 space-y-2.5 text-sm text-ink-soft">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="size-4 shrink-0 text-accent" />
                      <span>Transparent fixed-price or milestone roadmap</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="size-4 shrink-0 text-accent" />
                      <span>End-to-end architecture, UI design and implementation</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="size-4 shrink-0 text-accent" />
                      <span>Complete source code and IP ownership handover</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Reveal>

            {/* Model 2: Dedicated Partnership */}
            <Reveal>
              <div className="group relative flex h-full flex-col justify-between rounded-3xl border border-line/80 bg-white p-7 shadow-sm transition-all duration-300 hover:border-accent/40 hover:shadow-soft sm:p-8">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-accent/[0.08] text-accent-strong">
                      <Handshake className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-accent-strong">
                        Long-Term Collaboration
                      </span>
                      <h4 className="text-lg font-semibold text-ink sm:text-xl">
                        Dedicated Technology Partnership
                      </h4>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-ink-soft text-justify sm:text-[15px]">
                    Ongoing technical collaboration for companies that need an extended engineering arm to scale and maintain software.
                  </p>

                  <ul className="mt-6 space-y-2.5 text-sm text-ink-soft">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="size-4 shrink-0 text-accent" />
                      <span>Dedicated full-stack engineers embedded in your workflow</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="size-4 shrink-0 text-accent" />
                      <span>Continuous feature rollouts, bug fixes and cloud optimization</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="size-4 shrink-0 text-accent" />
                      <span>Regular sprint reviews and direct communication channel</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Bottom Tagline */}
        <div className="mt-14 text-center">
          <p className="font-mono text-xs tracking-wide text-ink-soft sm:text-[13px]">
            <span className="font-semibold text-accent" aria-hidden="true">{"// "}</span>
            International experience. India-based engineering. A global outlook.
          </p>
        </div>
      </div>
    </section>
  );
}
