"use client";

import Image from "next/image";
import { useMemo } from "react";
import OrbitImages from "@/components/react-bits/OrbitImages/OrbitImages";
import { orbitTechnologies, technologies, type Technology } from "@/data/technologies";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useLayerCovered } from "./StackingSections";

/**
 * A brand-accurate logo tile as an inline SVG data URI (no network requests).
 * Marks come from Simple Icons (24×24 paths); AWS has no mark there, so it gets a wordmark tile.
 */
function logoTile(tech: Technology): string {
  const body = tech.path
    ? `<rect x="1" y="1" width="94" height="94" fill="#FFFFFF" stroke="#DFEAF3" stroke-width="2"/>` +
    `<g transform="translate(26 26) scale(1.8333)"><path fill="${tech.hex}" d="${tech.path}"/></g>`
    : `<rect width="96" height="96" fill="#232F3E"/>` +
    `<text x="48" y="57" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" font-weight="700" font-size="26" fill="#FF9900">aws</text>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">${body}</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/** React Bits <OrbitImages /> with the IKASLE stack orbiting the official logo. Decorative (aria-hidden). */
export function TechOrbit() {
  const compact = useMediaQuery("(max-width: 639px)");
  // Stacking layer 1: stop the orbit while Development Philosophy covers it.
  const covered = useLayerCovered(1);
  const portraitTablet = useMediaQuery("(min-width: 640px) and (max-width: 1023px) and (orientation: portrait)");

  const images = useMemo(
    () =>
      orbitTechnologies.map((name) => technologies.find((t) => t.name === name))
        .filter((t): t is Technology => Boolean(t))
        .map((t) => ({ src: logoTile(t), alt: t.name })),
    [],
  );

  // Phones get a taller ellipse and bigger items, so logos stay legible once the orbit scales down.
  // Portrait tablets get a tall ellipse too, so the orbit fills its full-screen section instead of a thin band.
  const geometry = compact
    ? { radiusX: 560, radiusY: 290, itemSize: 168, rotation: -4 }
    : portraitTablet
      ? { radiusX: 560, radiusY: 340, itemSize: 128, rotation: -4 }
      : { radiusX: 600, radiusY: 185, itemSize: 96, rotation: -6 };

  return (
    <OrbitImages
      images={images}
      shape="ellipse"
      baseWidth={1400}
      {...geometry}
      duration={42}
      paused={covered}
      depth={0.55}
      itemRadius={geometry.itemSize * 0.24}
      shadow={0.18}
      hoverScale={1.1}
      hoverSpeed={0.25}
      showPath
      pathColor="rgba(0, 140, 248, 0.3)"
      pathWidth={1.5}
      pathDash={6}
      // Fitted to the screen: the max-height caps the aspect-ratio box on short viewports and OrbitImages
      // scales the ring to fit whichever side binds, so the whole orbit is always visible below the heading.
      className="max-w-[1180px] md:max-h-[calc(100svh-var(--header-h)-180px)] md:min-h-[260px]"
      centerContent={
        <Image
          src="/brand/ikasle-technologies-logo.png"
          alt=""
          width={1600}
          height={552}
          sizes="(min-width: 640px) 240px, 120px"
          className="h-auto w-[clamp(110px,22%,240px)] select-none"
          draggable={false}
        />
      }
    />
  );
}
