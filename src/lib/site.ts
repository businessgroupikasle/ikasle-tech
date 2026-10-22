const clean = (value: string | undefined) => (value && value.trim().length > 0 ? value.trim() : null);

export const siteConfig = {
  name: "IKASLE Technologies",
  shortName: "IKASLE",
  tagline: "We Build the Future in Code.",
  description:
    "IKASLE Technologies is a software engineering company building custom software, web and mobile applications, ERP platforms and intelligent automation.",
  url: (clean(process.env.NEXT_PUBLIC_SITE_URL) ?? "http://localhost:3000").replace(/\/$/, ""),
  /**
   * Company contact details are intentionally not hard-coded.
   * Configure them with NEXT_PUBLIC_* environment variables (see .env.example);
   * anything left empty is hidden from the UI.
   */
  contact: {
    email: clean(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
    phone: clean(process.env.NEXT_PUBLIC_CONTACT_PHONE),
    address: clean(process.env.NEXT_PUBLIC_CONTACT_ADDRESS),
  },
  social: {
    linkedin: clean(process.env.NEXT_PUBLIC_LINKEDIN_URL),
    github: clean(process.env.NEXT_PUBLIC_GITHUB_URL),
  },
} as const;

export function absoluteUrl(path = "/"): string {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
