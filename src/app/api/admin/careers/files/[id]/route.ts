import type { NextRequest } from "next/server";
import { isAdmin } from "@/lib/careers/server/admin-auth";
import { jsonError, UUID_PATTERN } from "@/lib/careers/server/http";
import { getApplicationFile } from "@/lib/careers/server/repository";

export const runtime = "nodejs";

/** Admin: download an application document. Always served as an attachment so it never runs in the browser. */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return jsonError("unauthorized", "Please log in.", 401);
  const { id } = await params;
  if (!UUID_PATTERN.test(id)) return jsonError("bad_request", "Invalid file.", 400);

  const file = await getApplicationFile(id);
  if (!file) return jsonError("not_found", "File not found.", 404);

  const asciiName = file.file_name.replace(/[^\x20-\x7e]/g, "_").replace(/"/g, "");
  return new Response(new Uint8Array(file.content), {
    headers: {
      "Content-Type": file.mime_type,
      "Content-Length": String(file.content.length),
      "Content-Disposition": `attachment; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(file.file_name)}`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
    },
  });
}
