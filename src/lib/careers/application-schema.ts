import { z } from "zod";
import { getJob, jobs, type RoleKind } from "@/data/careers";
import { internshipTracks, roleFormConfig } from "./form-config";

/**
 * The job application, validated by the multi-step form (React Hook Form) and again by the API before saving.
 * Fields are flat so each step can validate just its own fields. Role-dependent rules (internship track, required
 * portfolio links, company when employed) live in the superRefine at the bottom.
 */

export const GENERAL_POSITION = "general";
export const positionOptions = [...jobs.map((j) => ({ value: j.slug, label: j.title })), { value: GENERAL_POSITION, label: "General application (any suitable role)" }];

export const roleKindFor = (position: string): RoleKind | "general" => getJob(position)?.roleKind ?? "general";
export const positionTitle = (position: string) => getJob(position)?.title ?? "General Application";

export const EXPERIENCE_OPTIONS = ["Fresher", "Less than 1 year", "1–2 years", "2–3 years", "3–5 years", "5+ years"] as const;
export const EMPLOYMENT_OPTIONS = ["Employed", "Freelancing", "Not currently employed", "Student"] as const;
export const NOTICE_OPTIONS = ["Immediate", "15 days", "30 days", "45 days", "60 days", "90 days"] as const;
export const QUALIFICATION_OPTIONS = ["Diploma", "Bachelor's degree", "Master's degree", "Doctorate", "Currently pursuing a degree", "Other"] as const;
export const HEARD_FROM_OPTIONS = ["LinkedIn", "Instagram", "Company website", "Job portal", "Friend or employee referral", "College / placement cell", "Other"] as const;
export const YES_NO = ["Yes", "No"] as const;

const text = (max: number) => z.string().trim().max(max, `Please keep this under ${max} characters.`);
const required = (label: string, max = 200) => text(max).min(1, `Please enter ${label}.`);
const optional = (max = 200) => text(max).optional().or(z.literal(""));
const choice = <T extends readonly [string, ...string[]]>(values: T, message: string) =>
  z.string().refine((v) => (values as readonly string[]).includes(v), message);

const PHONE_MESSAGE = "Please enter a valid phone number (10–13 digits, optionally starting with +).";
const isPhone = (v: string) => /^\+?[\d\s-]+$/.test(v) && (v.match(/\d/g)?.length ?? 0) >= 10 && (v.match(/\d/g)?.length ?? 0) <= 13;
const isUrl = (v: string) => {
  try {
    const url = new URL(v);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
};
const optionalUrl = optional(300).refine((v) => !v || isUrl(v), "Please enter a full link starting with https://");

const fileRefSchema = z.object({ id: z.uuid(), name: z.string().max(200), size: z.number().int().nonnegative() });
export type FileRef = z.infer<typeof fileRefSchema>;

const currentYear = new Date().getFullYear();

/** All fields with their own rules. Cross-field rules are in `conditionalIssues`; the full schema is below. */
export const applicationObject = z.object({
    // 1. Personal
    fullName: required("your full name", 100).refine((v) => /^[\p{L}\s.'’-]+$/u.test(v), "Please use letters only in your name."),
    email: z.string().trim().max(160).pipe(z.email("Please enter a valid email address.")),
    mobile: text(20).refine(isPhone, PHONE_MESSAGE),
    whatsapp: optional(20).refine((v) => !v || isPhone(v), PHONE_MESSAGE),
    location: required("your current location", 120),
    dateOfBirth: optional(10).refine((v) => !v || (/^\d{4}-\d{2}-\d{2}$/.test(v) && new Date(v) < new Date()), "Please enter a valid date of birth."),
    linkedin: optionalUrl,
    website: optionalUrl,

    // 2. Professional
    position: z.string().refine((v) => v === GENERAL_POSITION || Boolean(getJob(v)), "Please choose the position you're applying for."),
    internshipTrack: optional(60),
    totalExperience: choice(EXPERIENCE_OPTIONS, "Please choose your total experience."),
    employmentStatus: choice(EMPLOYMENT_OPTIONS, "Please choose your current employment status."),
    currentCompany: optional(120),
    currentDesignation: optional(120),
    currentCtc: optional(40),
    expectedSalary: optional(40),
    noticePeriod: optional(20),
    joiningDate: optional(10).refine((v) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v), "Please enter a valid date."),

    // 3. Skills & experience
    primarySkills: required("your primary skills", 300),
    roleSkills: z.array(text(60)).max(30),
    tools: z.array(text(60)).max(30),
    relevantExperience: choice(EXPERIENCE_OPTIONS, "Please choose your experience in this field."),
    summary: text(1500).min(60, "Please write at least 60 characters about yourself."),
    projects: optional(2000),
    portfolioLinks: optional(1000),
    roleLinks: z.record(z.string(), optional(300)),

    // 4. Education
    qualification: choice(QUALIFICATION_OPTIONS, "Please choose your highest qualification."),
    institution: required("your college or university", 160),
    graduationYear: text(4).refine((v) => /^\d{4}$/.test(v) && Number(v) >= 1970 && Number(v) <= currentYear + 6, "Please enter a valid year."),
    certifications: optional(1000),

    // 5. Documents (uploaded separately; these reference the stored files)
    resume: fileRefSchema.nullable().refine((v) => Boolean(v), "Please upload your resume."),
    portfolioFile: fileRefSchema.nullable(),
    workSamples: z.array(fileRefSchema).max(5),
    supportingDocs: z.array(fileRefSchema).max(3),

    // 6. Additional questions
    whyJoin: text(1500).min(30, "Please write at least 30 characters."),
    whyHire: text(1500).min(30, "Please write at least 30 characters."),
    careerGoals: text(1500).min(20, "Please write at least 20 characters."),
    teamwork: choice(YES_NO, "Please choose an answer."),
    officeWork: choice(YES_NO, "Please choose an answer."),
    heardFrom: choice(HEARD_FROM_OPTIONS, "Please tell us how you heard about us."),

    // 7. Declaration
    privacyConsent: z.boolean().refine((v) => v, "Please agree to the privacy terms to continue."),
    accuracyConfirmed: z.boolean().refine((v) => v, "Please confirm your information is accurate."),

    // Anti-spam and upload ownership
    draftId: z.uuid(),
    startedAt: z.number().int().positive(),
    /** Honeypot: hidden from people, often filled by bots. */
    nickname: z.string().max(0).optional(),
});

export type ApplicationValues = z.infer<typeof applicationObject>;

/**
 * Rules that depend on other answers (the role applied for, employment status). Kept separate so each form step
 * can apply them even while later steps are still empty — Zod skips object-level refinements when any field fails.
 */
export function conditionalIssues(data: Partial<ApplicationValues>): { path: string; message: string }[] {
  const issues: { path: string; message: string }[] = [];
  const issue = (path: string, message: string) => issues.push({ path, message });
  const kind = roleKindFor(data.position ?? "");

  if (kind === "intern") {
    if (!(internshipTracks as readonly string[]).includes(data.internshipTrack ?? "")) issue("internshipTrack", "Please choose your internship track.");
  } else {
    if (!data.expectedSalary) issue("expectedSalary", "Please enter your expected salary.");
    if (!(NOTICE_OPTIONS as readonly string[]).includes(data.noticePeriod ?? "")) issue("noticePeriod", "Please choose your notice period.");
    if (!data.joiningDate) issue("joiningDate", "Please choose your earliest joining date.");
  }
  if (data.employmentStatus === "Employed") {
    if (!data.currentCompany) issue("currentCompany", "Please enter your current company.");
    if (!data.currentDesignation) issue("currentDesignation", "Please enter your current designation.");
  }
  for (const link of roleFormConfig[kind].links) {
    const value = data.roleLinks?.[link.key] ?? "";
    if (link.required && !value) issue(`roleLinks.${link.key}`, `Please add your ${link.label.toLowerCase()}.`);
    else if (value && !isUrl(value)) issue(`roleLinks.${link.key}`, "Please enter a full link starting with https://");
  }
  return issues;
}

/** The complete application, as the API validates it. */
export const applicationSchema = applicationObject.superRefine((data, ctx) => {
  for (const { path, message } of conditionalIssues(data)) ctx.addIssue({ code: "custom", path: path.split("."), message });
});

/** Fields validated when leaving each step (index = step). The review step validates everything. */
export const stepFields: (keyof ApplicationValues | `roleLinks.${string}`)[][] = [
  ["fullName", "email", "mobile", "whatsapp", "location", "dateOfBirth", "linkedin", "website"],
  ["position", "internshipTrack", "totalExperience", "employmentStatus", "currentCompany", "currentDesignation", "currentCtc", "expectedSalary", "noticePeriod", "joiningDate"],
  ["primarySkills", "roleSkills", "tools", "relevantExperience", "summary", "projects", "portfolioLinks", "roleLinks"],
  ["qualification", "institution", "graduationYear", "certifications"],
  ["resume", "portfolioFile", "workSamples", "supportingDocs"],
  ["whyJoin", "whyHire", "careerGoals", "teamwork", "officeWork", "heardFrom"],
  ["privacyConsent", "accuracyConfirmed"],
];

export const stepTitles = ["Personal Information", "Professional Information", "Skills & Experience", "Education Details", "Resume & Documents", "Additional Questions", "Review & Submit"];

/** Empty starting values for a new application. */
export function emptyApplication(position: string): ApplicationValues {
  return {
    fullName: "",
    email: "",
    mobile: "",
    whatsapp: "",
    location: "",
    dateOfBirth: "",
    linkedin: "",
    website: "",
    position,
    internshipTrack: "",
    totalExperience: "",
    employmentStatus: "",
    currentCompany: "",
    currentDesignation: "",
    currentCtc: "",
    expectedSalary: "",
    noticePeriod: "",
    joiningDate: "",
    primarySkills: "",
    roleSkills: [],
    tools: [],
    relevantExperience: "",
    summary: "",
    projects: "",
    portfolioLinks: "",
    roleLinks: {},
    qualification: "",
    institution: "",
    graduationYear: "",
    certifications: "",
    resume: null,
    portfolioFile: null,
    workSamples: [],
    supportingDocs: [],
    whyJoin: "",
    whyHire: "",
    careerGoals: "",
    teamwork: "",
    officeWork: "",
    heardFrom: "",
    privacyConsent: false,
    accuracyConfirmed: false,
    draftId: "00000000-0000-4000-8000-000000000000",
    startedAt: Date.now(),
    nickname: "",
  } as ApplicationValues;
}

/** Shape of the API's reply to a submitted application. */
export type SubmitResponse =
  | { ok: true; reference: string; position: string; submittedAt: string }
  | { ok: false; code: "validation" | "rate_limited" | "not_configured" | "bad_request" | "server_error"; message: string; fieldErrors?: Record<string, string> };

/** Application statuses the admin can set, in pipeline order. */
export const APPLICATION_STATUSES = ["new", "under_review", "shortlisted", "interview_scheduled", "selected", "rejected"] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];
export const statusLabels: Record<ApplicationStatus, string> = {
  new: "New",
  under_review: "Under Review",
  shortlisted: "Shortlisted",
  interview_scheduled: "Interview Scheduled",
  selected: "Selected",
  rejected: "Rejected",
};

/** Reference IDs look like IKT-2611-7F3K9Q. */
export const REFERENCE_PATTERN = /^IKT-\d{4}-[A-Z0-9]{6}$/;
