"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type PointerEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";
import type { Service } from "@/types";

function CardInner({ service, index }: { service: Service; index: number }) {
  return (
    <Link href={`/services/${service.slug}`} className="svc-card-link group/svc flex h-full flex-col">
      <div className="svc-card-media relative aspect-[4/3] overflow-hidden bg-bg-soft">
        <Image
          src={service.image.src}
          alt={service.image.alt}
          fill
          sizes="(min-width: 1024px) 380px, (min-width: 768px) 46vw, 92vw"
          className="object-cover transition-transform duration-700 ease-out group-hover/svc:scale-[1.05]"
          style={{ objectPosition: service.image.position }}
          draggable={false}
        />
      </div>
      {/* Content: solid white and full-bleed under the image, so the card reads as one white surface. */}
      <div className="svc-panel flex flex-1 flex-col px-5 pt-5 pb-5">
        <div className="flex items-center justify-between">
          <span className="inline-flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent/10 to-accent-2/15 text-accent">
            <Icon name={service.icon} className="size-5" />
          </span>
          <span className="font-mono text-[12px] text-ink-soft">{String(index + 1).padStart(2, "0")}</span>
        </div>
        <h3 className="mt-3.5 text-xl font-semibold tracking-tight text-ink">{service.title}</h3>
        <p className="mt-2 flex-1 text-[15px] leading-relaxed text-ink-soft">{service.summary}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-ink">
          Explore service
          <span className="inline-flex size-7 items-center justify-center rounded-full bg-bg-blue text-accent-strong transition-[background-color,color,transform] duration-300 group-hover/svc:translate-x-0.5 group-hover/svc:-translate-y-0.5 group-hover/svc:bg-accent-strong group-hover/svc:text-white">
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </span>
        </span>
      </div>
    </Link>
  );
}

const TILT = 7; // degrees, as before

/**
 * One card with pointer tilt: CSS transforms written at most once per frame, straight to the DOM — no React
 * state, no animation loop. Mouse only; touch and reduced motion get a still card.
 */
function TiltCard({ service, index }: { service: Service; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const target = useRef({ x: 0, y: 0 });

  const schedule = () => {
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const el = ref.current;
      if (!el) return;
      el.style.setProperty("--tilt-x", `${(-target.current.y * TILT).toFixed(2)}deg`);
      el.style.setProperty("--tilt-y", `${(target.current.x * TILT).toFixed(2)}deg`);
    });
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    target.current = { x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 };
    schedule();
  };
  const onPointerLeave = () => {
    target.current = { x: 0, y: 0 };
    schedule();
  };

  return (
    <div ref={ref} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave} className="svc-tilt h-full">
      <div className="svc-static svc-sheen relative h-full overflow-hidden rounded-[20px] border border-line bg-white p-4 shadow-soft">
        <CardInner service={service} index={index} />
      </div>
    </div>
  );
}

/**
 * Homepage service cards: image-led white cards. GSAP fades them up as the grid enters (with a one-time CSS
 * light sweep); on desktop they tilt toward the pointer and lift on hover.
 *
 * Each transform has one owner: GSAP → [data-svc-card] (entrance), pointer → .svc-tilt (tilt),
 * CSS → .svc-static (hover lift). These used to be React Bits <ReflectiveCard />s, but once the cards became
 * solid white the photo and content covered the whole WebGL surface, so multiple WebGL contexts were rendering
 * a hairline. The visible parts (tilt, entrance, glow) are kept, without WebGL.
 * The cards render visible on the server, so content never depends on JavaScript.
 */
export function ServiceCards({ services }: { services: Service[] }) {
  const grid = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-svc-card]");
        gsap.set(cards, { autoAlpha: 0, y: 20 });
        ScrollTrigger.create({
          trigger: grid.current,
          start: "top 85%",
          once: true,
          onEnter: () =>
            cards.forEach((card, i) =>
              gsap.to(card, {
                autoAlpha: 1,
                y: 0,
                duration: 0.8,
                delay: i * 0.1,
                ease: "power3.out",
                onStart: () => card.setAttribute("data-entered", ""), // triggers the CSS light sweep
              }),
            ),
        });
      });
      return () => mm.revert();
    },
    { scope: grid },
  );

  return (
    <div ref={grid} className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {services.map((service, i) => (
        <div key={service.slug} data-svc-card className="h-full">
          <TiltCard service={service} index={i} />
        </div>
      ))}
    </div>
  );
}
