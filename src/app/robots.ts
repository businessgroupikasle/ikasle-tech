import type { MetadataRoute } from "next";
import { absoluteUrl, siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/static/", "/admin/", "/careers/apply", "/careers/application-success"],
      },
      {
        userAgent: [
          "Googlebot",
          "Bingbot",
          "Applebot",
          "Slurp",
          "DuckDuckBot",
          "Baiduspider",
          "YandexBot",
        ],
        allow: "/",
        disallow: ["/api/", "/admin/", "/careers/apply", "/careers/application-success"],
      },
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "ClaudeBot",
          "PerplexityBot",
          "Applebot-Extended",
        ],
        allow: "/",
        disallow: ["/api/", "/admin/", "/careers/apply", "/careers/application-success"],
      },
    ],
    sitemap: [absoluteUrl("/sitemap.xml"), absoluteUrl("/sitemap-images.xml")],
    host: siteConfig.url,
  };
}
