"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { services } from "@/data/services";
import { Icon } from "@/components/ui/Icon";
import { ScrollLink as Link } from "@/components/ui/ScrollLink";

export function ServicesMegaMenu({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <motion.div
      id="services-mega-menu"
      role="region"
      aria-label="Services menu"
      initial={{ opacity: 0, y: -10, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.99 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="absolute top-[calc(100%+10px)] left-1/2 w-[min(1180px,calc(100vw-32px))] -translate-x-1/2 overflow-hidden rounded-[28px] border border-line/80 bg-white p-4 shadow-[0_24px_70px_-22px_rgba(8,40,60,0.32)]"
    >
      <div className="mb-3 flex items-end justify-between px-2 pt-1">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.16em] text-accent-strong uppercase">What we do</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-ink">Services built for your next stage of growth</h2>
        </div>
        <Link href="/services" onClick={onNavigate} className="group flex items-center gap-2 text-sm font-semibold text-ink-soft transition-colors hover:text-accent-strong">
          View all services <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </div>

      <ul className="grid grid-cols-3 gap-2.5">
        {services.map((service, index) => (
          <li key={service.slug}>
            <Link
              href={`/services/${service.slug}`}
              onClick={onNavigate}
              className="group grid min-h-[142px] grid-cols-[112px_1fr] gap-4 rounded-2xl border border-transparent p-2 transition-[background-color,border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-line hover:bg-bg-soft hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-strong"
            >
              <span className="relative overflow-hidden rounded-xl bg-bg-soft">
                <Image src={service.image.src} alt="" fill sizes="112px" className="object-cover transition-transform duration-500 group-hover:scale-105" style={{ objectPosition: service.image.position }} />
                <span className="absolute top-2 left-2 grid size-8 place-items-center rounded-lg bg-white/90 text-accent-strong shadow-sm backdrop-blur-sm">
                  <Icon name={service.icon} className="size-4" aria-hidden="true" />
                </span>
              </span>
              <span className="flex min-w-0 flex-col py-1 pr-1">
                <span className="text-[10px] font-semibold tracking-[0.14em] text-accent-strong uppercase">Service {String(index + 1).padStart(2, "0")}</span>
                <span className="mt-1 text-[15px] leading-5 font-semibold text-ink">{service.title}</span>
                <span className="mt-1 line-clamp-2 text-xs leading-[1.45] text-ink-soft">{service.summary}</span>
                <span className="mt-auto flex items-center gap-1.5 pt-2 text-xs font-semibold text-ink transition-colors group-hover:text-accent-strong">
                  Explore Service <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export function MobileServicesMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <motion.ul
      id="mobile-services-menu"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden"
    >
      {services.map((service, index) => (
        <li key={service.slug}>
          <Link href={`/services/${service.slug}`} className="flex items-center gap-3 border-t border-line/70 py-3 pl-2" onClick={onNavigate}>
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-bg-soft text-accent-strong">
              <Icon name={service.icon} className="size-4" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[10px] font-semibold tracking-wider text-accent-strong uppercase">Service {String(index + 1).padStart(2, "0")}</span>
              <span className="block truncate text-sm font-semibold text-ink">{service.title}</span>
            </span>
            <ArrowRight className="size-4 text-ink-soft" aria-hidden="true" />
          </Link>
        </li>
      ))}
      <li>
        <Link href="/services" className="flex items-center justify-between border-t border-line py-3 pl-2 text-sm font-semibold text-accent-strong" onClick={onNavigate}>
          View all services <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </li>
    </motion.ul>
  );
}