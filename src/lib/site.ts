import { companyContact } from "@/data/company-contact";

const clean = (value: string | undefined) => (value && value.trim().length > 0 ? value.trim() : null);

export const siteConfig = {
  name: "IKASLE Technologies",
  shortName: "IKASLE",
  tagline: "We Build the Future in Code.",
  description:
    "IKASLE Technologies is a software engineering company building custom software, web and mobile applications, ERP platforms and intelligent automation.",
  url: (clean(process.env.NEXT_PUBLIC_SITE_URL) ?? "http://localhost:3000").replace(/\/$/, ""),
  /**
   * The published address comes from the central company contact record so UI and structured data cannot drift.
   * Optional email and phone overrides remain environment-configurable.
   */
  contact: {
    email: clean(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
    phone: clean(process.env.NEXT_PUBLIC_CONTACT_PHONE),
    address: companyContact.address.join(", "),
  },
  social: {
    linkedin: clean(process.env.NEXT_PUBLIC_LINKEDIN_URL),
    github: clean(process.env.NEXT_PUBLIC_GITHUB_URL),
  },
} as const;

export function absoluteUrl(path = "/"): string {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
