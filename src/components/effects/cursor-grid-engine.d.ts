/** Typed surface of the CursorGrid rendering engine (cursor-grid-engine.js). */

export const STYLES: { lines: number; dashed: number; dots: number; crosses: number };
export function clamp(value: number, min: number, max: number): number;

export type CursorGridSettings = {
  cellSize: number;
  color: string;
  gridColor: string;
  radius: number;
  falloff: "smooth" | "linear" | "sharp";
  highlight: "area" | "cell";
  holdTime: number;
  fadeDuration: number;
  lineWidth: number;
  maxOpacity: number;
  fillOpacity: number;
  gridOpacity: number;
  gridStyle: number;
  cellRadius: number;
  cellGap: number;
  spotlight: number;
  clickPulse: boolean;
  pulseSpeed: number;
  ambient: number;
  edgeFade: number;
  intro: boolean;
  dpr: number | undefined;
};

export type CursorGridEngine = {
  /** Re-applies settings (rebuilds the grid if the cell size changed) and redraws. */
  refresh: () => void;
  /** Removes listeners and observers and releases every WebGL resource. */
  destroy: () => void;
};

export function createCursorGridEngine(
  container: HTMLElement,
  canvas: HTMLCanvasElement,
  settingsRef: { current: CursorGridSettings },
  onContextRestored?: () => void,
): CursorGridEngine | null;
