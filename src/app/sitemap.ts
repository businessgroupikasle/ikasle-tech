import type { MetadataRoute } from "next";
import { servicePages } from "@/data/service-pages";
import { allPosts } from "@/content/blog";
import { blogUnderMaintenance } from "@/lib/blog";
import { privacyPolicy } from "@/content/legal/privacy";
import { termsAndConditions } from "@/content/legal/terms";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // Legal pages are listed only once approved (drafts are noindex).
  const legal = [
    ["/privacy-policy", privacyPolicy.status],
    ["/terms-and-conditions", termsAndConditions.status],
  ]
    .filter(([, status]) => status === "approved")
    .map(([path]) => path!);
  const pages = ["/", "/about", "/services", "/clientele", ...(blogUnderMaintenance ? [] : ["/blog"]), "/contact", "/careers", "/faq", ...legal].map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.8,
  }));
  const services = servicePages.map((s) => ({
    url: absoluteUrl(`/services/${s.slug}`),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));
  // Published articles only — never drafts, even in a preview build.
  const articles = allPosts
    .filter((p) => !blogUnderMaintenance && !p.draft && p.publishedAt)
    .map((p) => ({
      url: absoluteUrl(`/blog/${p.slug}`),
      lastModified: new Date(`${p.publishedAt}T00:00:00Z`),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    }));
  return [...pages, ...services, ...articles];
}
