"use client";

import { useSyncExternalStore } from "react";

let cached: boolean | null = null;

function detect(): boolean {
  if (cached !== null) return cached;
  try {
    const gl = document.createElement("canvas").getContext("webgl2");
    cached = Boolean(gl);
    gl?.getExtension("WEBGL_lose_context")?.loseContext(); // release the probe context immediately
  } catch {
    cached = false;
  }
  return cached;
}

const noopSubscribe = () => () => {};

/** `null` on the server / before hydration, then whether WebGL2 is usable. */
export function useWebGL2Support(): boolean | null {
  return useSyncExternalStore<boolean | null>(noopSubscribe, detect, () => null);
}
