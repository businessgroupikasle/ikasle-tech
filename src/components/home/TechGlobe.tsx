"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { techCategories, techCategoryLabel, techCountByCategory, techUniverse, type TechCategoryId, type TechIcon, type TechItem } from "@/data/tech-universe";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/cn";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";
import { useLayerCovered } from "./StackingSections";
import { TechTooltip, type OrbitTooltipInfo } from "./TechTooltip";

/*
 * Technology Universe — an interactive 3D globe of the IKASLE stack.
 *
 * Rendering: a 2D canvas draws the wireframe sphere (front and back half split, so the back stays faint), and every
 * technology is a real <button> projected onto the sphere surface. One rAF loop owns all motion and writes styles
 * straight to the DOM through refs; React state only changes on discrete events (filter, hover, selection), so the
 * scene is never rebuilt. The loop stops while the section is offscreen or covered by the next stacking layer.
 */

type Filter = "all" | TechCategoryId;

/** Round-robin by category so each category is spread over the whole sphere, not packed into one latitude band. */
const ORDERED: TechItem[] = (() => {
  const buckets = techCategories.map((c) => techUniverse.filter((t) => t.category === c.id));
  const longest = Math.max(...buckets.map((b) => b.length));
  const out: TechItem[] = [];
  for (let i = 0; i < longest; i++) {
    for (const b of buckets) {
      const t = b[i];
      if (t) out.push(t);
    }
  }
  return out;
})();

/** Deterministic Fibonacci-sphere positions (unit vectors). The half-step offset keeps nodes off the exact poles. */
const POINTS: readonly (readonly [number, number, number])[] = (() => {
  const golden = Math.PI * (3 - Math.sqrt(5));
  const n = ORDERED.length;
  return ORDERED.map((_, i) => {
    const y = 1 - ((i + 0.5) / n) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    return [Math.cos(theta) * r, y, Math.sin(theta) * r] as const;
  });
})();

/** Wireframe: latitude rings every 15° and 12 great circles (= 24 meridians), sampled as unit-sphere polylines. */
const SEG = 72;
const RINGS: Float32Array[] = (() => {
  const rings: Float32Array[] = [];
  for (let lat = -75; lat <= 75; lat += 15) {
    const a = (lat * Math.PI) / 180;
    const ring = new Float32Array((SEG + 1) * 3);
    for (let k = 0; k <= SEG; k++) {
      const t = (k / SEG) * Math.PI * 2;
      ring.set([Math.cos(t) * Math.cos(a), Math.sin(a), Math.sin(t) * Math.cos(a)], k * 3);
    }
    rings.push(ring);
  }
  for (let m = 0; m < 12; m++) {
    const phi = (m / 12) * Math.PI;
    const ring = new Float32Array((SEG + 1) * 3);
    for (let k = 0; k <= SEG; k++) {
      const t = (k / SEG) * Math.PI * 2;
      ring.set([Math.sin(t) * Math.cos(phi), Math.cos(t), Math.sin(t) * Math.sin(phi)], k * 3);
    }
    rings.push(ring);
  }
  return rings;
})();

const FOCAL = 4.5; // camera distance in sphere radii (perspective strength)
const REST_PITCH = 0.32;
const AUTO_SPEED = 0.16; // rad/s
const DIMMED = 0.14; // opacity multiplier for technologies outside the active category

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const wrapAngle = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

/** Brand mark, wordmark tile or neutral practice icon. Decorative: the button carries the accessible name. */
function Glyph({ icon, className }: { icon: TechIcon; className?: string }) {
  if (icon.kind === "brand") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
        <path d={icon.path} fill={icon.hex} />
      </svg>
    );
  }
  if (icon.kind === "wordmark") {
    return (
      <span className={cn("flex items-center justify-center font-mono leading-none font-bold", className)} style={{ color: icon.fg }} aria-hidden="true">
        {icon.text}
      </span>
    );
  }
  const I = icon.Icon;
  return <I className={className} strokeWidth={1.75} color={brand.blueAction} aria-hidden="true" />;
}

/** Tile backgrounds: white for brand marks, the wordmark's own colour, and a soft blue tint for practices. */
function tileStyle(icon: TechIcon) {
  if (icon.kind === "wordmark") return { background: icon.bg, borderColor: icon.bg };
  if (icon.kind === "concept") return { background: brand.blueLight, borderColor: "rgb(0 140 248 / 0.25)" };
  return { background: "#FFFFFF", borderColor: brand.line };
}

function LogoBadge({ icon, size }: { icon: TechIcon; size: number }) {
  return (
    <span className="inline-flex shrink-0 items-center justify-center rounded-lg border shadow-sm" style={{ ...tileStyle(icon), width: size, height: size }}>
      <Glyph icon={icon} className={icon.kind === "wordmark" ? "text-[11px]" : "size-[58%]"} />
    </span>
  );
}

const accentFor = (icon: TechIcon) => (icon.kind === "brand" ? icon.hex : icon.kind === "wordmark" ? icon.fg : brand.blue);

export function TechGlobe() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<number | null>(null);
  const [tip, setTip] = useState<number | null>(null);
  const [roving, setRoving] = useState(0);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);

  const reduced = usePrefersReducedMotion();
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const covered = useLayerCovered(1);

  /** Mutable animation state — read and written by the loop and pointer handlers, never by render. */
  const st = useRef({
    yaw: 0.6,
    pitch: REST_PITCH,
    vYaw: 0,
    vPitch: 0,
    speed: 0,
    target: null as { yaw: number; pitch: number } | null,
    emph: new Float32Array(ORDERED.length).fill(1),
    size: 0,
    R: 0,
    tile: 32,
    dirty: true,
    hovered: -1,
    selected: -1,
    filter: "all" as Filter,
    reduced: false,
    // drag
    down: false,
    dragging: false,
    dragMoved: false,
    pointerId: -1,
    pointerType: "mouse",
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    lastT: 0,
  });

  // Mirror discrete React state into the loop's state.
  useEffect(() => {
    const s = st.current;
    s.filter = filter;
    s.selected = selected ?? -1;
    s.reduced = reduced;
    s.dirty = true;
  }, [filter, selected, reduced]);

  /** Rotation that brings node `i` to the front of the globe. */
  const bringToFront = useCallback((i: number) => {
    const s = st.current;
    const [x, y, z] = POINTS[i]!;
    const yaw = Math.atan2(-x, z);
    const z1 = Math.hypot(x, z);
    const pitch = Math.max(-0.9, Math.min(0.9, Math.atan2(y, z1)));
    s.vYaw = 0;
    s.vPitch = 0;
    if (s.reduced) {
      s.yaw = yaw;
      s.pitch = pitch;
      s.target = null;
      s.dirty = true;
    } else {
      s.target = { yaw, pitch };
    }
  }, []);

  // Size: canvas backing store (DPR capped at 2), sphere radius and tile size scale with the stage.
  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;
    const ro = new ResizeObserver(() => {
      const size = stage.clientWidth;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      canvas.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);
      const s = st.current;
      s.size = size;
      s.R = size * 0.42;
      s.tile = Math.round(Math.min(58, Math.max(38, s.R * 0.2)));
      stage.style.setProperty("--tile", `${s.tile}px`);
      s.dirty = true;
    });
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const update = () => setPageVisible(!document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  // Only animate while on screen.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const io = new IntersectionObserver(([e]) => setInView(Boolean(e?.isIntersecting)), { rootMargin: "100px" });
    io.observe(stage);
    return () => io.disconnect();
  }, []);

  // The single animation loop.
  useEffect(() => {
    if (!inView || covered || !pageVisible) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const s = st.current;
    const scratch = RINGS.map((r) => new Float32Array(r.length));
    let raf = 0;
    let last = performance.now();

    const draw = () => {
      const { R, size } = s;
      if (!R) return;
      const c = size / 2;
      const cy = Math.cos(s.yaw);
      const sy = Math.sin(s.yaw);
      const cp = Math.cos(s.pitch);
      const sp = Math.sin(s.pitch);

      // Wireframe: rotate every sample once, then stroke back and front halves as two batched paths.
      ctx.clearRect(0, 0, size, size);
      RINGS.forEach((ring, r) => {
        const out = scratch[r]!;
        for (let k = 0; k < ring.length; k += 3) {
          const x = ring[k]!;
          const y = ring[k + 1]!;
          const z = ring[k + 2]!;
          const x1 = x * cy + z * sy;
          const z1 = -x * sy + z * cy;
          const y2 = y * cp - z1 * sp;
          const z2 = y * sp + z1 * cp;
          const p = FOCAL / (FOCAL - z2);
          out[k] = c + x1 * R * p;
          out[k + 1] = c - y2 * R * p;
          out[k + 2] = z2;
        }
      });
      for (const front of [false, true]) {
        ctx.beginPath();
        for (const out of scratch) {
          for (let k = 0; k < out.length - 3; k += 3) {
            if (out[k + 2]! + out[k + 5]! >= 0 !== front) continue;
            ctx.moveTo(out[k]!, out[k + 1]!);
            ctx.lineTo(out[k + 3]!, out[k + 4]!);
          }
        }
        ctx.strokeStyle = front ? "rgba(0,140,248,0.34)" : "rgba(0,140,248,0.09)";
        ctx.lineWidth = front ? 1.1 : 1;
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(c, c, R, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0,140,248,0.45)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Nodes: perspective projection, depth scale/opacity, horizon fade, back half hidden.
      const half = s.tile / 2;
      for (let i = 0; i < POINTS.length; i++) {
        const el = nodeRefs.current[i];
        if (!el) continue;
        const [x, y, z] = POINTS[i]!;
        const x1 = x * cy + z * sy;
        const z1 = -x * sy + z * cy;
        const y2 = y * cp - z1 * sp;
        const z2 = y * sp + z1 * cp;
        const p = FOCAL / (FOCAL - z2);
        const vis = smoothstep(-0.1, 0.32, z2);
        const scale = (0.55 + 0.45 * ((z2 + 1) / 2)) * p;
        const focus = i === s.hovered || i === s.selected;
        el.style.transform = `translate3d(${(c + x1 * R * p - half).toFixed(1)}px,${(c - y2 * R * p - half).toFixed(1)}px,0) scale(${scale.toFixed(3)})`;
        el.style.opacity = (focus ? vis : vis * s.emph[i]!).toFixed(3);
        el.style.zIndex = String(Math.round(200 + z2 * 100));
        // Opacity (not visibility) hides the back half, so arrow-key focus can still reach a node and turn it forward.
        el.style.pointerEvents = vis > 0.5 ? "auto" : "none";
        const label = labelRefs.current[i];
        if (label) label.style.opacity = (focus ? 1 : smoothstep(0.84, 0.97, z2) * (s.emph[i]! > 0.6 ? 1 : 0)).toFixed(3);
      }
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      let moving = false;

      // Auto-rotation eases out while the visitor hovers, drags, inspects a node, or the globe is turning to one.
      const busy = s.hovered >= 0 || s.selected >= 0 || s.dragging || s.target !== null;
      const want = s.reduced || busy ? 0 : AUTO_SPEED;
      s.speed += (want - s.speed) * Math.min(1, dt * 4);

      if (s.target) {
        const dy = wrapAngle(s.target.yaw - s.yaw);
        const dp = s.target.pitch - s.pitch;
        const k = Math.min(1, dt * 6);
        s.yaw += dy * k;
        s.pitch += dp * k;
        if (Math.abs(dy) < 0.002 && Math.abs(dp) < 0.002) s.target = null;
        moving = true;
      } else if (!s.dragging) {
        const before = s.yaw + s.pitch;
        s.yaw += (s.speed + s.vYaw) * dt;
        s.pitch = Math.max(-0.9, Math.min(0.9, s.pitch + s.vPitch * dt));
        const decay = Math.exp(-dt * 3);
        s.vYaw *= decay;
        s.vPitch *= decay;
        if (Math.abs(s.vYaw) < 0.001) s.vYaw = 0;
        if (Math.abs(s.vPitch) < 0.001) s.vPitch = 0;
        moving = s.yaw + s.pitch !== before;
      }
      s.yaw = wrapAngle(s.yaw);

      // Category emphasis fades instead of snapping.
      for (let i = 0; i < ORDERED.length; i++) {
        const goal = s.filter === "all" || ORDERED[i]!.category === s.filter ? 1 : DIMMED;
        const e = s.emph[i]!;
        if (Math.abs(goal - e) > 0.002) {
          s.emph[i] = e + (goal - e) * Math.min(1, dt * 8);
          moving = true;
        } else s.emph[i] = goal;
      }

      if (moving || s.dirty) {
        s.dirty = false;
        draw();
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [inView, covered, pageVisible]);

  // ── Drag to rotate (mouse: both axes; touch: horizontal only, so vertical swipes still scroll the page) ──
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const s = st.current;
    Object.assign(s, { down: true, dragging: false, dragMoved: false, pointerId: e.pointerId, pointerType: e.pointerType, startX: e.clientX, startY: e.clientY, lastX: e.clientX, lastY: e.clientY, lastT: e.timeStamp, vYaw: 0, vPitch: 0, target: null });
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = st.current;
    if (!s.down || e.pointerId !== s.pointerId) return;
    if (!s.dragging) {
      if (Math.hypot(e.clientX - s.startX, e.clientY - s.startY) < 6) return;
      s.dragging = true;
      s.dragMoved = true;
      s.hovered = -1;
      setTip(null);
      // Capture only once it is a drag, so a plain click still reaches the technology button.
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    const R = s.R || 200;
    const dx = (e.clientX - s.lastX) / R;
    const dy = s.pointerType === "touch" ? 0 : (e.clientY - s.lastY) / R;
    const dt = Math.max(0.008, (e.timeStamp - s.lastT) / 1000);
    s.yaw += dx;
    s.pitch = Math.max(-0.9, Math.min(0.9, s.pitch + dy));
    s.vYaw = s.reduced ? 0 : dx / dt;
    s.vPitch = s.reduced ? 0 : dy / dt;
    s.lastX = e.clientX;
    s.lastY = e.clientY;
    s.lastT = e.timeStamp;
    s.dirty = true;
  };
  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = st.current;
    if (e.pointerId !== s.pointerId) return;
    if (e.timeStamp - s.lastT > 80) {
      s.vYaw = 0;
      s.vPitch = 0;
    }
    s.down = false;
    s.dragging = false;
  };
  /** Swallow the click that ends a drag; a click on empty globe space closes the details panel. */
  const onClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    const s = st.current;
    if (s.dragMoved) {
      s.dragMoved = false;
      e.stopPropagation();
      e.preventDefault();
      return;
    }
    if (!(e.target as Element).closest("[data-orbit-item]")) setSelected(null);
  };

  // ── Node interactions ──
  const hover = (i: number) => {
    st.current.hovered = i;
    st.current.dirty = true;
    setTip(i);
  };
  const unhover = (i: number) => {
    if (st.current.hovered !== i) return;
    st.current.hovered = -1;
    st.current.dirty = true;
    setTip(null);
  };
  const select = (i: number, viaKeyboard: boolean) => {
    setTip(null);
    if (selected === i) {
      setSelected(null);
      return;
    }
    setSelected(i);
    setRoving(i);
    bringToFront(i);
    if (viaKeyboard) requestAnimationFrame(() => document.getElementById("tech-detail-close")?.focus());
  };

  /** Arrow keys move between the technologies in the active category (one Tab stop for the whole globe). */
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"];
    if (!keys.includes(e.key)) return;
    const list = ORDERED.map((_, i) => i).filter((i) => filter === "all" || ORDERED[i]!.category === filter);
    if (!list.length) return;
    e.preventDefault();
    const at = Math.max(0, list.indexOf(roving));
    const next =
      e.key === "Home" ? list[0]! : e.key === "End" ? list[list.length - 1]! : list[(at + (e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1) + list.length) % list.length]!;
    setRoving(next);
    nodeRefs.current[next]?.focus();
  };

  // Escape closes the details panel.
  useEffect(() => {
    if (selected === null) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  const changeFilter = (f: Filter) => {
    setFilter(f);
    setSelected(null);
    if (f !== "all") {
      const first = ORDERED.findIndex((t) => t.category === f);
      if (first >= 0) setRoving(first);
    }
  };

  const tipItem = tip !== null ? ORDERED[tip] : undefined;
  const tipInfo: OrbitTooltipInfo | null = tipItem
    ? {
        index: tip!,
        name: tipItem.name,
        category: techCategoryLabel[tipItem.category],
        description: tipItem.description,
        hex: accentFor(tipItem.icon),
        logo: <LogoBadge icon={tipItem.icon} size={30} />,
      }
    : null;
  const detail = selected !== null ? ORDERED[selected] : undefined;
  const activeCount = filter === "all" ? techUniverse.length : techCountByCategory[filter];
  const activeLabel = filter === "all" ? "All technologies" : techCategoryLabel[filter];

  return (
    <div className="flex flex-col items-center">
      {/* Status */}
      <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-center font-mono text-[11.5px] tracking-wide text-ink-soft">
        <span className="whitespace-nowrap">
          <span className="text-accent-strong">{techUniverse.length}</span> technologies &amp; practices
        </span>
        <span className="text-line max-sm:hidden" aria-hidden="true">
          |
        </span>
        <span aria-live="polite" className="whitespace-nowrap">
          {activeLabel} — <span className="text-ink">{activeCount}</span>
        </span>
      </p>

      {/* Category filter: scrolls sideways below 1024px, wraps on desktop. */}
      <div className="mt-4 w-full">
        <ul aria-label="Filter technologies by category" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-wrap lg:justify-center lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
          {(["all", ...techCategories.map((c) => c.id)] as Filter[]).map((f) => {
            const active = f === filter;
            return (
              <li key={f} className="shrink-0">
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => changeFilter(f)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-medium whitespace-nowrap transition-[background-color,border-color,color] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                    active ? "border-accent-strong bg-accent-strong text-white" : "border-line bg-white/80 text-ink-soft hover:border-accent/40 hover:text-ink",
                  )}
                >
                  {f === "all" ? "All" : techCategoryLabel[f]}
                  <span className={cn("font-mono text-[10.5px]", active ? "text-white/75" : "text-ink-soft/70")}>{f === "all" ? techUniverse.length : techCountByCategory[f]}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Globe */}
      <div className="relative mt-4 w-full">
        <div
          ref={stageRef}
          role="group"
          aria-label="Technology globe. Use the arrow keys to move between technologies and Enter for details."
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={onClickCapture}
          onKeyDown={onKeyDown}
          className="relative mx-auto aspect-square w-full max-w-[min(100%,640px)] cursor-grab touch-pan-y select-none active:cursor-grabbing md:w-[min(640px,max(340px,calc(100svh_-_var(--header-h)_-_290px)))]"
        >
          {/* Soft illumination behind the sphere */}
          <div className="pointer-events-none absolute inset-[6%] rounded-full bg-[radial-gradient(circle_at_50%_45%,rgb(0_140_248/0.16),rgb(0_140_248/0.05)_45%,transparent_70%)]" aria-hidden="true" />
          {/* Tilted orbit ring decoration */}
          <svg className="pointer-events-none absolute inset-0 size-full" viewBox="0 0 100 100" aria-hidden="true">
            <ellipse cx="50" cy="50" rx="48" ry="13" fill="none" stroke={brand.blue} strokeOpacity="0.28" strokeWidth="0.25" strokeDasharray="1.2 1.4" transform="rotate(-14 50 50)" />
          </svg>
          <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 size-full" aria-hidden="true" />
          {/* Brand core: sits between the back and front halves of the globe. */}
          <div className="pointer-events-none absolute inset-0 z-200 flex items-center justify-center" aria-hidden="true">
            <Image src="/brand/ikasle-technologies-logo.png" alt="" width={1600} height={552} sizes="200px" className="h-auto w-[24%] opacity-60 select-none" draggable={false} />
          </div>

          {ORDERED.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => {
                nodeRefs.current[i] = el;
              }}
              type="button"
              data-orbit-item={i}
              data-selected={selected === i || undefined}
              aria-label={`${t.name}, ${techCategoryLabel[t.category]}`}
              aria-expanded={selected === i}
              tabIndex={i === roving ? 0 : -1}
              onClick={(e) => select(i, e.detail === 0)}
              onPointerEnter={(e) => e.pointerType === "mouse" && hover(i)}
              onPointerLeave={(e) => e.pointerType === "mouse" && unhover(i)}
              onFocus={(e) => {
                setRoving(i);
                if (e.currentTarget.matches(":focus-visible")) {
                  bringToFront(i);
                  hover(i);
                }
              }}
              onBlur={() => unhover(i)}
              className="group absolute top-0 left-0 size-(--tile) origin-center opacity-0 outline-none will-change-transform"
            >
              <span
                className="orbit-item flex size-full items-center justify-center rounded-[28%] border shadow-[0_4px_14px_-6px_rgb(8_40_60/0.35)] transition-[transform,box-shadow] duration-200 group-hover:scale-[1.18] group-hover:shadow-[0_0_0_3px_rgb(0_140_248/0.25),0_8px_20px_-8px_rgb(0_140_248/0.6)] group-focus-visible:shadow-[0_0_0_3px_rgb(0_140_248/0.55)] group-data-selected:scale-[1.18] group-data-selected:shadow-[0_0_0_3px_rgb(0_140_248/0.45)]"
                style={tileStyle(t.icon)}
              >
                <Glyph icon={t.icon} className={t.icon.kind === "wordmark" ? "text-[length:calc(var(--tile)*0.38)]" : "size-[68%]"} />
              </span>
              <span
                ref={(el) => {
                  labelRefs.current[i] = el;
                }}
                className="pointer-events-none absolute top-full left-1/2 mt-1 -translate-x-1/2 rounded bg-bg-soft/80 px-1 font-mono text-[10px] whitespace-nowrap text-ink-soft opacity-0"
                aria-hidden="true"
              >
                {t.name}
              </span>
            </button>
          ))}
        </div>

        {/* Details panel: beside the globe on wide screens, a compact sheet over its lower edge below 1024px. */}
        <AnimatePresence>
          {detail && (
            <div className="absolute inset-x-0 bottom-2 z-400 flex justify-center lg:inset-x-auto lg:top-1/2 lg:right-0 lg:bottom-auto lg:-translate-y-1/2" key={detail.id}>
              <motion.div
                role="dialog"
                aria-labelledby="tech-detail-title"
                initial={reduced ? false : { opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-sm rounded-2xl border border-line bg-white/95 p-4 shadow-[0_18px_44px_-16px_rgb(8_40_60/0.35)] backdrop-blur-md lg:w-72"
              >
                <button
                  id="tech-detail-close"
                  type="button"
                  onClick={() => setSelected(null)}
                  aria-label="Close details"
                  className="absolute top-3 right-3 inline-flex size-7 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-bg-soft hover:text-ink focus-visible:outline-2 focus-visible:outline-accent"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
                <div className="flex items-center gap-3 pr-8">
                  <LogoBadge icon={detail.icon} size={44} />
                  <div className="min-w-0">
                    <h3 id="tech-detail-title" className="truncate text-[15px] font-semibold text-ink">
                      {detail.name}
                    </h3>
                    <span className="mt-0.5 inline-block rounded-full bg-bg-blue px-2 py-0.5 font-mono text-[10.5px] text-accent-strong">{techCategoryLabel[detail.category]}</span>
                  </div>
                </div>
                <p className="mt-3 text-[13.5px] leading-relaxed text-ink-soft">{detail.description}</p>
                {detail.icon.kind === "concept" && <p className="mt-2 font-mono text-[10.5px] text-ink-soft/80">practice · not a product</p>}
                {detail.projects?.length ? (
                  <div className="mt-3 border-t border-line pt-3">
                    <p className="font-mono text-[10.5px] text-ink-soft">related projects</p>
                    <ul className="mt-1.5 flex flex-wrap gap-1.5">
                      {detail.projects.map((p) => (
                        <li key={p} className="rounded-full border border-line px-2 py-0.5 text-[11.5px] text-ink">
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-4 font-mono text-[11.5px] text-ink-soft">{finePointer ? "Drag to explore · Hover to discover · Click for details" : "Swipe to explore · Tap for details"}</p>

      <TechTooltip info={tipInfo} onClose={() => setTip(null)} />
    </div>
  );
}
