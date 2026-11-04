"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";
import { useWebGL2Support } from "@/hooks/useWebGL2Support";
import { cn } from "@/lib/cn";
import type { HeroLogoRenderer } from "./heroLogoRenderer";
import { useLayerCovered } from "./StackingSections";
import "./HeroScene.css";

const LOGO = { src: "/brand/ikasle-hero-logo.webp", w: 1440, h: 472 };
/** Share of the stage width the logo fills when facing the viewer. The static image and the 3D render must match. */
const LOGO_WIDTH = 0.7;

/** Seconds per half turn. The render shows the same readable face on both sides, so this is how often it faces front. */
const HALF_TURN = 9;
/** How strongly rotation slows when facing the viewer and speeds up edge-on: 0 is constant, below 1 never stops. */
const DWELL = 0.84;
/** Quality steps tried in turn when frames run slow, before falling back to the static logo. */
const QUALITY = [1, 0.75, 0.55];
const SLOW_FRAME_MS = 30;
/** Slow measurements in a row needed to step down, so a passing hiccup can't lower the quality for good. */
const SLOW_WINDOWS = 3;

/** Turns elapsed time into a yaw that keeps turning but lingers on the readable angle. Folded so the face always reads correctly. */
function yawAt(time: number, offset: number) {
  const w = Math.PI / HALF_TURN;
  const yaw = w * time - (DWELL / 2) * Math.sin(2 * w * time) + offset;
  return ((((yaw + Math.PI / 2) % Math.PI) + Math.PI) % Math.PI) - Math.PI / 2;
}

const RINGS = [
  { size: "92cqw", pitch: "76deg", roll: "-11deg", speed: "15s", particles: [0, 150, 245] },
  { size: "72cqw", pitch: "70deg", roll: "13deg", speed: "21s", particles: [60, 220], reverse: true },
] as const;

function Orbits({ half }: { half: "back" | "front" }) {
  return (
    <>
      {RINGS.map((ring) => (
        <div key={ring.size} className="hs-orbit-clip" style={{ "--roll": ring.roll } as CSSProperties}>
          <div className="hs-orbit-cut" data-half={half}>
            <div className="hs-orbit" style={{ "--size": ring.size, "--pitch": ring.pitch } as CSSProperties}>
              <div className="hs-orbit-line" />
              <div className="hs-orbit-spin" style={{ "--speed": ring.speed, "--dir": "reverse" in ring ? "reverse" : "normal" } as CSSProperties}>
                <div className="hs-orbit-comet" />
                {ring.particles.map((angle) => (
                  <span key={angle} className="absolute inset-0" style={{ transform: `rotate(${angle}deg)` }}>
                    <span className="hs-particle" />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

/**
 * The hero's right side: the real logo as a rotating 3D object over an animated platform, with orbital rings and
 * floating code cards. The logo image is rendered by the server and stays until the 3D render has drawn, so the
 * largest paint never waits on WebGL. Without WebGL2, on slow hardware or with reduced motion, the image simply stays.
 * One animation frame loop drives the render and the pointer parallax, and it stops while the hero is out of sight.
 */
export function HeroLogo() {
  const covered = useLayerCovered(0);
  const reduced = usePrefersReducedMotion();
  const webgl2 = useWebGL2Support();
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawn, setDrawn] = useState(false);
  const [failed, setFailed] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const wakeRef = useRef<(() => void) | null>(null);

  const coveredRef = useRef(covered);
  const onScreenRef = useRef(onScreen);
  useEffect(() => {
    coveredRef.current = covered;
    onScreenRef.current = onScreen;
  }, [covered, onScreen]);

  useEffect(() => {
    if (!covered && onScreen && !document.hidden) wakeRef.current?.();
  }, [covered, onScreen]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(Boolean(entry?.isIntersecting)));
    io.observe(stage);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (reduced || !stage || !canvas) return;

    let alive = true;
    let renderer: HeroLogoRenderer | null = null;
    let raf = 0;
    let last = 0;
    let time = 0;
    let quality = 0;
    let slowSum = 0;
    let slowCount = 0;
    let slowWindows = 0;
    let settleUntil = 0;
    const pointer = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };
    const layers = [...stage.querySelectorAll<HTMLElement>("[data-depth]")].map((el) => ({ el, depth: Number(el.dataset.depth) }));

    const fit = () => {
      if (!renderer) return;
      // Layout size, not getBoundingClientRect: the entrance animation scales the stage while this first runs.
      renderer.resize(canvas.clientWidth, canvas.clientHeight, Math.min(window.devicePixelRatio || 1, 1.5) * QUALITY[quality]!);
    };

    const giveUp = () => {
      renderer?.dispose();
      renderer = null;
      setDrawn(false);
      setFailed(true);
    };

    const frame = (now: number) => {
      raf = 0;
      if (coveredRef.current || !onScreenRef.current || document.hidden) {
        last = 0;
        return;
      }
      const elapsed = last ? now - last : 16;
      const dt = Math.min(elapsed, 50) / 1000;
      last = now;
      time += dt;

      const k = 1 - Math.exp(-dt * 4.5);
      eased.x += (pointer.x - eased.x) * k;
      eased.y += (pointer.y - eased.y) * k;
      for (const { el, depth } of layers) {
        el.style.transform = `translate3d(${(eased.x * depth).toFixed(2)}px, ${(eased.y * depth * 0.7).toFixed(2)}px, 0)`;
      }

      if (!renderer) {
        raf = requestAnimationFrame(frame);
        return;
      }
      const tilt = 0.1 + Math.sin(time * 0.45) * 0.07 + eased.y * 0.16;
      renderer.draw(yawAt(time, eased.x * 0.22), tilt, time);

      // Step quality down only if this device keeps failing to keep up; give each new size a moment to take effect.
      if (now > settleUntil) {
        slowSum += Math.min(elapsed, 120);
        slowCount++;
        if (slowCount === 40) {
          slowWindows = slowSum / slowCount > SLOW_FRAME_MS ? slowWindows + 1 : 0;
          slowSum = 0;
          slowCount = 0;
          if (slowWindows === SLOW_WINDOWS) {
            slowWindows = 0;
            if (quality < QUALITY.length - 1) {
              quality++;
              fit();
              settleUntil = now + 1000;
            } else {
              giveUp();
            }
          }
        }
      }
      raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      if (!raf && alive && !coveredRef.current && onScreenRef.current && !document.hidden) {
        raf = requestAnimationFrame(frame);
      }
    };
    wakeRef.current = wake;
    const onVisibility = () => wake();

    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointer.x = event.clientX / window.innerWidth - 0.5;
      pointer.y = event.clientY / window.innerHeight - 0.5;
    };
    const onLost = (event: Event) => {
      event.preventDefault();
      giveUp();
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    canvas.addEventListener("webglcontextlost", onLost);
    const resize = new ResizeObserver(fit);
    resize.observe(canvas);
    wake();

    if (webgl2 && !failed) {
      import("./heroLogoRenderer")
        .then(({ createHeroLogoRenderer }) => createHeroLogoRenderer(canvas, LOGO.src, LOGO_WIDTH))
        .then((created) => {
          if (!alive) {
            created.dispose();
            return;
          }
          renderer = created;
          fit();
          renderer.draw(yawAt(time, 0), 0.1, time);
          settleUntil = performance.now() + 4000; // shader warm-up and the rest of the page loading aren't a fair measure
          setDrawn(true);
          wake();
        })
        .catch(() => alive && setFailed(true));
    }

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      if (wakeRef.current === wake) wakeRef.current = null;
      resize.disconnect();
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onLost);
      renderer?.dispose();
    };
  }, [reduced, webgl2, failed]);

  return (
    <div ref={stageRef} className={cn("hs-stage hs-enter relative mx-auto aspect-[5/4] w-full max-w-[600px] sm:aspect-[4/3]", covered && "hs-paused")}>
      <div className="hs-layer" data-depth="-10" aria-hidden="true">
        <div className="hs-halo" />
        <div className="hs-floor-shadow" />
        <div className="hs-platform">
          <div className="hs-disc hs-disc-rim" />
          <div className="hs-disc hs-disc-ticks" />
          <div className="hs-disc hs-disc-glass" />
          <div className="hs-disc hs-disc-sweep" />
          <div className="hs-disc hs-disc-pulse" />
        </div>
        <div className="hs-beam" />
      </div>

      <div className="hs-layer" data-depth="-16" aria-hidden="true">
        <div className="hs-card-pos top-[6%] left-[1%] w-[27%]">
          <div className="hs-float-card" style={{ "--t": "6.5s", "--r": "-3deg" } as CSSProperties}>
            <div className="hs-card" style={{ "--d": "-1s" } as CSSProperties}>
              <span className="hs-card-symbol" style={{ "--d": "-1s" } as CSSProperties}>&lt;/&gt;</span>
              <span className="hs-card-line" style={{ width: "86%", "--d": "-1.5s" } as CSSProperties} />
              <span className="hs-card-line" style={{ width: "60%", "--d": "-3s" } as CSSProperties} />
              <span className="hs-card-line" style={{ width: "74%" } as CSSProperties} />
              <span className="hs-card-shine" style={{ "--d": "-2s" } as CSSProperties} />
            </div>
          </div>
        </div>
      </div>

      <div className="hs-layer" data-depth="-6" aria-hidden="true">
        <Orbits half="back" />
      </div>

      {/* The logo: floats as one unit, so the static image and the render can never drift apart. */}
      <div className="hs-layer" data-depth="10">
        <div className="hs-layer hs-float" style={{ top: "-8%", bottom: "8%" }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: `${LOGO_WIDTH * 100}%`, aspectRatio: `${LOGO.w} / ${LOGO.h}` }}>
            <Image
              src={LOGO.src}
              alt="IKASLE Technologies"
              width={LOGO.w}
              height={LOGO.h}
              priority
              sizes="(min-width: 1024px) 420px, (min-width: 640px) 60vw, 70vw"
              className={cn("h-full w-full object-contain transition-opacity duration-500 select-none", drawn && "opacity-0")}
              draggable={false}
            />
          </div>
          <canvas ref={canvasRef} className={cn("absolute inset-0 size-full transition-opacity duration-500", drawn ? "opacity-100" : "opacity-0")} aria-hidden="true" />
        </div>
      </div>

      <div className="hs-layer" data-depth="16" aria-hidden="true">
        <Orbits half="front" />
      </div>

      <div className="hs-layer" data-depth="26" aria-hidden="true">
        <div className="hs-card-pos top-[3%] right-[0%] w-[33%]">
          <div className="hs-float-card" style={{ "--t": "7.5s", "--d": "-3s", "--r": "3deg" } as CSSProperties}>
            <div className="hs-card">
              <span className="hs-card-dots"><i /><i /><i /></span>
              <span className="hs-card-code"><b>const</b> idea = vision();</span>
              <span className="hs-card-code"><b>await</b> build(idea);</span>
              <span className="hs-card-code">deploy()<span className="hs-caret" /></span>
              <span className="hs-card-shine" style={{ "--d": "-4s" } as CSSProperties} />
            </div>
          </div>
        </div>

        {/* On phones this corner sits under the WhatsApp and chat buttons. */}
        <div className="hs-card-pos right-[2%] bottom-[3%] hidden w-[25%] xs:block">
          <div className="hs-float-card" style={{ "--t": "5.5s", "--d": "-1.5s", "--r": "-2deg" } as CSSProperties}>
            <div className="hs-card">
              <span className="hs-card-symbol" style={{ "--d": "-2.5s" } as CSSProperties}>{"{ }"}</span>
              <span className="hs-card-line" style={{ width: "78%", "--d": "-2s" } as CSSProperties} />
              <span className="hs-card-line" style={{ width: "52%", "--d": "-4s" } as CSSProperties} />
              <span className="hs-card-shine" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
