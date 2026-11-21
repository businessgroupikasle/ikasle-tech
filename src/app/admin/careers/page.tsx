import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft, ChevronRight, Inbox, Search } from "lucide-react";
import { inputClass } from "@/components/careers/apply/input-class";
import { LogoutButton } from "@/components/careers/admin/LogoutButton";
import { StatusBadge } from "@/components/careers/admin/StatusBadge";
import { APPLICATION_STATUSES, positionOptions, statusLabels, type ApplicationStatus } from "@/lib/careers/application-schema";
import { isAdmin } from "@/lib/careers/server/admin-auth";
import { isDatabaseConfigured } from "@/lib/careers/server/db";
import { listApplications, PAGE_SIZE } from "@/lib/careers/server/repository";
import { cn } from "@/lib/cn";

type Props = { searchParams: Promise<{ status?: string; position?: string; q?: string; page?: string }> };

const one = (v: string | undefined) => (typeof v === "string" ? v : undefined);

/** Careers dashboard: status pipeline counts, search and filters, and the applications table (newest first). */
export default async function AdminCareersPage({ searchParams }: Props) {
  if (!(await isAdmin())) redirect("/admin/login?next=/admin/careers");

  if (!isDatabaseConfigured()) {
    return (
      <div className="container-x">
        <p className="mt-10 rounded-2xl bg-amber-50 p-6 text-amber-800">
          Supabase isn&apos;t configured. Add <code className="font-mono">SUPABASE_URL</code> and <code className="font-mono">SUPABASE_SECRET_KEY</code> to the environment and restart the site.
        </p>
      </div>
    );
  }

  const sp = await searchParams;
  const status = (APPLICATION_STATUSES as readonly string[]).includes(one(sp.status) ?? "") ? (sp.status as ApplicationStatus) : undefined;
  const position = positionOptions.some((p) => p.value === sp.position) ? sp.position : undefined;
  const q = one(sp.q)?.trim().slice(0, 100) || undefined;
  const page = Math.max(1, Number.parseInt(one(sp.page) ?? "1", 10) || 1);

  const { rows, total, statusCounts } = await listApplications({ status, position, q, page });
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const allCount = Object.values(statusCounts).reduce((a, b) => a + (b ?? 0), 0);

  const href = (changes: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams();
    const merged = { status, position, q, page: undefined as number | undefined, ...changes };
    for (const [k, v] of Object.entries(merged)) if (v !== undefined && v !== "" && !(k === "page" && v === 1)) params.set(k, String(v));
    const s = params.toString();
    return `/admin/careers${s ? `?${s}` : ""}`;
  };

  return (
    <div className="container-x">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[1.9rem] font-semibold tracking-[-0.03em] text-ink">Job Applications</h1>
          <p className="mt-1 text-[14.5px] text-ink-soft">{allCount} total applications</p>
        </div>
        <LogoutButton />
      </div>

      {/* Pipeline: one tile per status, each a filter link. */}
      <nav aria-label="Filter by status" className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {[undefined, ...APPLICATION_STATUSES].map((s) => {
          const active = s === status;
          return (
            <Link
              key={s ?? "all"}
              href={href({ status: s })}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-2xl border p-4 transition-colors",
                active ? "border-accent-strong bg-accent-strong text-white" : "border-line bg-white text-ink hover:border-accent/50",
              )}
            >
              <span className={cn("block text-[12.5px]", active ? "text-white/80" : "text-ink-soft")}>{s ? statusLabels[s] : "All"}</span>
              <span className="mt-1 block text-[1.6rem] leading-none font-semibold">{s ? (statusCounts[s] ?? 0) : allCount}</span>
            </Link>
          );
        })}
      </nav>

      {/* Search and role filter (plain GET form: works without JavaScript). */}
      <form action="/admin/careers" className="mt-6 flex flex-col gap-3 rounded-2xl border border-line bg-white p-4 sm:flex-row sm:items-end">
        {status && <input type="hidden" name="status" value={status} />}
        <label className="flex flex-1 flex-col gap-1.5">
          <span className="text-[13px] font-medium text-ink">Search</span>
          <span className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-soft" aria-hidden="true" />
            <input name="q" defaultValue={q} placeholder="Name, email, phone or reference" className={`${inputClass()} h-11 pl-10`} />
          </span>
        </label>
        <label className="flex flex-col gap-1.5 sm:w-64">
          <span className="text-[13px] font-medium text-ink">Position</span>
          <select name="position" defaultValue={position ?? ""} className={`${inputClass()} h-11`}>
            <option value="">All positions</option>
            {positionOptions.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="h-11 rounded-full bg-accent-strong px-6 text-[14.5px] font-medium text-white hover:bg-accent-hover">
          Apply filters
        </button>
        {(q || position) && (
          <Link href={href({ q: undefined, position: undefined })} className="flex h-11 items-center px-2 text-[14px] font-medium text-accent-strong hover:underline">
            Clear
          </Link>
        )}
      </form>

      {/* Applications */}
      {rows.length === 0 ? (
        <div className="mt-6 flex flex-col items-center gap-3 rounded-3xl border border-dashed border-line bg-white px-6 py-16 text-center">
          <Inbox className="size-8 text-ink-soft" aria-hidden="true" />
          <p className="text-[16px] font-semibold text-ink">No applications found</p>
          <p className="text-[14px] text-ink-soft">{q || position || status ? "Try different filters." : "New applications will appear here."}</p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full min-w-[760px] text-left text-[14px]">
            <thead className="border-b border-line bg-bg-soft/70 text-[12.5px] text-ink-soft">
              <tr>
                <th scope="col" className="px-5 py-3 font-medium">Applicant</th>
                <th scope="col" className="px-5 py-3 font-medium">Position</th>
                <th scope="col" className="px-5 py-3 font-medium">Reference</th>
                <th scope="col" className="px-5 py-3 font-medium">Submitted</th>
                <th scope="col" className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-bg-soft/60">
                  <td className="px-5 py-3.5">
                    <Link href={`/admin/careers/${row.id}`} className="font-semibold text-ink hover:text-accent-strong hover:underline">
                      {row.full_name}
                    </Link>
                    <p className="text-[13px] text-ink-soft">{row.email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-ink">{row.job_title}</td>
                  <td className="px-5 py-3.5 font-mono text-[13px] text-ink-soft">{row.reference}</td>
                  <td className="px-5 py-3.5 text-ink-soft">{row.created_at.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" })}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={row.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 && (
        <nav aria-label="Pagination" className="mt-6 flex items-center justify-between text-[14px]">
          <span className="text-ink-soft">
            Page {page} of {pages}
          </span>
          <span className="flex gap-2">
            {page > 1 && (
              <Link href={href({ page: page - 1 })} className="inline-flex h-10 items-center gap-1 rounded-full border border-line bg-white px-4 font-medium text-ink hover:border-accent/50">
                <ChevronLeft className="size-4" aria-hidden="true" /> Previous
              </Link>
            )}
            {page < pages && (
              <Link href={href({ page: page + 1 })} className="inline-flex h-10 items-center gap-1 rounded-full border border-line bg-white px-4 font-medium text-ink hover:border-accent/50">
                Next <ChevronRight className="size-4" aria-hidden="true" />
              </Link>
            )}
          </span>
        </nav>
      )}
    </div>
  );
}
