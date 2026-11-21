"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { inputClass } from "@/components/careers/apply/input-class";
import { APPLICATION_STATUSES, statusLabels, type ApplicationStatus } from "@/lib/careers/application-schema";

/** Change an application's status and internal notes (PATCH /api/admin/careers/applications/[id]). */
export function AdminStatusForm({ id, status, notes }: { id: string; status: ApplicationStatus; notes: string }) {
  const router = useRouter();
  const [nextStatus, setNextStatus] = useState(status);
  const [nextNotes, setNextNotes] = useState(notes);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");
  const dirty = nextStatus !== status || nextNotes !== notes;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("saving");
    try {
      const res = await fetch(`/api/admin/careers/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus, notes: nextNotes }),
      });
      const data = (await res.json()) as { ok: boolean; message?: string };
      if (!data.ok) throw new Error(data.message ?? "Could not save.");
      setState("saved");
      router.refresh();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Could not save.");
    }
  };

  return (
    <form onSubmit={save} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="admin-status" className="text-[14px] font-medium text-ink">
          Status
        </label>
        <select
          id="admin-status"
          value={nextStatus}
          onChange={(e) => {
            setNextStatus(e.target.value as ApplicationStatus);
            setState("idle");
          }}
          className={`${inputClass()} h-11`}
        >
          {APPLICATION_STATUSES.map((s) => (
            <option key={s} value={s}>
              {statusLabels[s]}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="admin-notes" className="text-[14px] font-medium text-ink">
          Internal notes
        </label>
        <textarea
          id="admin-notes"
          rows={5}
          maxLength={5000}
          value={nextNotes}
          onChange={(e) => {
            setNextNotes(e.target.value);
            setState("idle");
          }}
          placeholder="Interview feedback, next steps… (only visible to admins)"
          className={`${inputClass()} resize-y py-3 leading-relaxed`}
        />
      </div>
      <button
        type="submit"
        disabled={!dirty || state === "saving"}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-accent-strong text-[14.5px] font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
      >
        {state === "saving" ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Check className="size-4" aria-hidden="true" />}
        Save changes
      </button>
      <p aria-live="polite" className={`text-[13px] ${state === "error" ? "font-medium text-red-600" : "text-success"}`}>
        {state === "saved" ? "Saved." : state === "error" ? message : ""}
      </p>
    </form>
  );
}
