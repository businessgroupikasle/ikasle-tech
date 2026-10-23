"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, MOTION_OK } from "@/lib/gsap";

/**
 * Section reveal: the block rises in once as it enters the viewport.
 *
 * Progressive: the server HTML is fully visible, and stays so without JS or with reduced motion. A block is only
 * hidden by its own effect — after it has hydrated (so React never sees the inline style as a mismatch), and only
 * if it is still below the fold, so nothing on the current screen can flash or stay blank. Opacity (never
 * visibility) keeps links inside focusable; tabbing to one scrolls it in, which reveals it. An IntersectionObserver
 * rather than ScrollTrigger start positions means layout that settles later above can't leave a block waiting.
 *
 * Wrap blocks that own no transform animation of their own, and never an ancestor of a sticky or pinned element.
 */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia(MOTION_OK).matches || typeof IntersectionObserver === "undefined") return;
    // Already on screen, or focused before this hydrated (e.g. mid smooth-scroll to a tabbed link): stay visible.
    if (el.getBoundingClientRect().top <= window.innerHeight || el.contains(document.activeElement)) return;

    gsap.set(el, { opacity: 0, y: 40 });
    const reveal = () => {
      io.disconnect();
      el.removeEventListener("focusin", reveal);
      gsap.to(el, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", clearProps: "opacity,transform" });
    };
    const io = new IntersectionObserver(([entry]) => entry?.isIntersecting && reveal(), { rootMargin: "0px 0px -8% 0px" });
    io.observe(el);
    // Focus scrolls a link only to the viewport edge (inside the margin above), so focusing reveals directly.
    el.addEventListener("focusin", reveal);

    return () => {
      io.disconnect();
      el.removeEventListener("focusin", reveal);
      gsap.killTweensOf(el);
      gsap.set(el, { clearProps: "opacity,transform" });
    };
  }, []);

  return (
    <div ref={ref} data-reveal className={className}>
      {children}
    </div>
  );
}
