"use client";

import dynamic from "next/dynamic";

/**
 * Loads the application form in the browser only: it restores the candidate's saved progress from localStorage on
 * first render, which the server can't see. A skeleton shows while it loads.
 */
export const ApplicationFormClient = dynamic(() => import("./ApplicationForm").then((m) => m.ApplicationForm), {
  ssr: false,
  loading: () => (
    <div aria-busy="true" aria-label="Loading application form" className="flex flex-col gap-6">
      <div className="h-28 animate-pulse rounded-3xl bg-bg-soft" />
      <div className="h-[520px] animate-pulse rounded-3xl bg-bg-soft" />
    </div>
  ),
});
