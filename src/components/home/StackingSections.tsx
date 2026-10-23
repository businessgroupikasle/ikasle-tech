"use client";

import { createContext, useContext, useRef, useState, type ComponentProps, type ReactNode } from "react";
import { FireworksBackground } from "@/components/animate-ui/backgrounds/fireworks";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";

const CoveredContext = createContext<readonly boolean[]>([]);

/** True while stacking layer `index` is fully covered by the layer above it (so its animations can pause). */
export const useLayerCovered = (index: number) => useContext(CoveredContext)[index] ?? false;

/**
 * Book-style stacking: each direct child marked `data-stack-layer` slides up over the one before it.
 *
 * Mark layers `data-stack-layer="0"`, `"1"`, … in order. Every layer but the last is CSS-sticky (`.stack-sticky`), with z-index rising in DOM order; the next layer, in
 * normal flow above it, covers it at exactly the scroll speed and uncovers it when scrolling back. Being native
 * scrolling it can't lag, jump or trap, needs no pin spacers, and costs no per-frame JavaScript. The last layer
 * is not sticky, so it can be any height and the page carries on into the next section; the layers underneath
 * end aligned with its bottom edge, so they never show below it.
 *
 * - Sticky offset (`--stick-N` on the wrapper, mapped to layer N in CSS — never written onto the layers, which
 *   may not have hydrated yet): a layer taller than the screen scrolls until its bottom is in view, then holds,
 *   so all of it is seen before it's covered. Unset (no JS) it is far negative, i.e. no stacking (progressive), and
 *   reduced motion keeps plain document flow (the sticky styles are motion-safe only).
 * - One ScrollTrigger per transition reports when a layer is fully covered, so its loops can pause: an
 *   IntersectionObserver still sees a covered sticky element as in view. State changes only on those toggles.
 * - Keyboard: focusing something under the next layer scrolls its own layer back into view.
 */
export function StackingSections({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const [covered, setCovered] = useState<readonly boolean[]>([]);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const layers = [...el.children].filter((c): c is HTMLElement => c instanceof HTMLElement && c.hasAttribute("data-stack-layer"));
      if (layers.length < 2) return;

      const fit = () => {
        layers.slice(0, -1).forEach((layer, i) => {
          el.style.setProperty(`--stick-${i}`, `${Math.min(0, window.innerHeight - layer.offsetHeight)}px`);
        });
      };
      fit();
      // Layer heights change without a window resize (fonts, images, folders), which moves the trigger points.
      const ro = new ResizeObserver(() => {
        fit();
        ScrollTrigger.refresh();
      });
      layers.forEach((layer) => ro.observe(layer));
      window.addEventListener("resize", fit);

      const state = layers.map(() => false);
      layers.slice(1).forEach((next, i) => {
        ScrollTrigger.create({
          trigger: next,
          // 1px early: at exactly "top top" the trigger isn't active yet, though the layer is already covered.
          start: "top top+=1",
          end: "max",
          onToggle: (self) => {
            state[i] = self.isActive;
            setCovered([...state]);
          },
        });
      });

      const flowTop = (k: number) => el.getBoundingClientRect().top + window.scrollY + layers.slice(0, k).reduce((sum, l) => sum + l.offsetHeight, 0);
      const onFocus = (e: FocusEvent) => {
        const target = e.target as HTMLElement;
        const i = layers.findIndex((layer) => layer.contains(target));
        const next = layers[i + 1];
        if (i < 0 || !next || target.getBoundingClientRect().bottom <= next.getBoundingClientRect().top) return;
        const within = target.getBoundingClientRect().top - layers[i]!.getBoundingClientRect().top;
        window.scrollTo({ top: Math.max(0, Math.min(flowTop(i) + within - window.innerHeight / 3, flowTop(i + 1) - window.innerHeight)) });
      };
      el.addEventListener("focusin", onFocus);

      return () => {
        ro.disconnect();
        window.removeEventListener("resize", fit);
        el.removeEventListener("focusin", onFocus);
      };
    },
    { scope: root },
  );

  return (
    <CoveredContext.Provider value={covered}>
      <div ref={root} className="relative">
        {children}
      </div>
    </CoveredContext.Provider>
  );
}

/** The hero fireworks (stacking layer 0), paused while the hero is covered. */
export function HeroFireworks(props: Omit<ComponentProps<typeof FireworksBackground>, "paused">) {
  return <FireworksBackground {...props} paused={useLayerCovered(0)} />;
}
