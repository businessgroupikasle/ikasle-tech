import { createAdminClient } from "@supabase/server/core";
import type { SupabaseClient } from "@supabase/supabase-js";
import { fileKinds, formatInfo, MAX_FILE_BYTES } from "../file-rules";

/**
 * Supabase access for the careers portal (server only: route handlers and server components).
 *
 * Configure with SUPABASE_URL and SUPABASE_SECRET_KEY (the `sb_secret_...` key). The tables, functions and the
 * private "career-documents" bucket come from supabase/migrations/20261120000000_careers_portal.sql — run it once
 * in the Supabase SQL Editor. The secret key bypasses RLS; the tables have RLS on with no public policies, so the
 * publishable key can never read applications or documents.
 */

export const DOCUMENTS_BUCKET = "career-documents";

export const isDatabaseConfigured = () =>
  Boolean(process.env.SUPABASE_URL?.trim() && (process.env.SUPABASE_SECRET_KEY?.trim() || process.env.SUPABASE_SECRET_KEYS?.trim()));

// One client per server process (kept on globalThis so dev hot reloads don't create new ones each time).
const globalForSupabase = globalThis as typeof globalThis & { careersSupabase?: SupabaseClient; careersBucketReady?: Promise<void> };

/** Admin client (secret key). Never send its results to the browser unfiltered. */
export function supabaseAdmin(): SupabaseClient {
  globalForSupabase.careersSupabase ??= createAdminClient();
  return globalForSupabase.careersSupabase;
}

/** Makes sure the private documents bucket exists (the migration creates it; this covers a skipped step). */
export function ensureDocumentsBucket(): Promise<void> {
  globalForSupabase.careersBucketReady ??= (async () => {
    const storage = supabaseAdmin().storage;
    const { data } = await storage.getBucket(DOCUMENTS_BUCKET);
    if (data) return;
    const mimeTypes = [...new Set(Object.values(fileKinds).flatMap((k) => k.formats.map((f) => formatInfo[f].mime)))];
    const { error } = await storage.createBucket(DOCUMENTS_BUCKET, { public: false, fileSizeLimit: MAX_FILE_BYTES, allowedMimeTypes: mimeTypes });
    if (error && !/already exists/i.test(error.message)) throw error;
  })().catch((error: unknown) => {
    globalForSupabase.careersBucketReady = undefined; // retry on the next request
    throw error;
  });
  return globalForSupabase.careersBucketReady;
}
