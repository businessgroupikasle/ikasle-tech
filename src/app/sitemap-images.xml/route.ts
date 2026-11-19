import { NextResponse } from "next/server";
import { servicePages } from "@/data/service-pages";
import { getService } from "@/data/services";
import { clients } from "@/data/clients";
import { works } from "@/data/works";
import { allPosts } from "@/content/blog";
import { blogUnderMaintenance } from "@/lib/blog";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const dynamic = "force-static";

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const entries: { pageUrl: string; images: { loc: string; title?: string; caption?: string }[] }[] = [];

  // Home Page Images
  entries.push({
    pageUrl: absoluteUrl("/"),
    images: [
      {
        loc: absoluteUrl("/opengraph-image"),
        title: `${siteConfig.name} — ${siteConfig.tagline}`,
        caption: "IKASLE Technologies software development company in Coimbatore, India",
      },
      {
        loc: absoluteUrl("/icon.svg"),
        title: `${siteConfig.name} Official Logo`,
        caption: "IKASLE Technologies Logo Mark",
      },
    ],
  });

  // Services Hub Page Images
  const serviceHubImages: { loc: string; title?: string; caption?: string }[] = [];
  for (const sp of servicePages) {
    const s = getService(sp.slug);
    if (s?.image?.src) {
      serviceHubImages.push({
        loc: absoluteUrl(s.image.src),
        title: s.title,
        caption: s.image.alt,
      });
    }
  }

  entries.push({
    pageUrl: absoluteUrl("/services"),
    images: serviceHubImages,
  });

  // Individual Service Pages
  for (const sp of servicePages) {
    const s = getService(sp.slug);
    if (s?.image?.src) {
      entries.push({
        pageUrl: absoluteUrl(`/services/${sp.slug}`),
        images: [
          {
            loc: absoluteUrl(s.image.src),
            title: s.title,
            caption: s.image.alt,
          },
        ],
      });
    }
  }

  // Clientele / Portfolio Page Images
  const clientImages = clients.map((c) => ({
    loc: absoluteUrl(c.logo),
    title: `${c.name} Logo`,
    caption: `${c.name} - ${c.category} Client of IKASLE Technologies`,
  }));

  entries.push({
    pageUrl: absoluteUrl("/clientele"),
    images: clientImages,
  });

  // Works / Case Studies Images
  const workImages: { loc: string; title: string; caption?: string }[] = [];
  for (const w of works) {
    if (w.shot?.src) {
      workImages.push({
        loc: absoluteUrl(w.shot.src),
        title: w.name,
        caption: w.shot.alt,
      });
    }
  }

  if (workImages.length > 0) {
    entries.push({
      pageUrl: absoluteUrl("/clientele"),
      images: workImages,
    });
  }

  // Blog Posts Images
  if (!blogUnderMaintenance) {
    for (const post of allPosts) {
      if (!post.draft && post.cover?.src) {
        entries.push({
          pageUrl: absoluteUrl(`/blog/${post.slug}`),
          images: [
            {
              loc: absoluteUrl(post.cover.src),
              title: post.title,
              caption: post.cover.alt || post.description,
            },
          ],
        });
      }
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries
  .map(
    (e) => `  <url>
    <loc>${escapeXml(e.pageUrl)}</loc>
${e.images
  .map(
    (img) => `    <image:image>
      <image:loc>${escapeXml(img.loc)}</image:loc>
      ${img.title ? `<image:title>${escapeXml(img.title)}</image:title>` : ""}
      ${img.caption ? `<image:caption>${escapeXml(img.caption)}</image:caption>` : ""}
    </image:image>`,
  )
  .join("\n")}
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200",
    },
  });
}
