"use client";
import { useEffect, useRef, type ReactNode } from "react";

export function FooterGroup({ title, children }: { title: string; children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 640px)");
    const sync = () => { if (ref.current) ref.current.open = desktop.matches; };
    sync();
    desktop.addEventListener("change", sync);
    return () => desktop.removeEventListener("change", sync);
  }, []);
  return <details ref={ref} className="footer-group">
    <summary className="font-mono text-[12px] font-medium tracking-wider text-ink uppercase">{title}</summary>
    {children}
  </details>;
}
