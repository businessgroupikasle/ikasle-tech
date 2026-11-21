"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await fetch("/api/admin/session", { method: "DELETE" }).catch(() => {});
        router.replace("/admin/login");
        router.refresh();
      }}
      className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-white px-4 text-[14px] font-medium text-ink transition-colors hover:border-accent/50 hover:text-accent-strong"
    >
      <LogOut className="size-4" aria-hidden="true" /> Log out
    </button>
  );
}
