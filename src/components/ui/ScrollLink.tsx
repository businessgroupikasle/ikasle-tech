"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

/** Explicit anchors also work when the destination route is already open without corrupting Next.js history. */
export function ScrollLink({ onClick, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          props.target === "_blank"
        )
          return;

        try {
          const url = new URL(event.currentTarget.href, window.location.href);
          if (url.pathname !== window.location.pathname || url.search !== window.location.search) return;

          // If clicking home/top on the same page, smoothly scroll to top and ensure URL stays clean without `#top`
          if (!url.hash || url.hash === "#top") {
            event.preventDefault();
            const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth";
            window.scrollTo({ top: 0, behavior });
            if (url.hash === "#top" && typeof window !== "undefined" && window.location.hash) {
              window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
            }
            return;
          }

          const target = document.getElementById(url.hash.slice(1));
          if (!target) return;
          event.preventDefault();
          // Never push `null` state into Next.js router history; preserve existing Next.js history state
          if (typeof window !== "undefined" && window.history?.state) {
            window.history.replaceState(window.history.state, "", url.href);
          }
          const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth";
          target.scrollIntoView({ behavior, block: "start" });
        } catch {
          // Allow native navigation if URL parsing fails
        }
      }}
    />
  );
}
