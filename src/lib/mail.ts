import type { ContactFormValues } from "./contact-schema";

// Server-only module: imported exclusively by app/api/contact/route.ts.

export type MailResult = { status: "sent" } | { status: "not_configured" } | { status: "failed"; detail: string };

const HTML_ESCAPES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => HTML_ESCAPES[c] ?? c);

export function isMailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL && process.env.CONTACT_FROM_EMAIL);
}

/** Sends the enquiry via the Resend HTTP API. Credentials never leave the server. */
export async function sendContactEmail(data: ContactFormValues): Promise<MailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) return { status: "not_configured" };

  const rows: [string, string | undefined][] = [
    ["Name", data.fullName],
    ["Email", data.email],
    ["Phone", data.phone],
    ["Company", data.company],
    ["Project type", data.projectType],
  ];
  const html = `
    <h2>New project enquiry</h2>
    <table cellpadding="6">${rows
      .filter((row): row is [string, string] => Boolean(row[1]))
      .map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${escapeHtml(v)}</td></tr>`)
      .join("")}</table>
    <h3>Description</h3>
    <p style="white-space:pre-wrap">${escapeHtml(data.description)}</p>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: to.split(",").map((s) => s.trim()),
        reply_to: data.email,
        subject: `New enquiry: ${data.projectType} — ${data.fullName}`,
        html,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return { status: "failed", detail: `Provider responded ${res.status}` };
    return { status: "sent" };
  } catch (error) {
    return { status: "failed", detail: error instanceof Error ? error.message : "Unknown error" };
  }
}
