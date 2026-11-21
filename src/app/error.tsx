"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log client-side error cleanly
    console.error("Application error boundary caught:", error);
  }, [error]);

  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-4 py-24 text-center">
      <div className="ambient" aria-hidden="true" />
      <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_50%_40%,#000_15%,transparent_70%)]" aria-hidden="true" />

      <div className="relative z-10 max-w-md rounded-3xl border border-line bg-white/90 p-8 shadow-float backdrop-blur-md sm:p-10">
        <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 mb-6">
          <AlertTriangle className="size-7" />
        </span>

        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Something went wrong</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          An unexpected navigation or rendering issue occurred. You can reload this page or return to the homepage safely.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={() => reset()} size="md" className="gap-2">
            <RotateCcw className="size-4" /> Try Again
          </Button>
          <Link
            href="/"
            onClick={() => {
              if (typeof window !== "undefined") window.location.href = "/";
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-5 py-2.5 text-sm font-medium text-ink transition hover:border-accent hover:text-accent-strong shadow-xs"
          >
            <Home className="size-4" /> Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

