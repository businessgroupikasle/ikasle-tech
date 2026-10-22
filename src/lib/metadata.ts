import type { Metadata } from "next";
import { siteConfig } from "./site";

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
};

/** Consistent per-page metadata: title, description, canonical and Open Graph. */
export function pageMetadata({ title, description, path }: PageMetaInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url: path,
      siteName: siteConfig.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
      description,
    },
  };
}
