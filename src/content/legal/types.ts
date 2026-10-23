import type { Inline } from "@/content/blog/types";

export type LegalSection = {
  id: string;
  title: string;
  /** Paragraphs and bullet lists, in order. */
  body: ({ p: Inline[] } | { list: Inline[][] })[];
  /** What the company (and, where relevant, its legal advisers) must confirm before publication. */
  review?: string;
};

export type LegalDocument = {
  title: string;
  intro: string;
  /** "draft" pages show a review banner, are noindex and stay out of the sitemap. */
  status: "draft" | "approved";
  /** ISO date the approved version takes effect. Null while in draft. */
  effectiveDate: string | null;
  sections: LegalSection[];
};
