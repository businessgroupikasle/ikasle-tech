"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { clients, type Client } from "@/data/clients";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

function ClientCard({ client, index }: { client: Client; index: number }) {
  const reduced = usePrefersReducedMotion();

  // Optical height constraints based on aspect classification
  const logoHeightClass = {
    square: "max-h-14 max-w-[70%] sm:max-h-24 sm:max-w-[65%]",
    horizontal: "max-h-9 max-w-[88%] sm:max-h-16 sm:max-w-[80%]",
    wide: "max-h-7 max-w-[92%] sm:max-h-12 sm:max-w-[85%]",
  }[client.aspect];

  const content = (
    <>
      {/* External link indicator for clients with verified websites */}
      {client.url && (
        <span
          className="absolute top-2.5 right-2.5 inline-flex size-6 items-center sm:top-4 sm:right-4 sm:size-7 justify-center rounded-full bg-slate-50 text-ink-soft/50 transition-all duration-200 group-hover:bg-accent/10 group-hover:text-accent"
          aria-hidden="true"
        >
          <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      )}

      {/* Centered original logo */}
      <div className="relative flex h-16 w-full items-center justify-center sm:h-24">
        <Image
          src={client.logo}
          alt={`${client.name} logo`}
          width={client.aspect === "square" ? 220 : 360}
          height={client.aspect === "square" ? 220 : 120}
          className={cn(
            "h-auto w-auto object-contain transition-transform duration-300 ease-out select-none group-hover:scale-[1.03]",
            logoHeightClass
          )}
          sizes="(min-width: 1280px) 210px, (min-width: 1024px) 280px, (min-width: 640px) 40vw, 45vw"
          loading="lazy"
        />
      </div>

      {/* Subtle client industry label */}
      <div className="mt-2 flex items-start justify-between gap-1 border-t border-line/40 pt-2 sm:mt-3 sm:items-center sm:pt-3">
        <span className="font-mono text-[8px] leading-tight tracking-wide text-ink-soft/60 uppercase sm:text-[11px] sm:tracking-wider transition-colors group-hover:text-ink-soft/80">
          {client.category}
        </span>
        {client.url && (
          <span className="hidden text-[11px] font-medium text-accent opacity-0 transition-opacity duration-200 sm:inline group-hover:opacity-100">
            Visit site →
          </span>
        )}
      </div>
    </>
  );

  const cardClasses = cn(
    "group relative flex min-w-0 flex-col justify-between rounded-xl border border-line/80 bg-white p-3 sm:rounded-2xl sm:p-7 xl:p-4",
    "shadow-[0_2px_10px_rgb(8_40_60/0.03)] transition-all duration-300 ease-out",
    "hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_12px_28px_rgb(0_140_248/0.1)]",
    client.url ? "cursor-pointer" : "cursor-default"
  );

  const motionProps = reduced
    ? {}
    : {
      initial: { opacity: 0, y: 18 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: "-40px" },
      transition: {
        duration: 0.5,
        ease: [0.21, 0.47, 0.32, 0.98] as const,
        delay: index * 0.08,
      },
    };

  if (client.url) {
    return (
      <motion.a
        href={client.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${client.name} — ${client.category} (opens official website)`}
        className={cardClasses}
        {...motionProps}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.div
      aria-label={`${client.name} — ${client.category}`}
      className={cardClasses}
      {...motionProps}
    >
      {content}
    </motion.div>
  );
}

export function ClientsSection() {
  const reduced = usePrefersReducedMotion();

  const headerMotionProps = reduced
    ? {}
    : {
      initial: { opacity: 0, y: 18 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: "-40px" },
      transition: { duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] as const },
    };

  return (
    <section
      id="clients"
      aria-labelledby="clients-heading"
      className="relative overflow-hidden border-t border-line/60 bg-white py-20 sm:py-24"
    >
      {/* Subtle background technical grid accent */}
      <div
        className="bg-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,#000_15%,transparent_75%)]"
        aria-hidden="true"
      />

      {/* Soft brand glow */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgb(0_140_248/0.035),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="container-x relative z-10">
        {/* Section Header */}
        <motion.div
          className="mx-auto mb-14 flex max-w-3xl flex-col items-center text-center sm:mb-18"
          {...headerMotionProps}
        >


          <h2
            id="clients-heading"
            className="mt-4 text-balance font-semibold tracking-[-0.035em] text-ink text-[2rem] leading-[1.08] sm:text-5xl lg:text-[3.25rem]"
          >
            Our Clients
          </h2>

          <p className="mt-5 text-pretty text-base leading-relaxed text-ink-soft sm:text-lg">
            Proud to collaborate with businesses across industries, helping them build stronger
            digital experiences through technology.
          </p>
        </motion.div>
        <div
          role="region"
          aria-label="Our clients"
          className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 lg:gap-8 xl:grid-cols-5 xl:gap-5"
        >
          {clients.map((client, index) => (
            <ClientCard key={client.slug} client={client} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
