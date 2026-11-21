"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LockKeyhole } from "lucide-react";
import { inputClass } from "@/components/careers/apply/input-class";

/** Password form for the careers dashboard. On success it goes to `next` (an /admin path) or the dashboard. */
export function AdminLoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      const data = (await res.json()) as { ok: boolean; message?: string };
      if (data.ok) {
        router.replace(next);
        router.refresh();
        return;
      }
      setError(data.message ?? "Could not log in.");
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
      <label htmlFor="admin-password" className="text-[14px] font-medium text-ink">
        Password
      </label>
      <input
        id="admin-password"
        type="password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "admin-login-error" : undefined}
        className={`${inputClass(Boolean(error))} -mt-2 h-12`}
      />
      {error && (
        <p id="admin-login-error" role="alert" className="-mt-2 text-[13.5px] font-medium text-red-600">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={busy || !password}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent-strong text-[15px] font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
      >
        {busy ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <LockKeyhole className="size-4" aria-hidden="true" />}
        Log in
      </button>
    </form>
  );
}
