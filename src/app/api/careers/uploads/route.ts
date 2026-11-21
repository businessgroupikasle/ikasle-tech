import { NextResponse, type NextRequest } from "next/server";
import { fileKinds, MAX_FILE_BYTES, type FileKind } from "@/lib/careers/file-rules";
import { isDatabaseConfigured } from "@/lib/careers/server/db";
import { checkUpload } from "@/lib/careers/server/file-check";
import { clientIp, isCrossOrigin, jsonError, UUID_PATTERN } from "@/lib/careers/server/http";
import { saveUpload } from "@/lib/careers/server/repository";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

/**
 * Upload one application document (multipart: file, kind, draftId). Files are stored unattached against the form's
 * draft ID and linked to the application when it's submitted; unsubmitted uploads are removed after 24 hours.
 */
export async function POST(req: NextRequest) {
  if (isCrossOrigin(req)) return jsonError("bad_request", "Cross-origin requests are not allowed.", 403);
  if (!isDatabaseConfigured()) return jsonError("not_configured", "Online applications are not available right now.", 503);
  if (Number(req.headers.get("content-length") ?? 0) > MAX_FILE_BYTES + 64 * 1024) return jsonError("too_large", "Files must be 4 MB or smaller.", 413);

  const limit = rateLimit(`careers-upload:${clientIp(req)}`, 30, 30 * 60_000);
  if (!limit.allowed) return jsonError("rate_limited", "Too many uploads. Please try again a little later.", 429, { "Retry-After": String(limit.retryAfter) });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return jsonError("bad_request", "Invalid upload.", 400);
  }
  const file = form.get("file");
  const kind = String(form.get("kind") ?? "") as FileKind;
  const draftId = String(form.get("draftId") ?? "");
  if (!(file instanceof File) || !(kind in fileKinds) || !UUID_PATTERN.test(draftId)) return jsonError("bad_request", "Invalid upload.", 400);

  const checked = await checkUpload(file, kind);
  if (!checked.ok) return jsonError("invalid_file", checked.message, 422);

  try {
    const saved = await saveUpload(draftId, kind, checked.file);
    return NextResponse.json({ ok: true, file: saved });
  } catch (error) {
    console.error("[careers] upload failed", error);
    return jsonError("server_error", "We couldn't save this file. Please try again.", 500);
  }
}
