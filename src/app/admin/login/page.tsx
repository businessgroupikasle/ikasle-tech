import { redirect } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { AdminLoginForm } from "@/components/careers/admin/AdminLoginForm";
import { isAdmin, isAdminConfigured } from "@/lib/careers/server/admin-auth";

type Props = { searchParams: Promise<{ next?: string }> };

/** Careers dashboard login (single shared password). */
export default async function AdminLoginPage({ searchParams }: Props) {
  const requested = (await searchParams).next;
  // Only allow returning to admin pages (no open redirects).
  const next = typeof requested === "string" && /^\/admin\/[\w\-/]*$/.test(requested) ? requested : "/admin/careers";
  if (await isAdmin()) redirect(next);

  return (
    <div className="container-x">
      <div className="mx-auto mt-10 max-w-md rounded-3xl border border-line bg-white p-8 shadow-[0_24px_60px_-40px_rgb(8_40_60/0.45)]">
        <span className="grid size-12 place-items-center rounded-2xl bg-bg-blue text-accent-strong" aria-hidden="true">
          <LockKeyhole className="size-6" />
        </span>
        <h1 className="mt-5 text-[1.6rem] font-semibold tracking-[-0.02em] text-ink">Careers Admin</h1>
        <p className="mt-1.5 text-[14.5px] text-ink-soft">Log in to review job applications.</p>
        <div className="mt-7">
          {isAdminConfigured() ? (
            <AdminLoginForm next={next} />
          ) : (
            <p className="rounded-2xl bg-amber-50 p-4 text-[14px] leading-relaxed text-amber-800">
              Admin access isn&apos;t set up yet. Add <code className="font-mono">CAREERS_ADMIN_PASSWORD</code> and{" "}
              <code className="font-mono">CAREERS_SESSION_SECRET</code> (32+ characters) to the environment, then restart the site.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
