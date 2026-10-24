"use client";

/**
 * TechOrbitWithTooltips
 *
 * Wraps the existing <TechOrbit /> without altering its animation, props, or
 * styling in any way. Adds an interactive tooltip overlay:
 *   1. Listens for pointer & touch interactions on orbiting icons via delegated
 *      event handlers on the container.
 *   2. Displays a portal-based <TechTooltip /> rendered into document.body that
 *      tracks the moving icon smoothly via requestAnimationFrame.
 *   3. Completely decouples tooltips from the circular orbit animation.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { TechOrbit } from "./TechOrbit";
import { TechTooltip, type OrbitTooltipInfo } from "./TechTooltip";
import {
  orbitTechnologies,
  orbitTooltipData,
  technologies,
} from "@/data/technologies";

function buildLogoDataUri(path: string | null, hex: string): string {
  const body = path
    ? `<rect x="1" y="1" width="94" height="94" fill="#FFFFFF" stroke="#DFEAF3" stroke-width="2"/>` +
      `<g transform="translate(26 26) scale(1.8333)"><path fill="${hex}" d="${path}"/></g>`
    : `<rect width="96" height="96" fill="#232F3E"/>` +
      `<text x="48" y="57" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" font-weight="700" font-size="26" fill="#FF9900">aws</text>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">${body}</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

type OrbitEntry = {
  index: number;
  name: string;
  logoSrc: string;
  hex: string;
  category: string;
  description: string;
};

// Static cached map of tooltip metadata keyed by index
const orbitEntries: OrbitEntry[] = orbitTechnologies.flatMap((name, index) => {
  const tech = technologies.find((t) => t.name === name);
  const tip = orbitTooltipData[name];
  if (!tech || !tip) return [];
  return [
    {
      index,
      name,
      logoSrc: buildLogoDataUri(tech.path, tech.hex),
      hex: tech.hex,
      category: tip.category,
      description: tip.description,
    },
  ];
});

const OPEN_DELAY_MS = 35; // Snappy tooltip open
const CLOSE_DELAY_MS = 140; // Grace period before closing

export function TechOrbitWithTooltips() {
  const [activeInfo, setActiveInfo] = useState<OrbitTooltipInfo | null>(null);
  const activeIndexRef = useRef<number | null>(null);
  const scheduledIndexRef = useRef<number | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearAllTimers = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    openTimer.current = null;
    closeTimer.current = null;
  };

  const openTooltip = useCallback((index: number, immediate = false) => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }

    // If already active or scheduled for this exact index, no need to reschedule
    if (activeIndexRef.current === index) return;
    if (scheduledIndexRef.current === index && !immediate) return;

    if (openTimer.current) {
      clearTimeout(openTimer.current);
      openTimer.current = null;
    }

    const applyOpen = () => {
      const entry = orbitEntries.find((e) => e.index === index);
      if (!entry) return;
      scheduledIndexRef.current = null;
      activeIndexRef.current = index;
      setActiveInfo({
        index: entry.index,
        name: entry.name,
        category: entry.category,
        description: entry.description,
        logoSrc: entry.logoSrc,
        hex: entry.hex,
      });
    };

    if (immediate) {
      applyOpen();
    } else {
      scheduledIndexRef.current = index;
      openTimer.current = setTimeout(applyOpen, OPEN_DELAY_MS);
    }
  }, []);

  const closeTooltip = useCallback(() => {
    if (openTimer.current) {
      clearTimeout(openTimer.current);
      openTimer.current = null;
    }
    scheduledIndexRef.current = null;

    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      activeIndexRef.current = null;
      setActiveInfo(null);
    }, CLOSE_DELAY_MS);
  }, []);

  const forceClose = useCallback(() => {
    clearAllTimers();
    scheduledIndexRef.current = null;
    activeIndexRef.current = null;
    setActiveInfo(null);
  }, []);

  // ── Hover delegation on orbit container ─────────────────────────────────
  const handlePointerAction = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType === "touch") return; // Touch handled by click/tap
      const el = (e.target as Element).closest("[data-orbit-item]");
      if (!el) {
        if (activeIndexRef.current !== null || scheduledIndexRef.current !== null) {
          closeTooltip();
        }
        return;
      }

      const idxAttr = el.getAttribute("data-orbit-item");
      if (idxAttr !== null) {
        const idx = Number(idxAttr);
        openTooltip(idx);
      }
    },
    [openTooltip, closeTooltip],
  );

  const handlePointerLeave = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType === "touch") return;
      closeTooltip();
    },
    [closeTooltip],
  );

  // ── Touch & Tap toggle ──────────────────────────────────────────────────
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = (e.target as Element).closest("[data-orbit-item]");
      if (!el) {
        forceClose();
        return;
      }
      const idxAttr = el.getAttribute("data-orbit-item");
      if (idxAttr === null) return;
      const idx = Number(idxAttr);

      if (idx === activeIndexRef.current) {
        forceClose();
      } else {
        openTooltip(idx, true);
      }
    },
    [forceClose, openTooltip],
  );

  // Dismiss on touch outside
  useEffect(() => {
    if (!activeInfo) return;
    const handleTouchOutside = (e: TouchEvent) => {
      const target = e.target as Element;
      if (!target.closest("[data-orbit-item]")) {
        forceClose();
      }
    };
    document.addEventListener("touchstart", handleTouchOutside, { passive: true });
    return () => document.removeEventListener("touchstart", handleTouchOutside);
  }, [activeInfo, forceClose]);

  // Clean timers on unmount
  useEffect(() => () => clearAllTimers(), []);

  return (
    <div
      className="relative [&_[data-orbit-item]]:cursor-pointer"
      onPointerOver={handlePointerAction}
      onPointerMove={handlePointerAction}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
    >
      {/* Original orbit untouched */}
      <TechOrbit />

      {/* Floating portal tooltip */}
      <TechTooltip info={activeInfo} onClose={forceClose} />
    </div>
  );
}
