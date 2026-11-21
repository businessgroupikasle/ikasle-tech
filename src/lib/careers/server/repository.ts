import { randomInt, randomUUID } from "node:crypto";
import type { ApplicationStatus, ApplicationValues } from "../application-schema";
import { positionTitle } from "../application-schema";
import type { FileKind } from "../file-rules";
import type { CheckedFile } from "./file-check";
import { DOCUMENTS_BUCKET, ensureDocumentsBucket, supabaseAdmin } from "./db";

/**
 * Every careers read and write, on Supabase: tables via the API, the atomic steps via the database functions in
 * supabase/migrations (create_career_application, update_career_application, career_status_counts), and documents
 * in the private Storage bucket.
 */

/** Unattached uploads (abandoned forms) are deleted after this long. */
const ORPHAN_HOURS = 24;

const fail = (what: string, error: { message: string } | null) => {
  if (error) throw new Error(`[careers] ${what}: ${error.message}`);
};

// ---------- Uploads ----------

/** Removes documents uploaded by forms that were never submitted (best effort, a batch at a time). */
async function removeOrphans() {
  const db = supabaseAdmin();
  const cutoff = new Date(Date.now() - ORPHAN_HOURS * 3600_000).toISOString();
  const { data } = await db.from("career_application_files").select("id, storage_path").is("application_id", null).lt("created_at", cutoff).limit(100);
  if (!data?.length) return;
  await db.storage.from(DOCUMENTS_BUCKET).remove(data.map((f) => f.storage_path as string));
  await db.from("career_application_files").delete().in("id", data.map((f) => f.id as string));
}

export async function saveUpload(draftId: string, kind: FileKind, file: CheckedFile) {
  await ensureDocumentsBucket();
  removeOrphans().catch((error) => console.error("[careers] orphan cleanup failed", error));

  const db = supabaseAdmin();
  const id = randomUUID();
  // Draft and file IDs in the path; the original name is kept (sanitised) for readable downloads.
  const path = `${draftId}/${id}/${file.name.replace(/[^\w.-]+/g, "_")}`;
  const { error: uploadError } = await db.storage.from(DOCUMENTS_BUCKET).upload(path, file.bytes, { contentType: file.mime, upsert: false });
  fail("upload", uploadError);

  const { error } = await db.from("career_application_files").insert({
    id,
    draft_id: draftId,
    kind,
    file_name: file.name,
    mime_type: file.mime,
    size_bytes: file.bytes.length,
    storage_path: path,
  });
  if (error) {
    await db.storage.from(DOCUMENTS_BUCKET).remove([path]);
    fail("save upload", error);
  }
  return { id, name: file.name, size: file.bytes.length };
}

/** Removes a not-yet-submitted upload, only for the draft that uploaded it. */
export async function deleteDraftUpload(id: string, draftId: string) {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("career_application_files")
    .delete()
    .eq("id", id)
    .eq("draft_id", draftId)
    .is("application_id", null)
    .select("storage_path");
  fail("delete upload", error);
  if (data?.length) await db.storage.from(DOCUMENTS_BUCKET).remove(data.map((f) => f.storage_path as string));
  return Boolean(data?.length);
}

// ---------- Applications ----------

const REFERENCE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O or 1/I mix-ups
function newReference(now: Date) {
  const yymm = `${String(now.getUTCFullYear()).slice(2)}${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  const random = Array.from({ length: 6 }, () => REFERENCE_ALPHABET[randomInt(REFERENCE_ALPHABET.length)]).join("");
  return `IKT-${yymm}-${random}`;
}

export class AttachmentError extends Error {}

/**
 * Saves an application and attaches its uploaded files in one transaction (create_career_application). Every
 * referenced file must belong to this draft, be unattached and be of the expected kind — otherwise nothing is saved.
 */
export async function createApplication(values: ApplicationValues) {
  const files: { id: string; kind: FileKind }[] = [];
  if (values.resume) files.push({ id: values.resume.id, kind: "resume" });
  if (values.portfolioFile) files.push({ id: values.portfolioFile.id, kind: "portfolio" });
  for (const f of values.workSamples) files.push({ id: f.id, kind: "work_sample" });
  for (const f of values.supportingDocs) files.push({ id: f.id, kind: "supporting" });

  // Store the answers, minus form plumbing.
  const answers: Record<string, unknown> = { ...values };
  delete answers.draftId;
  delete answers.startedAt;
  delete answers.nickname;
  const title = positionTitle(values.position);

  for (let attempt = 0; attempt < 5; attempt++) {
    const reference = newReference(new Date());
    const { data, error } = await supabaseAdmin().rpc("create_career_application", {
      p_reference: reference,
      p_job_slug: values.position,
      p_job_title: title,
      p_full_name: values.fullName,
      p_email: values.email,
      p_phone: values.mobile,
      p_data: answers,
      p_draft_id: values.draftId,
      p_files: files,
    });
    if (error?.code === "23505") continue; // reference collision: try another
    if (error?.message === "files_not_found") throw new AttachmentError("One or more uploaded files could not be found. Please upload them again.");
    fail("create application", error);
    const row = (data as { id: string; created_at: string }[] | null)?.[0];
    if (!row) throw new Error("[careers] create application returned no row");
    return { id: row.id, reference, title, submittedAt: new Date(row.created_at).toISOString() };
  }
  throw new Error("[careers] Could not allocate an application reference.");
}

// ---------- Admin ----------

type ApplicationListRow = {
  id: string;
  reference: string;
  job_slug: string;
  job_title: string;
  status: ApplicationStatus;
  full_name: string;
  email: string;
  phone: string;
  created_at: Date;
};

export const PAGE_SIZE = 25;

const LIST_COLUMNS = "id, reference, job_slug, job_title, status, full_name, email, phone, created_at";
const withDate = <T extends { created_at: string | Date }>(row: T) => ({ ...row, created_at: new Date(row.created_at) });

export async function listApplications(filters: { status?: string; position?: string; q?: string; page?: number }) {
  const db = supabaseAdmin();
  const page = Math.max(1, filters.page ?? 1);
  let list = db
    .from("career_applications")
    .select(LIST_COLUMNS, { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  if (filters.status) list = list.eq("status", filters.status);
  if (filters.position) list = list.eq("job_slug", filters.position);
  // Characters that are syntax in an `or` filter are dropped; the rest is matched case-insensitively.
  const q = filters.q?.replace(/[,()"\\*%]/g, " ").trim();
  if (q) list = list.or(["full_name", "email", "reference", "phone"].map((col) => `${col}.ilike."*${q}*"`).join(","));

  const [rows, counts] = await Promise.all([list, db.rpc("career_status_counts")]);
  fail("list applications", rows.error);
  fail("status counts", counts.error);

  return {
    rows: (rows.data ?? []).map((r) => withDate(r as unknown as ApplicationListRow)),
    total: rows.count ?? 0,
    page,
    statusCounts: Object.fromEntries(((counts.data ?? []) as { status: ApplicationStatus; count: number }[]).map((r) => [r.status, Number(r.count)])) as Partial<
      Record<ApplicationStatus, number>
    >,
  };
}

export type ApplicationDetail = ApplicationListRow & {
  data: Omit<ApplicationValues, "draftId" | "startedAt" | "nickname">;
  admin_notes: string;
  updated_at: Date;
  files: { id: string; kind: FileKind; file_name: string; mime_type: string; size_bytes: number }[];
  history: { status: ApplicationStatus; changed_at: Date }[];
};

export async function getApplication(id: string): Promise<ApplicationDetail | null> {
  const db = supabaseAdmin();
  const { data: app, error } = await db.from("career_applications").select("*").eq("id", id).maybeSingle();
  fail("get application", error);
  if (!app) return null;
  const [files, history] = await Promise.all([
    db.from("career_application_files").select("id, kind, file_name, mime_type, size_bytes").eq("application_id", id).order("kind").order("created_at"),
    db.from("career_status_history").select("status, changed_at").eq("application_id", id).order("changed_at").order("id"),
  ]);
  fail("get files", files.error);
  fail("get history", history.error);
  return {
    ...(app as unknown as ApplicationDetail),
    created_at: new Date(app.created_at as string),
    updated_at: new Date(app.updated_at as string),
    files: (files.data ?? []) as ApplicationDetail["files"],
    history: ((history.data ?? []) as { status: ApplicationStatus; changed_at: string }[]).map((h) => ({ status: h.status, changed_at: new Date(h.changed_at) })),
  };
}

/** Updates status and/or notes; a status change is recorded in the history. Returns false if not found. */
export async function updateApplication(id: string, changes: { status?: ApplicationStatus; notes?: string }) {
  const { data, error } = await supabaseAdmin().rpc("update_career_application", { p_id: id, p_status: changes.status ?? null, p_notes: changes.notes ?? null });
  fail("update application", error);
  return Boolean(data);
}

/** A submitted application's file, for admin download. Draft (unsubmitted) files are never served. */
export async function getApplicationFile(id: string) {
  const db = supabaseAdmin();
  const { data: meta, error } = await db
    .from("career_application_files")
    .select("file_name, mime_type, storage_path")
    .eq("id", id)
    .not("application_id", "is", null)
    .maybeSingle();
  fail("get file", error);
  if (!meta) return null;
  const { data: blob, error: downloadError } = await db.storage.from(DOCUMENTS_BUCKET).download(meta.storage_path as string);
  fail("download file", downloadError);
  if (!blob) return null;
  return { file_name: meta.file_name as string, mime_type: meta.mime_type as string, content: Buffer.from(await blob.arrayBuffer()) };
}
