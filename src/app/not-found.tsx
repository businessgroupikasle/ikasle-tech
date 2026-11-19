import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "404 - Page Not Found | IKASLE Technologies",
  description: "The requested page could not be found. Explore our software engineering services or contact our team.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden pt-[var(--header-h)] pb-16">
      <div className="ambient" aria-hidden="true" />
      <div className="container-x relative flex flex-col items-start gap-6">
        <pre className="rounded-2xl bg-editor px-5 py-4 font-mono text-[13px] text-editor-text shadow-soft" aria-hidden="true">
          <span className="tok-keyword">throw new</span> <span className="tok-type">NotFoundError</span>
          <span className="tok-punct">(</span>
          <span className="tok-string">&quot;404&quot;</span>
          <span className="tok-punct">);</span>
        </pre>
        <h1 className="text-5xl font-semibold tracking-[-0.04em] text-ink sm:text-6xl">Page not found</h1>
        <p className="max-w-md text-lg text-ink-soft">The route you requested doesn&apos;t exist — it may have moved, or the URL has a typo.</p>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/" arrow>
            Back to home
          </ButtonLink>
          <ButtonLink href="/contact" variant="secondary">
            Contact us
          </ButtonLink>
        </div>

        {/* Helpful Recovery Links */}
        <div className="mt-4 border-t border-line/60 pt-6">
          <p className="font-mono text-xs uppercase tracking-wider text-ink-soft">Popular pages you may be looking for:</p>
          <div className="mt-3 flex flex-wrap gap-4 text-sm font-medium text-accent-strong">
            <Link href="/services" className="hover:underline">
              Services &amp; Solutions →
            </Link>
            <Link href="/clientele" className="hover:underline">
              Client Portfolio →
            </Link>
            <Link href="/about" className="hover:underline">
              About Our Company →
            </Link>
            <Link href="/faq" className="hover:underline">
              Frequently Asked Questions →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
