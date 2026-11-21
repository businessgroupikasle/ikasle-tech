import { statusLabels, type ApplicationStatus } from "@/lib/careers/application-schema";
import { cn } from "@/lib/cn";

const statusTones: Record<ApplicationStatus, string> = {
  new: "bg-sky-50 text-sky-700 ring-sky-200",
  under_review: "bg-amber-50 text-amber-700 ring-amber-200",
  shortlisted: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  interview_scheduled: "bg-violet-50 text-violet-700 ring-violet-200",
  selected: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  rejected: "bg-rose-50 text-rose-700 ring-rose-200",
};

export function StatusBadge({ status, className }: { status: ApplicationStatus; className?: string }) {
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-semibold whitespace-nowrap ring-1", statusTones[status], className)}>{statusLabels[status]}</span>;
}
