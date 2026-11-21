import { NextResponse, type NextRequest } from "next/server";
import { isDatabaseConfigured } from "@/lib/careers/server/db";
import { isCrossOrigin, jsonError, UUID_PATTERN } from "@/lib/careers/server/http";
import { deleteDraftUpload } from "@/lib/careers/server/repository";

export const runtime = "nodejs";

/** Remove a not-yet-submitted upload (the form's "remove file" button). Requires the same draft ID that uploaded it. */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (isCrossOrigin(req)) return jsonError("bad_request", "Cross-origin requests are not allowed.", 403);
  if (!isDatabaseConfigured()) return jsonError("not_configured", "Online applications are not available right now.", 503);
  const { id } = await params;
  const draftId = req.nextUrl.searchParams.get("draftId") ?? "";
  if (!UUID_PATTERN.test(id) || !UUID_PATTERN.test(draftId)) return jsonError("bad_request", "Invalid request.", 400);
  try {
    await deleteDraftUpload(id, draftId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[careers] delete upload failed", error);
    return jsonError("server_error", "Could not remove the file.", 500);
  }
}
