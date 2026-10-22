"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";
import { useWebGL2Support } from "@/hooks/useWebGL2Support";
import { cn } from "@/lib/cn";

// WebGL2 effect, loaded only where it runs (desktop pointer, motion allowed).
const StickerPeel = dynamic(() => import("@/components/react-bits/StickerPeel/StickerPeel"), { ssr: false });

/** The 3D logo, trimmed to its content, with a true alpha channel (1200 × 564). */
const LOGO = { src: "/brand/ikasle-logo-3d.webp", w: 1200, h: 564 };

/**
 * The glossy 3D IKASLE Technologies logo as the hero visual, with React Bits <StickerPeel />.
 *
 * Only the peel is interactive: no dragging, swing or intro, and it rests flat (no curl) until hovered.
 * The sticker is exactly as wide and tall as its slot, so the component's own edge confinement keeps it
 * centred where the static logo sits. The static image is rendered on the server and stays as the fallback
 * on touch devices, with reduced motion and without WebGL2; on desktop it hands over to the sticker once the
 * image is decoded and the sticker has drawn, so there is no blank frame.
 */
export function HeroLogo() {
  const slotRef = useRef<HTMLDivElement>(null);
  const webgl2 = useWebGL2Support();
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reduced = usePrefersReducedMotion();
  const enabled = Boolean(webgl2) && finePointer && !reduced;

  const [width, setWidth] = useState(0);
  const [decoded, setDecoded] = useState(false);
  const [handedOver, setHandedOver] = useState(false);

  // The sticker's width follows the slot (the same width the static logo has).
  useEffect(() => {
    const slot = slotRef.current;
    if (!slot) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.round(entry!.contentRect.width)));
    ro.observe(slot);
    return () => ro.disconnect();
  }, []);

  // Decode the image first, so the sticker's own load comes from cache and it draws right away.
  useEffect(() => {
    if (!enabled) return;
    let alive = true;
    const img = new window.Image();
    img.src = LOGO.src;
    img
      .decode()
      .catch(() => undefined)
      .then(() => alive && setDecoded(true));
    return () => {
      alive = false;
    };
  }, [enabled]);

  const sticker = enabled && decoded && width > 0;

  // Hide the static image only once the sticker has really drawn: its render loop positions the root
  // (transform) and, after the image loads, sizes the hit area to the logo's aspect ratio. If WebGL fails
  // for any reason, that never happens and the static logo simply stays.
  useEffect(() => {
    const slot = slotRef.current;
    if (!sticker || !slot) return;
    let raf = 0;
    const drawn = () => {
      const root = slot.querySelector<HTMLElement>(".sticker-peel");
      const hit = slot.querySelector<HTMLElement>(".sticker-peel-hit");
      const w = parseFloat(hit?.style.width ?? "");
      const h = parseFloat(hit?.style.height ?? "");
      return Boolean(root?.style.transform) && w > 0 && Math.abs(h / w - LOGO.h / LOGO.w) < 0.01;
    };
    const mo = new MutationObserver(() => {
      if (!drawn()) return;
      mo.disconnect();
      // two frames: the first draw with the loaded image lands right after the layout that sized it
      raf = requestAnimationFrame(() => (raf = requestAnimationFrame(() => setHandedOver(true))));
    });
    mo.observe(slot, { attributes: true, subtree: true, attributeFilter: ["style"] });
    return () => {
      mo.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [sticker]);

  return (
    <div className="relative mx-auto flex aspect-[5/4] w-full max-w-[600px] items-center justify-center sm:aspect-[4/3]">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-[4%] rounded-full bg-[radial-gradient(ellipse_at_50%_48%,rgb(0_140_248/0.16),rgb(0_140_248/0.05)_45%,transparent_70%)]" />
        {/* True circles (square boxes) centred on the logo, whatever the stage aspect ratio */}
        <div className="absolute top-1/2 left-1/2 aspect-square h-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/10" />
        <div className="absolute top-1/2 left-1/2 aspect-square h-[66%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-accent/20" />
      </div>

      {/* Logo slot: StickerPeel centres itself in its parent, so the slot is exactly the logo's box. */}
      <div ref={slotRef} className="relative w-[86%]" style={{ aspectRatio: `${LOGO.w} / ${LOGO.h}` }}>
        <Image
          src={LOGO.src}
          alt="IKASLE Technologies"
          width={LOGO.w}
          height={LOGO.h}
          priority
          sizes="(min-width: 1024px) 520px, (min-width: 640px) 70vw, 86vw"
          className={cn("absolute inset-0 h-full w-full object-contain select-none", sticker && handedOver && "opacity-0")}
          draggable={false}
        />
        {sticker && (
          <StickerPeel
            imageSrc={LOGO.src}
            width={width}
            finish="gloss"
            peelBackHoverPct={12}
            peelBackActivePct={24}
            peelDirection={45}
            followPointer
            curlRadius={18}
            backColor="#DDEAF5"
            lightingIntensity={0.35}
            shadowIntensity={0.25}
            draggable={false}
            swing={0}
            intro={false}
            rotate={0}
          />
        )}
      </div>
    </div>
  );
}
