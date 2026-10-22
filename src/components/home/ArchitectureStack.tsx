"use client";

import { Fragment, useEffect, useLayoutEffect, useMemo, useRef, type CSSProperties } from "react";
import { AppWindow, Boxes, Braces, Cloud, Cog, Gauge, Layers, LayoutDashboard, ShieldCheck, Smartphone, type LucideIcon } from "lucide-react";
import { architectureLayers, type ArchitectureLayer } from "@/data/architecture";
import { cn } from "@/lib/cn";
import "./ArchitectureStack.css";

/* Stage geometry in CSS px (the whole stage is scaled to fit the panel). Layer 0 is the top. */
const D = 176;
const GAP = 128;
const SLAB = 8;
const SLOTS = [92, 220, 348] as const;
const ROW = D / 2;
const layerZ = (i: number) => (2 - i) * GAP;

/* Orientation limits keep the stack readable: the top, front and right faces always face the viewer. */
const YAW = { def: 11, min: 4, max: 28 };
const PITCH = { def: 57, min: 48, max: 64 };
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

type BoxSpec = {
  kind: "box";
  w: number;
  d: number;
  h: number;
  icons: [LucideIcon, LucideIcon, LucideIcon];
  iconOn: "top" | "front";
  vents?: boolean;
  led?: boolean;
};
type CylinderSpec = { kind: "cylinder"; r: number; h: number };

const MODULES: Record<ArchitectureLayer["id"], BoxSpec | CylinderSpec> = {
  frontend: { kind: "box", w: 108, d: 78, h: 30, icons: [AppWindow, Smartphone, LayoutDashboard], iconOn: "top" },
  api: { kind: "box", w: 96, d: 66, h: 34, icons: [Braces, ShieldCheck, Gauge], iconOn: "top", vents: true, led: true },
  services: { kind: "box", w: 98, d: 70, h: 44, icons: [Cog, Boxes, Layers], iconOn: "front", vents: true, led: true },
  database: { kind: "cylinder", r: 40, h: 56 },
  cloud: { kind: "box", w: 104, d: 74, h: 46, icons: [Cloud, Cloud, Cloud], iconOn: "front", vents: true, led: true },
};
const moduleHeight = (i: number) => MODULES[architectureLayers[i]!.id].h;

/* Cylinder side strips, pre-shaded for a light from the front-left. */
const STRIPS = 24;
const STRIP_SHADES = Array.from({ length: STRIPS }, (_, k) => {
  const a = (k / STRIPS) * Math.PI * 2;
  const lit = Math.max(0, 0.6 * Math.sin(a) + 0.8 * Math.cos(a));
  const t = 0.2 + 0.8 * lit;
  const ch = (from: number) => Math.round(from + (255 - from) * t);
  return `rgb(${ch(0xbd)} ${ch(0xca)} ${ch(0xd6)})`;
});

/* Overlay label slots: one side label per layer, then three callouts per layer. */
const sideIndex = (layer: number) => layer;
const calloutIndex = (layer: number, module: number) => architectureLayers.length + layer * 3 + module;

function Box({ x, spec, index }: { x: number; spec: BoxSpec; index: number }) {
  const { w, d, h } = spec;
  const Icon = spec.icons[index]!;
  const icon = <Icon className={cn("arch-icon", spec.iconOn === "top" && spec.h < 32 && "arch-icon--lg")} strokeWidth={1.6} aria-hidden="true" />;
  return (
    <div className="arch-3d" style={{ left: x - w / 2, top: ROW - d / 2, width: w, height: d }}>
      <span className="arch-shadow" />
      <div className="arch-face arch-box-top" style={{ transform: `translateZ(${h}px)` }}>
        {spec.iconOn === "top" && icon}
      </div>
      <div className="arch-face arch-box-front" style={{ top: d - h, height: h }}>
        {spec.vents && <span className="arch-vents" />}
        {spec.iconOn === "front" && icon}
        {spec.led && <span className="arch-led" />}
      </div>
      <div className="arch-face arch-box-right" style={{ left: w - h, width: h }}>
        {spec.vents && <span className="arch-vents" />}
      </div>
    </div>
  );
}

function Cylinder({ x, spec }: { x: number; spec: CylinderSpec }) {
  const { r, h } = spec;
  const sw = (2 * Math.PI * r) / STRIPS + 0.8;
  return (
    <div className="arch-3d" style={{ left: x - r, top: ROW - r, width: r * 2, height: r * 2 }}>
      <span className="arch-shadow" style={{ borderRadius: "50%" }} />
      {STRIP_SHADES.map((c, k) => (
        <span
          key={k}
          className="arch-strip"
          style={{ left: r - sw / 2, top: r - h, width: sw, height: h, "--c": c, transform: `rotateZ(${(k / STRIPS) * 360}deg) translateY(${r}px) rotateX(-90deg)` } as CSSProperties}
        />
      ))}
      <span className="arch-cyl-top" style={{ transform: `translateZ(${h}px)` }} />
    </div>
  );
}

type Props = {
  selected: number;
  onSelect: (index: number) => void;
  reducedMotion: boolean;
};

/**
 * Five-layer architecture stack rendered with CSS 3D transforms — real perspective and rotation, DOM-sharp
 * labels, no WebGL. Orientation lives in two CSS variables (--yaw / --pitch) on the root; a rAF loop runs
 * only while something moves (drag, pointer tilt, selection lift, entrance) and then stops.
 * Labels sit in a flat overlay and are placed on 3D "probe" points, so they never get hidden behind glass.
 * The accessible control is the tablist in ArchitectureSection; this whole diagram is aria-hidden.
 */
export function ArchitectureStack({ selected, onSelect, reducedMotion }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const probes = useRef<(HTMLSpanElement | null)[]>([]);
  const tags = useRef<(HTMLDivElement | null)[]>([]);
  const kickRef = useRef<((ms?: number) => void) | null>(null);
  const onSelectRef = useRef(onSelect);
  const reducedRef = useRef(reducedMotion);

  useEffect(() => {
    onSelectRef.current = onSelect;
    reducedRef.current = reducedMotion;
  });

  useEffect(() => {
    const root = rootRef.current;
    const scene = sceneRef.current;
    const overlay = overlayRef.current;
    if (!root || !scene || !overlay) return;

    const cur = { yaw: YAW.def, pitch: PITCH.def };
    const base = { ...cur };
    const hover = { x: 0, y: 0 };
    let drag: { x: number; y: number; yaw: number; pitch: number; id: number } | null = null;
    let moved = false;
    let raf = 0;
    let last = 0;
    let until = 0;

    const place = () => {
      const o = overlay.getBoundingClientRect();
      const points = probes.current.map((p) => {
        if (!p) return null;
        const r = p.getBoundingClientRect();
        return [r.left + r.width / 2 - o.left, r.top + r.height / 2 - o.top] as const;
      });
      points.forEach((pt, i) => {
        const tag = tags.current[i];
        if (pt && tag) tag.style.transform = `translate3d(${pt[0].toFixed(1)}px, ${pt[1].toFixed(1)}px, 0)`;
      });
    };

    const tick = (t: number) => {
      const dt = Math.min(0.05, last ? (t - last) / 1000 : 1 / 60);
      last = t;
      const target = {
        yaw: clamp(base.yaw + hover.x * 6, YAW.min, YAW.max),
        pitch: clamp(base.pitch + hover.y * 4, PITCH.min, PITCH.max),
      };
      const k = 1 - Math.exp(-dt * 9);
      cur.yaw += (target.yaw - cur.yaw) * k;
      cur.pitch += (target.pitch - cur.pitch) * k;
      root.style.setProperty("--yaw", `${cur.yaw.toFixed(3)}deg`);
      root.style.setProperty("--pitch", `${cur.pitch.toFixed(3)}deg`);
      place();
      const settling = Math.abs(target.yaw - cur.yaw) > 0.01 || Math.abs(target.pitch - cur.pitch) > 0.01;
      if (settling || t < until) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
        last = 0;
      }
    };
    const kick = (ms = 0) => {
      until = Math.max(until, performance.now() + ms);
      if (!raf) raf = requestAnimationFrame(tick);
    };
    kickRef.current = kick;

    // Fit the stage to the panel. The side labels stay full size, so they get a fixed gutter on the left and
    // the stack scales into the rest; when that would make it too small they move to the tab panel instead.
    const LABEL_GUTTER = 225;
    const STACK_W = 470; // projected stack width at scale 1
    const fit = () => {
      const { width, height } = root.getBoundingClientRect();
      const sFit = Math.min(1.05, height / 690);
      const sWide = Math.min(sFit, (width - LABEL_GUTTER - 16) / STACK_W);
      const wide = sWide >= 0.55;
      const s = wide ? sWide : Math.min(sFit, width / 500);
      const shift = wide ? Math.max(0, LABEL_GUTTER + (STACK_W / 2) * s - width / 2) : 0;
      root.toggleAttribute("data-wide", wide);
      root.style.setProperty("--s", s.toFixed(4));
      root.style.setProperty("--shift-x", `${shift.toFixed(1)}px`);
      root.style.setProperty("--shift-y", `${(26 * s + 24).toFixed(1)}px`);
      kick();
    };
    const resize = new ResizeObserver(fit);
    resize.observe(root);

    // Entrance on first reveal; pause the CSS loops while offscreen.
    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = Boolean(entry?.isIntersecting);
        root.toggleAttribute("data-paused", !visible);
        if (visible && !root.hasAttribute("data-in")) {
          root.setAttribute("data-in", "");
          kick(reducedRef.current ? 0 : 1900);
        }
      },
      { threshold: 0.2 },
    );
    io.observe(root);

    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      drag = { x: e.clientX, y: e.clientY, yaw: base.yaw, pitch: base.pitch, id: e.pointerId };
      moved = false;
      scene.setPointerCapture(e.pointerId);
      root.setAttribute("data-dragging", "");
    };
    const move = (e: PointerEvent) => {
      if (drag) {
        const dx = e.clientX - drag.x;
        const dy = e.clientY - drag.y;
        if (Math.abs(dx) + Math.abs(dy) > 4) moved = true;
        base.yaw = clamp(drag.yaw + dx * 0.12, YAW.min, YAW.max);
        base.pitch = clamp(drag.pitch - dy * 0.08, PITCH.min, PITCH.max);
        kick();
      } else if (e.pointerType === "mouse" && !reducedRef.current) {
        const r = root.getBoundingClientRect();
        hover.x = (e.clientX - r.left) / r.width - 0.5;
        hover.y = (e.clientY - r.top) / r.height - 0.5;
        kick();
      }
    };
    const up = () => {
      if (!drag) return;
      if (scene.hasPointerCapture(drag.id)) scene.releasePointerCapture(drag.id);
      drag = null;
      root.removeAttribute("data-dragging");
    };
    const leave = () => {
      hover.x = 0;
      hover.y = 0;
      kick();
    };
    const click = (e: MouseEvent) => {
      if (moved) {
        moved = false;
        return;
      }
      const hit = (e.target as Element).closest<HTMLElement>("[data-layer]");
      if (hit) onSelectRef.current(Number(hit.dataset.layer));
    };

    scene.addEventListener("pointerdown", down);
    scene.addEventListener("pointermove", move);
    scene.addEventListener("pointerup", up);
    scene.addEventListener("pointercancel", up);
    scene.addEventListener("pointerleave", leave);
    root.addEventListener("click", click);

    return () => {
      cancelAnimationFrame(raf);
      kickRef.current = null;
      resize.disconnect();
      io.disconnect();
      scene.removeEventListener("pointerdown", down);
      scene.removeEventListener("pointermove", move);
      scene.removeEventListener("pointerup", up);
      scene.removeEventListener("pointercancel", up);
      scene.removeEventListener("pointerleave", leave);
      root.removeEventListener("click", click);
    };
  }, []);

  // Selection is applied straight to the DOM (before paint) instead of re-rendering ~400 elements:
  // the selected layer, the "hot" connectors around it, its callouts and its side label. The CSS for these
  // attributes is unchanged. Then keep the labels on their probes while the layer lifts.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.querySelectorAll<HTMLElement>(".arch-layer").forEach((layer, i) => {
      layer.toggleAttribute("data-selected", i === selected);
      const wireHot = i === selected || i + 1 === selected;
      layer.querySelectorAll("[data-wire]").forEach((el) => el.toggleAttribute("data-hot", wireHot));
      const landHot = i === selected || i - 1 === selected;
      layer.querySelectorAll("[data-land]").forEach((el) => el.toggleAttribute("data-hot", landHot));
    });
    root.querySelectorAll<HTMLElement>(".arch-side").forEach((tag, i) => tag.toggleAttribute("data-sel", i === selected));
    root.querySelectorAll<HTMLElement>(".arch-callout").forEach((c) => c.toggleAttribute("data-shown", Number(c.dataset.layerIndex) === selected));
    kickRef.current?.(800);
  }, [selected]);

  // The geometry and labels never depend on the selection, so React renders them once (not per click).
  return useMemo(() => {
    const last = architectureLayers.length - 1;
    return (
      <div ref={rootRef} className="arch-root" aria-hidden="true">
        <div className="arch-float">
          <div ref={sceneRef} className="arch-scene">
            <div className="arch-stage">
              {architectureLayers.map((layer, i) => {
                const spec = MODULES[layer.id];
                // Connector from this platform's underside down to the next layer's modules.
                const wireLen = i < last ? GAP - SLAB - moduleHeight(i + 1) : 0;
                return (
                  <div
                    key={layer.id}
                    className="arch-layer"
                    data-layer={i}
                    style={{ "--z": `${layerZ(i)}px`, "--i": i } as CSSProperties}
                  >
                    <div className="arch-plate">
                      <div className="arch-plate-face arch-plate-top" />
                      <div className="arch-plate-face arch-plate-front" />
                      <div className="arch-plate-face arch-plate-right" />
                    </div>

                    {SLOTS.map((x, mi) => (
                      <Fragment key={mi}>
                        {spec.kind === "box" ? <Box x={x} spec={spec} index={mi} /> : <Cylinder x={x} spec={spec} />}

                        {/* dot where the connector from the layer above lands */}
                        {i > 0 && (
                          <span className="arch-bb" style={{ left: x, top: ROW, "--bz": `${spec.h + 1}px` } as CSSProperties}>
                            <span className="arch-dot" data-land />
                          </span>
                        )}

                        {i < last && (
                          <>
                            <span
                              className="arch-wire"
                              data-wire
                              style={{ left: x, top: ROW, height: `calc(${wireLen}px + var(--lift))`, transform: `translateZ(${-SLAB}px) rotateX(-90deg)` }}
                            />
                            <span
                              className="arch-wire"
                              data-wire
                              style={{ left: x, top: ROW, height: `calc(${wireLen}px + var(--lift))`, transform: `translateZ(${-SLAB}px) rotateZ(90deg) rotateX(-90deg)` }}
                            />
                            <span className="arch-bb" style={{ left: x, top: ROW, "--bz": `${-SLAB - 1}px` } as CSSProperties}>
                              <span className="arch-dot" data-wire />
                            </span>
                            {!reducedMotion && (
                              <span
                                data-wire
                                className="arch-bb arch-packet"
                                style={{ left: x, top: ROW, "--z0": `${-SLAB}px`, "--z1": `calc(${-SLAB - wireLen}px - var(--lift))`, "--delay": `${mi * -0.6}s` } as CSSProperties}
                              >
                                <span className="arch-dot" />
                              </span>
                            )}
                          </>
                        )}

                        <span
                          ref={(el) => void (probes.current[calloutIndex(i, mi)] = el)}
                          className="arch-probe"
                          style={{ transform: `translate3d(${x}px, ${ROW}px, ${spec.h + 12}px)` }}
                        />
                      </Fragment>
                    ))}

                    <span ref={(el) => void (probes.current[sideIndex(i)] = el)} className="arch-probe" style={{ transform: `translate3d(0px, ${ROW}px, 0px)` }} />
                  </div>
                );
              })}
            </div>
          </div>

          <div ref={overlayRef} className="arch-overlay">
            {architectureLayers.map((layer, i) => (
              <div
                key={layer.id}
                ref={(el) => void (tags.current[sideIndex(i)] = el)}
                className="arch-tag arch-side"
                style={{ "--i": i } as CSSProperties}
              >
                <div className="arch-side-inner">
                  <span className="arch-pill" data-layer={i}>
                    <b>{String(i + 1).padStart(2, "0")}</b>
                    {layer.title}
                  </span>
                  <span className="arch-side-line" />
                  <span className="arch-side-dot" />
                </div>
              </div>
            ))}
            {architectureLayers.map((layer, i) =>
              layer.modules.map((m, mi) => (
                <div key={m} ref={(el) => void (tags.current[calloutIndex(i, mi)] = el)} className="arch-tag">
                  <span className="arch-callout" data-layer-index={i} data-mid={mi === 1 ? "" : undefined} style={{ "--j": mi } as CSSProperties}>
                    {m}
                  </span>
                </div>
              )),
            )}
          </div>
        </div>
      </div>
    );
  }, [reducedMotion]);
}
