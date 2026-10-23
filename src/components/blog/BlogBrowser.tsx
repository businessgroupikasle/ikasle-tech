"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, FileText, Search, X } from "lucide-react";
import { blogCategories, type BlogCategory } from "@/content/blog/types";
import type { BlogSummary } from "@/lib/blog";
import { BlogCard, PostMeta } from "./BlogCard";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type Filter = "All" | BlogCategory;

function Featured({ post }: { post: BlogSummary }) {
  return (
    <article className="grid overflow-hidden rounded-[28px] border border-line bg-white shadow-soft lg:grid-cols-[1.15fr_1fr]">
      <Link href={`/blog/${post.slug}`} className="group relative block aspect-[16/10] overflow-hidden bg-bg-soft lg:aspect-auto lg:min-h-[380px]" tabIndex={-1} aria-hidden="true">
        <Image
          src={post.cover.src}
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 640px, 92vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      </Link>
      <div className="flex flex-col justify-center p-7 sm:p-10">
        <p className="font-mono text-[12px] text-accent-strong">Featured · {post.category}</p>
        <h2 className="mt-3 text-[1.75rem] leading-[1.15] font-semibold tracking-[-0.03em] text-balance text-ink sm:text-[2.1rem]">
          <Link href={`/blog/${post.slug}`} className="hover:text-accent-strong">
            {post.title}
          </Link>
        </h2>
        <p className="mt-4 text-[16px] leading-relaxed text-ink-soft">{post.description}</p>
        <div className="mt-5">
          <PostMeta post={post} />
        </div>
        <div className="mt-7">
          <ButtonLink href={`/blog/${post.slug}`} arrow>
            Read Article
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}

/**
 * Blog listing: featured article, category filters, search and the card grid. Receives serializable
 * summaries from the server page; filtering happens on the client (small list, no network requests).
 */
export function BlogBrowser({ posts }: { posts: BlogSummary[] }) {
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const visible = useMemo(
    () =>
      posts.filter((p) => {
        if (filter !== "All" && p.category !== filter) return false;
        if (!q) return true;
        return [p.title, p.description, p.category, ...p.tags].some((t) => t.toLowerCase().includes(q));
      }),
    [posts, filter, q],
  );
  const count = (f: Filter) => (f === "All" ? posts.length : posts.filter((p) => p.category === f).length);

  // Nothing published yet: an honest empty state instead of placeholder articles.
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-[28px] border border-dashed border-line bg-white/70 px-6 py-20 text-center">
        <FileText className="size-8 text-accent-strong" aria-hidden="true" />
        <h2 className="text-xl font-semibold text-ink">No articles published yet</h2>
        <p className="max-w-md text-[15px] leading-relaxed text-ink-soft">
          We&apos;re preparing our first engineering insights. In the meantime, explore our services or tell us about your project.
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/services" variant="secondary">
            Explore Services
          </ButtonLink>
          <ButtonLink href="/contact" arrow>
            Start a Project
          </ButtonLink>
        </div>
      </div>
    );
  }

  const browsing = filter === "All" && !q;
  const [featured, ...rest] = visible;
  const grid = browsing ? rest : visible;

  return (
    <div>
      {browsing && featured && <Featured post={featured} />}

      <div className={cn("flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between", browsing && "mt-14")}>
        <div role="group" aria-label="Filter articles by category" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {(["All", ...blogCategories] as Filter[]).map((f) => {
            const active = f === filter;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={active}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200",
                  active ? "border-transparent bg-ink text-white" : "border-line bg-white text-ink-soft hover:border-accent/40 hover:text-ink",
                )}
              >
                {f} <span className={cn("ml-1 font-mono text-[11px]", active ? "text-white/70" : "text-ink-soft/70")}>{count(f)}</span>
              </button>
            );
          })}
        </div>
        <label className="relative block w-full lg:max-w-xs">
          <span className="sr-only">Search articles</span>
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink-soft" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or topic"
            className="h-11 w-full rounded-full border border-line bg-white pr-10 pl-11 text-[15px] text-ink placeholder:text-ink-soft/70 focus-visible:border-accent focus-visible:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-ink-soft hover:text-ink"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          )}
        </label>
      </div>

      <p className="sr-only" aria-live="polite">
        {visible.length} {visible.length === 1 ? "article" : "articles"} found
      </p>

      {visible.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-3xl border border-dashed border-line bg-white/70 px-6 py-16 text-center">
          <Search className="size-7 text-ink-soft" aria-hidden="true" />
          <p className="font-semibold text-ink">No articles match {q ? <>“{query.trim()}”</> : "this category"}</p>
          <p className="max-w-sm text-[15px] text-ink-soft">Try another category or a different search term.</p>
          <button
            type="button"
            onClick={() => {
              setFilter("All");
              setQuery("");
            }}
            className="mt-1 inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-accent-strong hover:underline"
          >
            Show all articles <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      ) : (
        grid.length > 0 && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
            {grid.map((p) => (
              <BlogCard key={p.slug} post={p} />
            ))}
          </div>
        )
      )}
    </div>
  );
}
