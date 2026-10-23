import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ArticleBody } from "@/components/blog/ArticleBody";
import { BlogCard, PostMeta } from "@/components/blog/BlogCard";
import { ContactCta } from "@/components/home/ContactCta";
import { getPost, getPosts, getRelated, toSummary } from "@/lib/blog";
import { pageMetadata } from "@/lib/metadata";
import { absoluteUrl, siteConfig } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

// Only articles the current build may show are generated; anything else (including drafts in production) 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return pageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    image: post.cover,
    article: { publishedTime: post.publishedAt, authors: [post.author] },
    // Drafts only render in dev/preview builds; keep them out of any index regardless.
    noindex: post.draft,
  });
}

export default async function BlogArticlePage({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const summary = toSummary(post);
  const related = getRelated(post).map(toSummary);

  // Structured data only for published articles, with fields we actually know.
  const jsonLd = post.draft
    ? null
    : {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        image: absoluteUrl(post.cover.src),
        datePublished: post.publishedAt,
        mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
        articleSection: post.category,
        keywords: post.tags.join(", "),
        ...(post.author ? { author: { "@type": "Person", name: post.author } } : {}),
        publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
      };

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />}
      <article className="pt-[calc(var(--header-h)+40px)] pb-8 lg:pt-[calc(var(--header-h)+64px)]">
        <div className="container-x">
          <div className="mx-auto max-w-3xl">
            <Link href="/blog" className="inline-flex items-center gap-2 text-[14.5px] font-medium text-ink-soft transition-colors hover:text-accent-strong">
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to Blogs
            </Link>
            {post.draft && (
              <p className="mt-6 rounded-2xl border border-dashed border-warning/40 bg-warning/[0.06] px-4 py-3 text-[14px] text-[#7a4b00]">
                Draft preview — this example article is not published and does not appear on the production site.
              </p>
            )}
            <p className="mt-8 font-mono text-[12.5px] text-accent-strong">{post.category}</p>
            <h1 className="mt-3 text-[2.2rem] leading-[1.08] font-semibold tracking-[-0.035em] text-balance text-ink sm:text-[3rem]">{post.title}</h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">{post.description}</p>
            <div className="mt-6">
              <PostMeta post={summary} />
            </div>
          </div>

          <div className="relative mx-auto mt-10 aspect-[16/9] max-w-5xl overflow-hidden rounded-[28px] border border-line bg-bg-soft shadow-soft">
            <Image src={post.cover.src} alt={post.cover.alt} fill priority sizes="(min-width: 1100px) 1024px, 94vw" className="object-cover" />
          </div>

          <div className="mx-auto mt-6 max-w-3xl">
            <ArticleBody blocks={post.body} />
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="border-t border-line bg-bg-soft py-20 sm:py-24">
          <div className="container-x">
            <h2 id="related-title" className="text-3xl font-semibold tracking-[-0.03em] text-ink sm:text-[2.4rem]">
              Related Articles
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
              {related.map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <ContactCta
        eyebrow="// let's build"
        title="Have a Project in Mind? Let's Talk."
        highlight={["Talk."]}
        text="Tell us what you want to achieve. Our team will help you explore the right technology approach."
        primary={{ label: "Contact IKASLE", href: "/contact" }}
        secondary={{ label: "Explore Services", href: "/services" }}
      />
    </>
  );
}
