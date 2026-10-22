"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { clamp, createCursorGridEngine, STYLES, type CursorGridEngine, type CursorGridSettings } from "./cursor-grid-engine";
import "./CursorGrid.css";

export type CursorGridProps = {
  /** Colour of lit cells and pulses. Defaults to near black in light mode. */
  color?: string;
  /** Colour of the grid lines. Defaults to near black in light mode. */
  gridColor?: string;
  /** Size of each grid cell, in px. */
  cellSize?: number;
  /** Light every cell within the radius, or only the cell under the cursor. */
  highlight?: "area" | "cell";
  gridStyle?: "lines" | "dashed" | "dots" | "crosses";
  /** Reach of the cursor, in px, for the lit area and the spotlight. */
  radius?: number;
  falloff?: "smooth" | "linear" | "sharp";
  /** How long a cell stays lit before fading, in ms. */
  holdTime?: number;
  /** How long a lit cell takes to fade out, in ms. */
  fadeDuration?: number;
  lineWidth?: number;
  maxOpacity?: number;
  fillOpacity?: number;
  gridOpacity?: number;
  spotlight?: number;
  cellGap?: number;
  cellRadius?: number;
  clickPulse?: boolean;
  /** Speed of the click ring, in px per second. */
  pulseSpeed?: number;
  ambient?: number;
  /** Fades the grid toward the edges, 0–0.5. */
  edgeFade?: number;
  intro?: boolean;
  lightMode?: boolean;
  /**
   * IKASLE adaptation: while false no WebGL context exists (lazy start / unsuitable devices);
   * switching it on starts the engine and its intro. Upstream always renders.
   */
  enabled?: boolean;
  children?: ReactNode;
  dpr?: number;
  className?: string;
  style?: CSSProperties;
};

/**
 * React Bits <CursorGrid /> as a typed React component; the renderer is the upstream code in
 * cursor-grid-engine.js. The wrapper markup is the same whether or not the grid runs, so turning it on
 * later never remounts the children.
 */
export function CursorGrid({
  cellSize = 60,
  color,
  gridColor,
  radius = 140,
  falloff = "smooth",
  highlight = "area",
  holdTime = 400,
  fadeDuration = 800,
  lineWidth = 1,
  maxOpacity = 1,
  fillOpacity = 0.06,
  gridOpacity = 0.08,
  gridStyle = "lines",
  cellRadius = 0,
  cellGap = 0,
  spotlight = 0.6,
  clickPulse = true,
  pulseSpeed = 600,
  ambient = 0,
  edgeFade = 0.2,
  intro = true,
  lightMode = false,
  enabled = true,
  dpr,
  children,
  className = "",
  style,
}: CursorGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<CursorGridEngine | null>(null);
  const [generation, setGeneration] = useState(0);

  const ink = lightMode ? "#18181b" : "#ffffff";
  const settings: CursorGridSettings = {
    cellSize: Math.max(8, cellSize),
    color: color || ink,
    gridColor: gridColor || ink,
    radius: Math.max(1, radius),
    falloff,
    highlight,
    holdTime: Math.max(0, holdTime),
    fadeDuration: Math.max(16, fadeDuration),
    lineWidth: Math.max(0.25, lineWidth),
    maxOpacity: clamp(maxOpacity, 0, 1),
    fillOpacity: clamp(fillOpacity, 0, 1),
    gridOpacity: clamp(gridOpacity, 0, 1),
    gridStyle: STYLES[gridStyle] ?? 0,
    cellRadius: Math.max(0, cellRadius),
    cellGap: Math.max(0, cellGap),
    spotlight: clamp(spotlight, 0, 1),
    clickPulse,
    pulseSpeed: Math.max(1, pulseSpeed),
    ambient: clamp(ambient, 0, 1),
    edgeFade: clamp(edgeFade, 0, 0.5),
    intro,
    dpr,
  };
  const settingsRef = useRef(settings);

  // Keep the engine reading the latest props and redraw (upstream behaviour).
  useEffect(() => {
    settingsRef.current = settings;
    engineRef.current?.refresh();
  });

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!enabled || !container || !canvas) return;
    const engine = createCursorGridEngine(container, canvas, settingsRef, () => setGeneration((g) => g + 1));
    engineRef.current = engine;
    return () => {
      engine?.destroy();
      engineRef.current = null;
    };
  }, [enabled, generation]);

  return (
    <div ref={containerRef} className={`cursor-grid${className ? ` ${className}` : ""}`} style={style}>
      <canvas ref={canvasRef} className="cursor-grid__canvas" aria-hidden="true" />
      {children ? <div className="cursor-grid__content">{children}</div> : null}
    </div>
  );
}

export default CursorGrid;
