"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import TechText from "@/components/react-bits/TechText/TechText";
import { brand } from "@/lib/brand";

const LINE_1 = "We Build the";
const LINE_2_LEAD = "Future in";
const LINE_2_ACCENT = "Code.";
const LINE_2 = `${LINE_2_LEAD} ${LINE_2_ACCENT}`;

/** Largest headline size in px (matches the previous xl headline). */
const MAX_SIZE = 84;
/**
 * Ink width of "Future in Code." per 1px of font size (Geist 600, -0.05em tracking), measured in the
 * browser. Both lines share the size that makes the longer line fit, so they always match.
 */
const LINE_2_WIDTH_PER_PX = 6.403;
/** Line box height as a multiple of the font size; leaves TechText the 0.66 height ratio it needs. */
const LINE_HEIGHT = 1.18;
/** TechText keeps a 5% side margin inside its box; widen the box so the ink starts flush with the column. */
const BOX_WIDTH = 1 / 0.9;
const BOX_SHIFT = 0.05 * BOX_WIDTH;

const TECH_TEXT_PROPS = {
  fontWeight: 600,
  letterSpacing: -0.05,
  align: "left",
  reveal: "letter",
  dashLength: 4,
  dashGap: 2,
  specks: 12,
  labels: true,
  selection: true,
  // Dragging would pull letters out of the clipped accent split; click-kick keeps the playful feel.
  draggable: false,
  clickKick: true,
  // No idle sweep: it would keep a render loop running next to the hero fireworks.
  sweep: false,
  intro: "metrics",
  introDuration: 1.6,
  accentColor: brand.blue,
} as const;

/**
 * Hero H1 rendered with React Bits <TechText />.
 *
 * The <h1> keeps real, styled text (SEO, screen readers, first paint, no-JS). Once fonts are ready the
 * canvas layer mounts on top, plays its "metrics" intro, and the HTML text fades out underneath.
 * "Code." stays brand blue: line 2 is drawn twice (navy + blue) with identical layout and clipped at the
 * space before "Code." — clip-path also clips hit-testing, so hover lands on the right copy.
 * Sizes come from container-query units, so the layout is final before any JavaScript runs (no CLS).
 */
export function HeroHeadline({ id }: { id: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<number | null>(null);
  const [split, setSplit] = useState<number | null>(null);
  const [line2On, setLine2On] = useState(false);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let cancelled = false;
    let timer = 0;

    const measure = () => {
      const width = el.clientWidth;
      const px = Math.min(MAX_SIZE, (width * 0.98) / LINE_2_WIDTH_PER_PX);
      const ctx = document.createElement("canvas").getContext("2d");
      if (!ctx) return;
      ctx.font = `600 100px ${getComputedStyle(el).fontFamily}`;
      ctx.letterSpacing = "-5px";
      const lead = ctx.measureText(LINE_2_LEAD).width;
      const leadWithSpace = ctx.measureText(`${LINE_2_LEAD} `).width;
      const inkLeft = ctx.measureText(LINE_2).actualBoundingBoxLeft;
      // Split point (fraction of the TechText box) in the middle of the space before "Code.".
      const box = width * BOX_WIDTH;
      const splitPx = 0.05 * box + ((inkLeft + (lead + leadWithSpace) / 2) * px) / 100;
      setSize(px);
      setSplit(splitPx / box);
    };

    document.fonts.ready.then(() => {
      if (cancelled) return;
      measure();
      timer = window.setTimeout(() => setLine2On(true), 220); // line 2 follows line 1
    });
    const ro = new ResizeObserver(() => {
      if (document.fonts.status === "loaded") measure();
    });
    ro.observe(el);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      ro.disconnect();
    };
  }, []);

  const line1On = size !== null;
  const boxStyle = (line: 0 | 1): CSSProperties => ({
    top: `calc(var(--hh-line) * ${line})`,
    left: `${-BOX_SHIFT * 100}%`,
    width: `${BOX_WIDTH * 100}%`,
    height: "var(--hh-line)",
  });
  const splitPct = split !== null ? split * 100 : 0;

  return (
    <div ref={wrap} className="w-full [container-type:inline-size]">
      <h1
        id={id}
        className="relative font-semibold text-ink"
        style={
          {
            "--hh-size": `min(${MAX_SIZE}px, calc(98cqi / ${LINE_2_WIDTH_PER_PX}))`,
            "--hh-line": `calc(var(--hh-size) * ${LINE_HEIGHT})`,
            fontSize: "var(--hh-size)",
            lineHeight: "var(--hh-line)",
            letterSpacing: "-0.05em",
          } as CSSProperties
        }
      >
        {/* Real text: visible until the canvas takes over, then faded (still read by assistive tech). */}
        <span className={`block whitespace-nowrap transition-opacity duration-500 ${line1On ? "opacity-0" : ""}`}>{LINE_1}</span>
        <span className={`block whitespace-nowrap transition-opacity duration-500 ${line2On ? "opacity-0" : ""}`}>
          {LINE_2_LEAD} <span className="text-accent">{LINE_2_ACCENT}</span>
        </span>

        {size !== null && (
          <span aria-hidden="true" className="absolute inset-0 block">
            <span className="absolute block" style={boxStyle(0)}>
              <TechText {...TECH_TEXT_PROPS} text={LINE_1} fontSize={size} />
            </span>
            {line2On && split !== null && (
              <>
                <span className="absolute block" style={{ ...boxStyle(1), clipPath: `inset(-60% ${100 - splitPct}% -60% 0)` }}>
                  <TechText {...TECH_TEXT_PROPS} text={LINE_2} fontSize={size} />
                </span>
                <span className="absolute block" style={{ ...boxStyle(1), clipPath: `inset(-60% 0 -60% ${splitPct}%)` }}>
                  <TechText {...TECH_TEXT_PROPS} text={LINE_2} fontSize={size} color={brand.blue} />
                </span>
              </>
            )}
          </span>
        )}
      </h1>
    </div>
  );
}
