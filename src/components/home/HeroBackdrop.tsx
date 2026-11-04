"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { useLayerCovered } from "./StackingSections";
import "./HeroScene.css";

/** Hand-placed, not random, so the server and client render the same thing. Weighted to the right, away from the text. */
const DOTS = [
  [56, 22, 3, 14, 0],
  [62, 70, 4, 17, -3],
  [68, 12, 2, 12, -7],
  [73, 86, 3, 19, -5],
  [79, 30, 4, 15, -10],
  [84, 62, 2, 13, -2],
  [89, 18, 3, 18, -8],
  [93, 76, 4, 16, -12],
  [97, 42, 2, 14, -6],
  [46, 88, 3, 20, -9],
  [38, 10, 2, 17, -4],
  [24, 92, 2, 21, -13],
] as const;

/** Light blue and white backdrop: a slowly drifting grid, moving ambient light and a few rising particles. */
export function HeroBackdrop() {
  const covered = useLayerCovered(0);
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", covered && "hs-paused")} aria-hidden="true">
      <div className="ambient" />
      <div className="hs-bg-wash" />
      <div className="hs-bg-grid">
        <div className="bg-grid" />
      </div>
      <div className="hs-bg-light" style={{ top: "-14vmax", right: "-6vmax", background: "radial-gradient(circle, rgb(77 179 255 / 0.26), transparent 66%)", "--t": "19s" } as CSSProperties} />
      <div className="hs-bg-light" style={{ bottom: "-20vmax", right: "22vw", background: "radial-gradient(circle, rgb(0 140 248 / 0.16), transparent 66%)", "--t": "26s" } as CSSProperties} />
      {DOTS.map(([left, top, size, duration, delay]) => (
        <span
          key={`${left}-${top}`}
          className="hs-bg-dot"
          style={{ left: `${left}%`, top: `${top}%`, width: size, height: size, "--t": `${duration}s`, "--d": `${delay}s` } as CSSProperties}
        />
      ))}
    </div>
  );
}
