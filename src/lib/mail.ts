import nodemailer from "nodemailer";
import type { ContactFormValues } from "./contact-schema";

export type MailResult = { status: "sent" } | { status: "not_configured" } | { status: "failed"; detail: string };

const HTML_ESCAPES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => HTML_ESCAPES[character] ?? character);

type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  to: string[];
  from: string;
};

function smtpConfig(): SmtpConfig | null {
  const host = process.env.SMTP_HOST?.trim();
  const port = Number(process.env.SMTP_PORT);
  const user = process.env.SMTP_USER?.trim();
  const password = process.env.SMTP_PASSWORD || process.env.SMTP_PASS;
  const to = process.env.CONTACT_TO_EMAIL?.split(",").map((email) => email.trim()).filter(Boolean);
  const from = process.env.CONTACT_FROM_EMAIL?.trim() || user;

  if (!host || !Number.isInteger(port) || port < 1 || port > 65_535 || !user || !password || !to?.length || !from) return null;

  return {
    host,
    port,
    secure: process.env.SMTP_SECURE?.toLowerCase() === "true" || port === 465,
    user,
    password,
    to,
    from,
  };
}

export function isMailConfigured(): boolean {
  return smtpConfig() !== null;
}

function enquiryContent(data: ContactFormValues) {
  const rows: [string, string | undefined][] = [
    ["Name", data.fullName],
    ["Email", data.email],
    ["Phone", data.phone],
    ["Company", data.company],
    ["Project type", data.projectType],
  ];
  const details = rows.filter((row): row is [string, string] => Boolean(row[1]));
  const tableRows = details.map(([label, value]) => "<tr><td><strong>" + label + "</strong></td><td>" + escapeHtml(value) + "</td></tr>").join("");

  return {
    text: ["New project enquiry", "", ...details.map(([label, value]) => label + ": " + value), "", "Description:", data.description].join("\n"),
    html: "<h2>New project enquiry</h2><table cellpadding=\"6\">" + tableRows + "</table><h3>Description</h3><p style=\"white-space:pre-wrap\">" + escapeHtml(data.description) + "</p>",
  };
}

function acknowledgementContent(data: ContactFormValues) {
  return {
    text: [
      "Hi " + data.fullName + ",",
      "",
      "Thank you for contacting IKASLE Technologies. We have received your enquiry and our team will get back to you as soon as possible.",
      "",
      "Project type: " + data.projectType,
      "",
      "Regards,",
      "IKASLE Technologies",
    ].join("\n"),
    html:
      "<div style=\"font-family:Arial,sans-serif;color:#08283c;line-height:1.6\">" +
      "<h2 style=\"margin-bottom:12px\">Thank you for contacting IKASLE Technologies</h2>" +
      "<p>Hi " + escapeHtml(data.fullName) + ",</p>" +
      "<p>We have received your enquiry and our team will get back to you as soon as possible.</p>" +
      "<p><strong>Project type:</strong> " + escapeHtml(data.projectType) + "</p>" +
      "<p style=\"margin-top:24px\">Regards,<br><strong>IKASLE Technologies</strong></p></div>",
  };
}

/** Sends the enquiry and submitter acknowledgement through server-side SMTP. */
export async function sendContactEmail(data: ContactFormValues): Promise<MailResult> {
  const config = smtpConfig();
  if (!config) return { status: "not_configured" };

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: { user: config.user, pass: config.password },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });

  try {
    await Promise.all([
      transporter.sendMail({
        from: config.from,
        to: config.to,
        replyTo: data.email,
        subject: "New enquiry: " + data.projectType + " — " + data.fullName,
        ...enquiryContent(data),
      }),
      transporter.sendMail({
        from: config.from,
        to: data.email,
        replyTo: config.to[0],
        subject: "We received your enquiry — IKASLE Technologies",
        ...acknowledgementContent(data),
      }),
    ]);
    return { status: "sent" };
  } catch (error) {
    return { status: "failed", detail: error instanceof Error ? error.message : "Unknown SMTP error" };
  } finally {
    transporter.close();
  }
}
