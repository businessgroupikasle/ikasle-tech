import { z } from "zod";

export const PROJECT_TYPES = [
  "Software Development",
  "Website Development",
  "Web Application",
  "Mobile Application",
  "ERP Solution",
  "AI & Automation",
  "UI/UX Design",
  "Other",
] as const;


const optionalText = (max: number) =>
  z.string().trim().max(max, `Please keep this under ${max} characters.`).optional().or(z.literal(""));

/** Shared by the client form (React Hook Form) and the server route handler. */
export const contactSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(100, "Please keep your name under 100 characters.")
    .refine((val) => !/\d/.test(val), {
      message: "Full name cannot contain numbers.",
    })
    .refine((val) => /^[\p{L}\s.'’-]+$/u.test(val), {
      message: "Please enter a valid name (letters only).",
    }),
  email: z.string().trim().max(160).pipe(z.email("Please enter a valid business email.")),
  phone: z
    .string()
    .trim()
    .max(30, "Phone number looks too long.")
    .regex(/^[+()\d\s.-]*$/, "Use digits, spaces and + ( ) - only.")
    .optional()
    .or(z.literal("")),
  company: optionalText(120),
  projectType: z.enum(PROJECT_TYPES, { message: "Please choose a project type." }),
  description: z
    .string()
    .trim()
    .min(20, "Tell us a little more — at least 20 characters.")
    .max(4000, "Please keep the description under 4000 characters."),
  /** Honeypot: real users never see or fill this. */
  website: z.string().max(0).optional().or(z.literal("")),
  /** Epoch ms when the form was rendered; used as a simple bot time-trap. */
  startedAt: z.number().int().positive(),
});

export type ContactFormInput = z.input<typeof contactSchema>;
export type ContactFormValues = z.output<typeof contactSchema>;

export type ContactErrorCode =
  | "validation"
  | "rate_limited"
  | "not_configured"
  | "delivery_failed"
  | "spam"
  | "bad_request";

export type ContactResponse =
  | { ok: true }
  | {
      ok: false;
      code: ContactErrorCode;
      message: string;
      fieldErrors?: Partial<Record<keyof ContactFormValues, string>>;
    };
