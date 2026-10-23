import { allPosts } from "@/content/blog";
import { blogCategories, type Block, type BlogCategory, type BlogPost, type Inline } from "@/content/blog/types";

export { blogCategories, type BlogCategory, type BlogPost };

/**
 * Maintenance switch: while true, /blog shows the "under maintenance" page, no article routes exist (404),
 * and the blog stays out of search results and the sitemap. Set to false to bring the blog back.
 */
export const blogUnderMaintenance = true;

/**
 * Drafts are visible only on the dev server, or in a preview build with BLOG_PREVIEW_DRAFTS=1.
 * Production builds show published articles only (listing, article routes and sitemap).
 */
export const showDrafts = process.env.NODE_ENV === "development" || process.env.BLOG_PREVIEW_DRAFTS === "1";

/* ---------- validation (runs once at build/start; fails loudly instead of publishing broken content) ---------- */

function validate(posts: BlogPost[]) {
  const seen = new Set<string>();
  for (const p of posts) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug)) throw new Error(`[blog] Invalid slug "${p.slug}" (use lowercase words separated by hyphens).`);
    if (seen.has(p.slug)) throw new Error(`[blog] Duplicate slug "${p.slug}".`);
    seen.add(p.slug);
    if (!blogCategories.includes(p.category)) throw new Error(`[blog] "${p.slug}" has an unknown category "${p.category}".`);
    if (p.draft) continue;
    // Published articles must be real articles.
    if (!p.publishedAt || !/^\d{4}-\d{2}-\d{2}$/.test(p.publishedAt) || Number.isNaN(Date.parse(p.publishedAt))) {
      throw new Error(`[blog] Published article "${p.slug}" needs a real publishedAt date (YYYY-MM-DD).`);
    }
    if (p.body.length === 0 || !p.title.trim() || !p.description.trim()) throw new Error(`[blog] Published article "${p.slug}" is empty.`);
    if (/\[draft\]/i.test(p.title)) throw new Error(`[blog] Published article "${p.slug}" still has a [Draft] title.`);
  }
}
validate(allPosts);

/* ---------- helpers ---------- */

const inlineText = (content: Inline[]) =>
  content.map((c) => (typeof c === "string" ? c : "text" in c ? c.text : "code" in c ? c.code : c.strong)).join(" ");

const blockText = (b: Block): string => {
  switch (b.type) {
    case "heading":
      return b.text;
    case "paragraph":
    case "quote":
      return inlineText(b.content);
    case "list":
      return b.items.map(inlineText).join(" ");
    case "code":
      return b.code;
    case "table":
      return [...b.headers, ...b.rows.flat()].join(" ");
    case "image":
      return b.caption ?? "";
  }
};

/** Reading time at ~200 words per minute (code counts as text), at least one minute. */
export const readingMinutes = (post: BlogPost) => {
  const words = post.body.map(blockText).join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

/** Formatted in UTC so the server and client always agree. */
export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));

/** Newest first; undated drafts after published articles, in registry order. */
const byDate = (a: BlogPost, b: BlogPost) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "");

/** Articles the current build may show. */
export const getPosts = (): BlogPost[] => (blogUnderMaintenance ? [] : allPosts.filter((p) => !p.draft || showDrafts).sort(byDate));

export const getPost = (slug: string) => getPosts().find((p) => p.slug === slug);

/** Up to `limit` other articles: same category first, then the most recent. */
export const getRelated = (post: BlogPost, limit = 3) => {
  const others = getPosts().filter((p) => p.slug !== post.slug);
  return [...others.filter((p) => p.category === post.category), ...others.filter((p) => p.category !== post.category)].slice(0, limit);
};

/** Serializable card data for client components. */
export type BlogSummary = Pick<BlogPost, "slug" | "title" | "description" | "category" | "tags" | "cover" | "author" | "publishedAt" | "draft"> & {
  dateLabel: string | null;
  readingMinutes: number;
};

export const toSummary = (p: BlogPost): BlogSummary => ({
  slug: p.slug,
  title: p.title,
  description: p.description,
  category: p.category,
  tags: p.tags,
  cover: p.cover,
  author: p.author,
  publishedAt: p.publishedAt,
  draft: p.draft,
  dateLabel: p.publishedAt ? formatDate(p.publishedAt) : null,
  readingMinutes: readingMinutes(p),
});
