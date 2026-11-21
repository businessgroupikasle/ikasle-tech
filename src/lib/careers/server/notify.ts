import { escapeHtml, sendTeamNotification } from "@/lib/mail";
import { absoluteUrl } from "@/lib/site";
import type { ApplicationValues } from "../application-schema";

/**
 * Emails the hiring team about a new application (link to the admin dashboard, no attachments — files stay in the
 * database) and sends the candidate an acknowledgement with their reference. Skipped quietly when SMTP isn't set up;
 * the application is already saved either way.
 */
export async function notifyNewApplication(app: { id: string; reference: string; title: string }, values: ApplicationValues) {
  const adminUrl = absoluteUrl(`/admin/careers/${app.id}`);
  const rows: [string, string][] = [
    ["Reference", app.reference],
    ["Position", values.internshipTrack ? `${app.title} — ${values.internshipTrack}` : app.title],
    ["Name", values.fullName],
    ["Email", values.email],
    ["Mobile", values.mobile],
    ["Location", values.location],
    ["Experience", values.totalExperience],
  ];
  const to = process.env.CAREERS_TO_EMAIL?.split(",").map((e) => e.trim()).filter(Boolean);

  return sendTeamNotification({
    to,
    replyTo: values.email,
    subject: `New application: ${app.title} — ${values.fullName} (${app.reference})`,
    text: ["New job application", "", ...rows.map(([k, v]) => `${k}: ${v}`), "", `Review it in the dashboard: ${adminUrl}`].join("\n"),
    html:
      `<h2>New job application</h2><table cellpadding="6">` +
      rows.map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${escapeHtml(v)}</td></tr>`).join("") +
      `</table><p><a href="${escapeHtml(adminUrl)}">Review the application in the dashboard</a></p>`,
    acknowledgement: {
      to: values.email,
      subject: `We received your application — ${app.title} (${app.reference})`,
      text: [
        `Hi ${values.fullName},`,
        "",
        `Thank you for applying for the ${app.title} position at IKASLÉ Technologies.`,
        `Your application reference is ${app.reference}.`,
        "",
        "Our recruitment team will review your application and contact you if your profile matches our requirements.",
        "",
        "Regards,",
        "IKASLÉ Technologies",
      ].join("\n"),
      html:
        `<div style="font-family:Arial,sans-serif;color:#08283c;line-height:1.6">` +
        `<h2>Thank you for your application</h2><p>Hi ${escapeHtml(values.fullName)},</p>` +
        `<p>Thank you for applying for the <strong>${escapeHtml(app.title)}</strong> position at IKASLÉ Technologies.</p>` +
        `<p>Your application reference is <strong>${app.reference}</strong>.</p>` +
        `<p>Our recruitment team will review your application and contact you if your profile matches our requirements.</p>` +
        `<p style="margin-top:24px">Regards,<br><strong>IKASLÉ Technologies</strong></p></div>`,
    },
  });
}
