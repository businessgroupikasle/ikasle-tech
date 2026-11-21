import type { Metadata } from "next";
import type { ReactNode } from "react";

// Admin pages are private: never indexed, never cached.
export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-[70vh] bg-bg-soft pt-[calc(var(--header-h)+24px)] pb-20">{children}</div>;
}
