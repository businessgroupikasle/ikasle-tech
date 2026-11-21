"use client";

import { useId, useRef, useState } from "react";
import { FileText, Loader2, Trash2, UploadCloud } from "lucide-react";
import type { FileRef } from "@/lib/careers/application-schema";
import { acceptFor, checkFile, fileKinds, formatList, MAX_FILE_LABEL, type FileKind } from "@/lib/careers/file-rules";
import { cn } from "@/lib/cn";

type Uploading = { key: string; name: string; progress: number };

const formatSize = (bytes: number) => (bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`);

/** Uploads one file with progress (XHR, so the bar is real). Resolves to the stored file's reference. */
function upload(file: File, kind: FileKind, draftId: string, onProgress: (p: number) => void): Promise<FileRef> {
  return new Promise((resolve, reject) => {
    const body = new FormData();
    body.append("file", file);
    body.append("kind", kind);
    body.append("draftId", draftId);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/careers/uploads");
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => {
      let data: { ok?: boolean; file?: FileRef; message?: string } = {};
      try {
        data = JSON.parse(xhr.responseText) as typeof data;
      } catch {
        /* handled below */
      }
      if (xhr.status >= 200 && xhr.status < 300 && data.ok && data.file) resolve(data.file);
      else reject(new Error(data.message || "Upload failed. Please try again."));
    };
    xhr.onerror = () => reject(new Error("Network error while uploading. Please check your connection and try again."));
    xhr.send(body);
  });
}

/**
 * Document upload for the application form: drag-and-drop or browse, type and size checked before sending, upload
 * progress, and removal (which also deletes the stored draft file). Works for single (resume) and multiple (work
 * samples) files.
 */
export function FileField({
  kind,
  label,
  required,
  hint,
  draftId,
  value,
  onChange,
  error,
}: {
  kind: FileKind;
  label: string;
  required?: boolean;
  hint?: string;
  draftId: string;
  value: FileRef[];
  onChange: (next: FileRef[]) => void;
  error?: string;
}) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<Uploading[]>([]);
  const [localError, setLocalError] = useState("");
  const [dragging, setDragging] = useState(false);
  const { maxCount } = fileKinds[kind];
  const room = maxCount - value.length - uploading.length;

  const handleFiles = async (files: FileList | File[]) => {
    setLocalError("");
    const list = Array.from(files).slice(0, Math.max(0, room));
    if (Array.from(files).length > room) setLocalError(maxCount === 1 ? "Only one file can be uploaded here — remove the current one first." : `You can upload up to ${maxCount} files here.`);
    let current = value;
    for (const file of list) {
      const problem = checkFile(file, kind);
      if (problem) {
        setLocalError(`${file.name}: ${problem}`);
        continue;
      }
      const key = `${file.name}-${file.size}-${Math.random()}`;
      setUploading((u) => [...u, { key, name: file.name, progress: 0 }]);
      try {
        const ref = await upload(file, kind, draftId, (progress) => setUploading((u) => u.map((x) => (x.key === key ? { ...x, progress } : x))));
        current = [...current, ref];
        onChange(current);
      } catch (e) {
        setLocalError(e instanceof Error ? e.message : "Upload failed.");
      } finally {
        setUploading((u) => u.filter((x) => x.key !== key));
      }
    }
  };

  const remove = (file: FileRef) => {
    onChange(value.filter((f) => f.id !== file.id));
    void fetch(`/api/careers/uploads/${file.id}?draftId=${draftId}`, { method: "DELETE" }).catch(() => {});
  };

  const shownError = localError || error;
  return (
    <div>
      <p id={`${id}-label`} className="mb-1.5 text-[14px] font-medium text-ink">
        {label}
        {required ? <span className="ml-0.5 text-red-500" aria-hidden="true">*</span> : <span className="ml-1.5 text-[12.5px] font-normal text-ink-soft">(optional)</span>}
      </p>

      {room > 0 && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            void handleFiles(e.dataTransfer.files);
          }}
          className={cn(
            "flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed px-6 py-7 text-center transition-colors",
            dragging ? "border-accent bg-bg-blue" : shownError ? "border-red-300 bg-red-50/40" : "border-line bg-bg-soft/60 hover:border-accent/50",
          )}
        >
          <UploadCloud className="size-7 text-accent-strong" aria-hidden="true" />
          <p className="text-[14.5px] text-ink">
            Drag and drop, or{" "}
            <button type="button" onClick={() => input.current?.click()} className="font-semibold text-accent-strong underline-offset-4 hover:underline" aria-describedby={`${id}-label ${id}-rules`}>
              browse files
            </button>
          </p>
          <p id={`${id}-rules`} className="text-[12.5px] text-ink-soft">
            {formatList(kind)} · up to {MAX_FILE_LABEL} each{maxCount > 1 ? ` · ${maxCount} files max` : ""}
          </p>
          <input
            ref={input}
            type="file"
            accept={acceptFor(kind)}
            multiple={maxCount > 1}
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
            onChange={(e) => {
              if (e.target.files) void handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>
      )}

      {(value.length > 0 || uploading.length > 0) && (
        <ul className="mt-3 flex flex-col gap-2">
          {value.map((file) => (
            <li key={file.id} className="flex items-center gap-3 rounded-xl border border-line bg-white px-4 py-3">
              <FileText className="size-5 shrink-0 text-accent-strong" aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate text-[14px] font-medium text-ink">{file.name}</span>
              <span className="shrink-0 text-[12.5px] text-ink-soft">{formatSize(file.size)}</span>
              <button type="button" onClick={() => remove(file)} aria-label={`Remove ${file.name}`} className="grid size-8 shrink-0 place-items-center rounded-full text-ink-soft transition-colors hover:bg-red-50 hover:text-red-600">
                <Trash2 className="size-4" aria-hidden="true" />
              </button>
            </li>
          ))}
          {uploading.map((u) => (
            <li key={u.key} className="rounded-xl border border-accent/30 bg-bg-blue/50 px-4 py-3">
              <div className="flex items-center gap-3">
                <Loader2 className="size-4.5 shrink-0 animate-spin text-accent-strong" aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate text-[14px] text-ink">{u.name}</span>
                <span className="text-[12.5px] text-ink-soft tabular-nums">{u.progress}%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white" role="progressbar" aria-valuenow={u.progress} aria-valuemin={0} aria-valuemax={100} aria-label={`Uploading ${u.name}`}>
                <div className="h-full rounded-full bg-accent-strong transition-[width]" style={{ width: `${u.progress}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}

      {hint && !shownError && <p className="mt-1.5 text-[12.5px] text-ink-soft">{hint}</p>}
      {shownError && (
        <p role="alert" className="mt-1.5 text-[13px] font-medium text-red-600">
          {shownError}
        </p>
      )}
    </div>
  );
}
