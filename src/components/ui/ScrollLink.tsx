"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

/** Explicit anchors also work when the destination route is already open. */
export function ScrollLink({ onClick, ...props }: ComponentProps<typeof Link>) {
  return <Link {...props} onClick={(event) => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || props.target === "_blank") return;
    const url = new URL(event.currentTarget.href);
    if (url.pathname !== window.location.pathname || url.search !== window.location.search || !url.hash) return;
    const target = document.getElementById(url.hash.slice(1));
    if (!target) return;
    event.preventDefault();
    window.history.pushState(null, "", url);
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth";
    if (url.hash === "#top") window.scrollTo({ top: 0, behavior });
    else target.scrollIntoView({ behavior, block: "start" });
  }} />;
}
