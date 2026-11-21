import { NextResponse, type NextRequest } from "next/server";
import { APPLICATION_STATUSES, type ApplicationStatus } from "@/lib/careers/application-schema";
import { isAdmin } from "@/lib/careers/server/admin-auth";
import { isCrossOrigin, jsonError, UUID_PATTERN } from "@/lib/careers/server/http";
import { updateApplication } from "@/lib/careers/server/repository";

export const runtime = "nodejs";

/** Admin: change an application's status and/or internal notes. Body: { status?, notes? }. */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (isCrossOrigin(req)) return jsonError("bad_request", "Cross-origin requests are not allowed.", 403);
  if (!(await isAdmin())) return jsonError("unauthorized", "Please log in again.", 401);
  const { id } = await params;
  if (!UUID_PATTERN.test(id)) return jsonError("bad_request", "Invalid application.", 400);

  let body: { status?: unknown; notes?: unknown };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return jsonError("bad_request", "Invalid request.", 400);
  }
  const status = body.status === undefined ? undefined : String(body.status);
  const notes = body.notes === undefined ? undefined : String(body.notes);
  if (status !== undefined && !(APPLICATION_STATUSES as readonly string[]).includes(status)) return jsonError("bad_request", "Unknown status.", 400);
  if (notes !== undefined && notes.length > 5000) return jsonError("bad_request", "Notes are too long.", 400);

  try {
    const found = await updateApplication(id, { status: status as ApplicationStatus | undefined, notes });
    if (!found) return jsonError("not_found", "Application not found.", 404);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[careers] admin update failed", error);
    return jsonError("server_error", "Could not save the change.", 500);
  }
}
