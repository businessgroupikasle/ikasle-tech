"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Clock } from "lucide-react";
import type { BlogSummary } from "@/lib/blog";

export function DraftBadge() {
  return (
    <span className="rounded-full border border-warning/40 bg-warning/10 px-2 py-0.5 font-mono text-[10.5px] tracking-wide text-[#7a4b00] uppercase">
      Draft · not published
    </span>
  );
}

/** Date · reading time line; omits anything that isn't known (no invented dates). */
export function PostMeta({ post }: { post: BlogSummary }) {
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-ink-soft">
      {post.dateLabel && <time dateTime={post.publishedAt ?? undefined}>{post.dateLabel}</time>}
      {post.author && <span>By {post.author}</span>}
      <span className="inline-flex items-center gap-1">
        <Clock className="size-3.5" aria-hidden="true" />
        {post.readingMinutes} min read
      </span>
      {post.draft && <DraftBadge />}
    </p>
  );
}

/** Grid card. Motion owns only the hover lift; the whole card is one link. */
export function BlogCard({ post }: { post: BlogSummary }) {
  return (
    <motion.article whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 320, damping: 26 }} className="h-full">
      <Link
        href={`/blog/${post.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-line bg-white shadow-soft transition-[border-color,box-shadow] duration-300 hover:border-accent/30 hover:shadow-[0_28px_50px_-30px_rgb(0_70_130/0.4)]"
      >
        <div className="relative aspect-[16/9] overflow-hidden bg-bg-soft">
          <Image
            src={post.cover.src}
            alt={post.cover.alt}
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 46vw, 92vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        </div>
        <div className="flex flex-1 flex-col p-6">
          <p className="font-mono text-[12px] text-accent-strong">{post.category}</p>
          <h3 className="mt-2 text-xl leading-snug font-semibold tracking-tight text-ink">{post.title}</h3>
          <p className="mt-2 line-clamp-3 flex-1 text-[15px] leading-relaxed text-ink-soft">{post.description}</p>
          <div className="mt-5">
            <PostMeta post={post} />
          </div>
          <span className="mt-4 inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-accent-strong">
            Read More
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
