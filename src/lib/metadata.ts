import type { Metadata } from "next";
import { siteConfig } from "./site";

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  /** Article pages: Open Graph type "article", with the publish date and author when known. */
  article?: { publishedTime?: string | null; authors?: (string | null)[] };
  /** Open Graph / Twitter image (site-relative path). */
  image?: { src: string; alt: string; width: number; height: number };
  /** Keep the page out of search results (e.g. legal drafts awaiting approval). */
  noindex?: boolean;
};

/** Consistent per-page metadata: title, description, canonical and Open Graph. */
export function pageMetadata({ title, description, path, article, image, noindex }: PageMetaInput): Metadata {
  const images = image ? [{ url: image.src, width: image.width, height: image.height, alt: image.alt }] : undefined;
  const authors = article?.authors?.filter((a): a is string => Boolean(a));
  return {
    title,
    description,
    alternates: { canonical: path },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url: path,
      siteName: siteConfig.name,
      ...(images ? { images } : {}),
      ...(article
        ? {
            type: "article" as const,
            ...(article.publishedTime ? { publishedTime: article.publishedTime } : {}),
            ...(authors?.length ? { authors } : {}),
          }
        : { type: "website" as const }),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
      description,
      ...(images ? { images: images.map((i) => i.url) } : {}),
    },
  };
}
