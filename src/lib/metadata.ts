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
  const canonicalUrl = path.startsWith("http")
    ? path
    : `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;

  const defaultImage = {
    url: `${siteConfig.url}/opengraph-image`,
    width: 1200,
    height: 630,
    alt: `${siteConfig.name} — ${siteConfig.tagline}`,
  };

  const ogImages = image
    ? [
        {
          url: image.src.startsWith("http") ? image.src : `${siteConfig.url}${image.src.startsWith("/") ? image.src : `/${image.src}`}`,
          width: image.width,
          height: image.height,
          alt: image.alt,
        },
      ]
    : [defaultImage];

  const authors = article?.authors?.filter((a): a is string => Boolean(a));
  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    ...(noindex
      ? { robots: { index: false, follow: false } }
      : { robots: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 } }),
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      locale: "en_US",
      images: ogImages,
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
      images: ogImages.map((i) => i.url),
    },
  };
}
