/**
 * Blog content model. Articles are plain typed data (no MDX/CMS dependency): a list of content blocks
 * that maps 1:1 onto portable formats (MDX, Portable Text, headless-CMS rich text) when the blog moves to a CMS.
 */

export const blogCategories = [
  "Software Development",
  "Web Development",
  "Mobile Applications",
  "ERP & Business Automation",
  "AI & Emerging Technologies",
  "UI/UX Design",
] as const;

export type BlogCategory = (typeof blogCategories)[number];

/** Inline text: plain string, a link, inline code or emphasis. */
export type Inline = string | { text: string; href: string } | { code: string } | { strong: string };

export type Block =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; content: Inline[] }
  | { type: "list"; ordered?: boolean; items: Inline[][] }
  | { type: "quote"; content: Inline[]; cite?: string }
  | { type: "code"; language: string; code: string; filename?: string }
  | { type: "table"; headers: string[]; rows: string[][]; caption?: string }
  | { type: "image"; src: string; alt: string; caption?: string; width: number; height: number };

export type BlogPost = {
  slug: string;
  title: string;
  /** One or two sentences: card excerpt, meta description and Open Graph description. */
  description: string;
  category: BlogCategory;
  /** Topic keywords used by the search box (in addition to title and description). */
  tags: string[];
  cover: { src: string; alt: string; width: number; height: number };
  /** Only real, approved names — leave null rather than inventing one. */
  author: string | null;
  /** ISO date (YYYY-MM-DD) of actual publication. Null until the article is published. */
  publishedAt: string | null;
  /** Drafts never appear publicly (listing, article routes, sitemap). */
  draft: boolean;
  body: Block[];
};
