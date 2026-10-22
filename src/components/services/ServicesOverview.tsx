"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/animations/ScrollReveal";
import { Icon } from "@/components/ui/Icon";
import { getService } from "@/data/services";
import { servicePages } from "@/data/service-pages";

const lift = { rest: { y: 0 }, hover: { y: -6 } };
const zoom = { rest: { scale: 1 }, hover: { scale: 1.05 } };

/**
 * Six service cards. Motion owns all movement here: RevealItem (entrance) wraps the card,
 * the card lifts on hover, and its photo zooms — three separate elements, so nothing competes.
 */
export function ServicesOverview() {
  return (
    <section id="services-overview" aria-labelledby="services-overview-title" className="bg-bg-soft py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading
          id="services-overview-title"
          eyebrow="Our services"
          path="services/"
          title="Six Ways We Help Your Business Grow."
          description="Pick a service to see what it solves, what we deliver and the technology behind it."
        />
        <RevealGroup className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-7" stagger={0.07}>
          {servicePages.map((s, i) => {
            const image = getService(s.slug)!.image;
            return (
              <RevealItem key={s.slug} className="h-full">
                <motion.article
                  initial="rest"
                  animate="rest"
                  whileHover="hover"
                  variants={lift}
                  transition={{ type: "spring", stiffness: 300, damping: 26 }}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[22px] border border-accent/15 bg-white shadow-soft transition-[border-color,box-shadow] duration-300 hover:border-accent/35 hover:shadow-[0_30px_54px_-30px_rgb(0_70_130/0.4)]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-bg-soft">
                    <motion.div variants={zoom} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-0">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(min-width: 1024px) 380px, (min-width: 768px) 46vw, 92vw"
                        className="object-cover"
                        style={{ objectPosition: image.position }}
                      />
                    </motion.div>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex size-10 items-center justify-center rounded-xl bg-bg-blue text-accent-strong">
                        <Icon name={s.icon} className="size-5" />
                      </span>
                      <span className="font-mono text-[12px] text-ink-soft">{String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <h3 className="mt-4 text-xl font-semibold tracking-tight text-ink">{s.name}</h3>
                    <p className="mt-2 flex-1 text-[15px] leading-relaxed text-ink-soft">{s.card}</p>
                    {/* Stretched link: the whole card is clickable, the label stays the visible CTA. */}
                    <Link
                      href={`#${s.slug}`}
                      className="mt-5 inline-flex items-center gap-2 text-[14.5px] font-semibold text-accent-strong after:absolute after:inset-0 after:rounded-[22px] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-accent"
                    >
                      Explore Service
                      <span className="sr-only">: {s.name}</span>
                      <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                    </Link>
                  </div>
                </motion.article>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
