"use client";

/**
 * TechTooltip — portal tooltip for the orbit section.
 *
 * Renders into document.body via a React portal so it is never clipped by
 * ancestor containers. Position is calculated and updated smoothly on each
 * animation frame (rAF) to track the orbiting icon without any React
 * re-rendering overhead.
 *
 * The orbit animation itself remains 100% untouched.
 */

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";

export type OrbitTooltipInfo = {
  /** 0-based index matching data-orbit-item attribute */
  index: number;
  name: string;
  category: string;
  description: string;
  /** data URI from logo tile */
  logoSrc: string;
  /** Brand hex colour (e.g. "#007ACC") */
  hex: string;
};

type ComputedPos = {
  top: number;
  left: number;
  arrowLeft: number;
  above: boolean;
};

const TOOLTIP_W = 236; // px
const TOOLTIP_GAP = 12; // px gap between icon edge and tooltip
const VIEWPORT_PAD = 12; // px distance from viewport boundary

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** Compute fixed tooltip position from the active icon's current rect. */
function calcPos(rect: DOMRect, tipH: number): ComputedPos {
  const iconCx = rect.left + rect.width / 2;
  const iconTop = rect.top;
  const iconBottom = rect.bottom;

  // Check available space above the icon
  const spaceAbove = iconTop - TOOLTIP_GAP;
  const above = spaceAbove >= tipH + VIEWPORT_PAD;

  let top = above
    ? iconTop - TOOLTIP_GAP - tipH
    : iconBottom + TOOLTIP_GAP;

  const winH = typeof window !== "undefined" ? window.innerHeight : 800;
  const maxTop = winH - tipH - VIEWPORT_PAD;
  top = Math.max(VIEWPORT_PAD, Math.min(top, maxTop));

  // Horizontally centre on icon, clamped inside viewport
  const rawLeft = iconCx - TOOLTIP_W / 2;
  const winW = typeof window !== "undefined" ? window.innerWidth : 1200;
  const maxLeft = winW - TOOLTIP_W - VIEWPORT_PAD;
  const left = Math.max(VIEWPORT_PAD, Math.min(rawLeft, maxLeft));

  // Arrow points to icon centre relative to tooltip box (clamped inside rounded borders)
  const arrowLeft = Math.max(20, Math.min(iconCx - left, TOOLTIP_W - 20));

  return { top, left, arrowLeft, above };
}

type TooltipInnerProps = {
  info: OrbitTooltipInfo;
  onClose: () => void;
};

function TooltipInner({ info, onClose }: TooltipInnerProps) {
  const tipRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  // Synchronously compute initial position on mount if DOM is present
  const [initialPos] = useState<ComputedPos | null>(() => {
    if (typeof document === "undefined") return null;
    const el = document.querySelector(`[data-orbit-item="${info.index}"]`);
    if (!el) return null;
    return calcPos(el.getBoundingClientRect(), 116);
  });

  const [above, setAbove] = useState<boolean>(initialPos?.above ?? true);

  // High-performance rAF loop: updates DOM styles directly every frame
  // to follow moving icon with zero React re-render lag or frame drops.
  useIsomorphicLayoutEffect(() => {
    let alive = true;

    function tick() {
      if (!alive) return;

      const el = document.querySelector(`[data-orbit-item="${info.index}"]`);
      if (el && tipRef.current) {
        const rect = el.getBoundingClientRect();
        const tipH = tipRef.current.offsetHeight || 116;
        const next = calcPos(rect, tipH);

        tipRef.current.style.top = `${next.top}px`;
        tipRef.current.style.left = `${next.left}px`;

        if (arrowRef.current) {
          arrowRef.current.style.left = `${next.arrowLeft}px`;
        }

        setAbove((prev) => (prev !== next.above ? next.above : prev));
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      alive = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [info.index]);

  // Keyboard dismiss (Escape)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Accent color for category badge — soften pure black
  const pillColor = info.hex === "#000000" ? "#009CFF" : info.hex;

  return (
    <motion.div
      ref={tipRef}
      role="tooltip"
      style={{
        position: "fixed",
        top: initialPos?.top ?? 0,
        left: initialPos?.left ?? 0,
        zIndex: 9999,
        visibility: initialPos ? "visible" : "hidden",
      }}
      initial={{ opacity: 0, scale: 0.94, y: above ? 6 : -6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: above ? 4 : -4 }}
      transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
      className="pointer-events-none w-[236px] select-none rounded-2xl border border-[#DFEAF3] bg-white/95 p-3.5 shadow-[0_12px_36px_rgba(8,43,69,0.15)] backdrop-blur-md"
    >
      {/* Directional arrow pointing at active icon */}
      <div
        ref={arrowRef}
        aria-hidden="true"
        className="pointer-events-none absolute -translate-x-1/2"
        style={{
          left: initialPos?.arrowLeft ?? TOOLTIP_W / 2,
          ...(above ? { bottom: -7 } : { top: -7 }),
        }}
      >
        {above ? (
          <div className="relative">
            <span className="block h-0 w-0 border-x-[7px] border-x-transparent border-t-[7px] border-t-[#DFEAF3]" />
            <span className="absolute -top-[1px] left-[1px] block h-0 w-0 border-x-[6px] border-x-transparent border-t-[6px] border-t-white" />
          </div>
        ) : (
          <div className="relative">
            <span className="block h-0 w-0 border-x-[7px] border-x-transparent border-b-[7px] border-b-[#DFEAF3]" />
            <span className="absolute top-[1px] left-[1px] block h-0 w-0 border-x-[6px] border-x-transparent border-b-[6px] border-b-white" />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {/* Header: Brand logo + Tech name + Category pill */}
        <div className="flex items-center gap-2.5">
          <img
            src={info.logoSrc}
            alt=""
            aria-hidden="true"
            width={30}
            height={30}
            className="h-[30px] w-[30px] shrink-0 rounded-lg border border-[#E8EFF5] bg-white object-contain p-0.5 shadow-sm"
            draggable={false}
          />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13.5px] font-semibold leading-tight text-[#082B45]">
              {info.name}
            </div>
          </div>
        </div>

        {/* Category badge */}
        <div>
          <span
            className="inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide"
            style={{
              backgroundColor: `${pillColor}15`,
              color: pillColor,
            }}
          >
            {info.category}
          </span>
        </div>

        {/* Description */}
        <p className="text-[11.5px] leading-relaxed text-[#5A6F82]">
          {info.description}
        </p>
      </div>
    </motion.div>
  );
}

type TechTooltipProps = {
  info: OrbitTooltipInfo | null;
  onClose: () => void;
};

/**
 * Mounts TooltipInner into document.body via a React portal.
 * AnimatePresence provides smooth enter/exit transitions.
 */
export function TechTooltip({ info, onClose }: TechTooltipProps): ReactNode {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {info ? (
        <TooltipInner key={info.index} info={info} onClose={onClose} />
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
