"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import TechText from "@/components/react-bits/TechText/TechText";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/cn";

const ACCENT_COLOR = "#009CFF";
const WORDS = [
  ...["Your", "Trusted", "Partner", "For", "Innovative"].map((w) => ({ w, accent: false })),
  ...["Software", "Development", "Solutions"].map((w) => ({ w, accent: true })),
];

/** Delay between lines starting their intro, in ms. */
const LINE_STAGGER = 220;
/** TechText fits its ink into 90% of the box width and 66% of its height; these keep it at the CSS size. */
const WIDTH_SLACK = 1.04 / 0.9;
const BOX_HEIGHT = 1.5;

const TECH_TEXT_PROPS = {
  fontWeight: 600,
  letterSpacing: -0.04,
  align: "left",
  reveal: "letter",
  dashLength: 4,
  dashGap: 2,
  specks: 12,
  labels: true,
  selection: true,
  // Dragging would pull letters out of the clipped colour splits; click-kick keeps the playful feel.
  draggable: false,
  clickKick: true,
  // No idle sweep: it would keep a render loop running next to the hero fireworks.
  sweep: false,
  intro: "metrics",
  introDuration: 1.6,
  accentColor: brand.blue,
} as const;

/** A run of same-coloured words within a line, as fractions of that line's TechText box width. */
type Segment = { from: number; to: number; accent: boolean };
type Line = { text: string; left: number; top: number; width: number; height: number; segments: Segment[] };
type Layout = { size: number; lines: Line[]; lineOf: number[] };

/** Reads the browser's own line breaks from the real text, so the canvases match it at every width. */
function measure(h1: HTMLElement): Layout {
  const base = h1.getBoundingClientRect();
  const style = getComputedStyle(h1);
  const size = parseFloat(style.fontSize);
  const rects = [...h1.querySelectorAll<HTMLElement>("[data-w]")].map((el) => el.getBoundingClientRect());
  // Same font metrics TechText uses: it places a line by its ink (left edge, vertical centre), not its layout box.
  const ctx = document.createElement("canvas").getContext("2d")!;
  ctx.font = `600 ${size}px ${style.fontFamily}`;
  ctx.letterSpacing = `${TECH_TEXT_PROPS.letterSpacing * size}px`;
  const fontAscent = ctx.measureText("H").fontBoundingBoxAscent;

  const groups: number[][] = [];
  rects.forEach((r, i) => {
    const prev = groups.at(-1);
    if (prev && Math.abs(rects[prev[0]!]!.top - r.top) < size * 0.3) prev.push(i);
    else groups.push([i]);
  });

  const lineOf: number[] = [];
  const lines = groups.map((idx, k) => {
    idx.forEach((i) => (lineOf[i] = k));
    const first = rects[idx[0]!]!;
    const last = rects[idx.at(-1)!]!;
    const text = idx.map((i) => WORDS[i]!.w).join(" ");
    const ink = ctx.measureText(text);
    const inkHeight = ink.actualBoundingBoxAscent + ink.actualBoundingBoxDescent;
    const width = (last.right - first.left) * WIDTH_SLACK;
    const height = size * BOX_HEIGHT;
    // TechText puts the ink's left edge at 5% of the box, and centres the ink vertically.
    const left = first.left + ink.actualBoundingBoxLeft * -1 - base.left - 0.05 * width;
    const baseline = first.top + fontAscent - base.top;
    const top = baseline - ((height - inkHeight) / 2 + ink.actualBoundingBoxAscent);
    // Split at the middle of the space between two words of different colours.
    const segments: Segment[] = [];
    let from = 0;
    idx.forEach((i, n) => {
      const next = idx[n + 1];
      if (next !== undefined && WORDS[next]!.accent === WORDS[i]!.accent) return;
      const to = next === undefined ? 1 : ((rects[i]!.right + rects[next]!.left) / 2 - base.left - left) / width;
      segments.push({ from, to, accent: WORDS[i]!.accent });
      from = to;
    });
    return { text, left, top, width, height, segments };
  });
  return { size, lines, lineOf };
}

const px = (n: number) => `${Math.round(n * 10) / 10}px`;

/**
 * Hero H1 with React Bits <TechText />, one canvas per rendered line.
 *
 * The <h1> is real, wrapping text sized from the column (SEO, screen readers, first paint, no-JS, no CLS).
 * Once fonts are ready its line breaks are measured and a TechText is laid over each line, lines entering in
 * turn; each line's words fade out underneath as its canvas takes over (still read by assistive tech).
 * A line that mixes navy and the blue phrase is drawn twice with identical layout, each copy clipped at the
 * space between colours — clip-path also clips hit-testing, so hover lands on the right copy.
 * Re-measured on resize, so the canvases follow the text as it re-wraps.
 */
export function HeroHeadline({ id }: { id: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [layout, setLayout] = useState<Layout | null>(null);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const h1 = ref.current;
    if (!h1) return;
    let cancelled = false;
    const timers: number[] = [];
    let key = "";

    const update = () => {
      const next = measure(h1);
      const nextKey = JSON.stringify(next);
      if (nextKey === key) return;
      key = nextKey;
      setLayout(next);
    };

    document.fonts.ready.then(() => {
      if (cancelled) return;
      update();
      const count = measure(h1).lines.length;
      for (let k = 1; k <= count; k++) timers.push(window.setTimeout(() => setShown(k), (k - 1) * LINE_STAGGER));
    });
    const ro = new ResizeObserver(() => {
      if (document.fonts.status === "loaded") update();
    });
    ro.observe(h1);
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="w-full [container-type:inline-size]">
      <h1
        ref={ref}
        id={id}
        className="enter-up relative font-semibold text-balance text-ink [font-size:clamp(1.75rem,9.4cqi,3.75rem)] leading-[1.08] tracking-[-0.04em]"
      >
        {/* Real text: visible until its line's canvas takes over, then faded. */}
        {WORDS.map(({ w, accent }, i) => (
          <Fragment key={w}>
            <span
              data-w
              className={cn(
                "transition-opacity duration-500",
                accent && "text-[#009CFF]",
                layout && (layout.lineOf[i] ?? Infinity) < shown && "opacity-0",
              )}
            >
              {w}
            </span>
            {i < WORDS.length - 1 ? " " : null}
          </Fragment>
        ))}

        {layout && (
          <span aria-hidden="true" className="absolute inset-0 block">
            {layout.lines.slice(0, shown).map((line, k) =>
              line.segments.map((seg, j) => (
                <span
                  key={`${k}-${j}`}
                  className="absolute block"
                  style={{
                    left: px(line.left),
                    top: px(line.top),
                    width: px(line.width),
                    height: px(line.height),
                    // Outer edges are left open so the selection frame and labels aren't cut off.
                    clipPath: `inset(-60% ${j === line.segments.length - 1 ? "-10%" : `${(1 - seg.to) * 100}%`} -60% ${j === 0 ? "-10%" : `${seg.from * 100}%`})`,
                  }}
                >
                  <TechText {...TECH_TEXT_PROPS} text={line.text} fontSize={layout.size} color={seg.accent ? ACCENT_COLOR : undefined} />
                </span>
              )),
            )}
          </span>
        )}
      </h1>
    </div>
  );
}
