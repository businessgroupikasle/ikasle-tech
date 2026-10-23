import { BlogHero } from "@/components/blog/BlogHero";
import { BlogBrowser } from "@/components/blog/BlogBrowser";
import { BlogMaintenance } from "@/components/blog/BlogMaintenance";
import { blogUnderMaintenance, getPosts, showDrafts, toSummary } from "@/lib/blog";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Blog",
  description: "Engineering insights, development practices and emerging technologies from the IKASLE Technologies team.",
  path: "/blog",
  // While under maintenance, keep the placeholder page out of search results.
  noindex: blogUnderMaintenance,
});

export default function BlogPage() {
  if (blogUnderMaintenance) return <BlogMaintenance />;

  const posts = getPosts().map(toSummary);
  return (
    <>
      <BlogHero />
      <section aria-label="Articles" className="pb-24 sm:pb-32">
        <div className="container-x">
          {showDrafts && posts.some((p) => p.draft) && (
            <p className="mb-8 rounded-2xl border border-dashed border-warning/40 bg-warning/[0.06] px-4 py-3 text-[14px] text-[#7a4b00]">
              Draft preview: unpublished example articles are shown here because this is a development or preview build. They never appear on the
              production site until they are approved and marked as published.
            </p>
          )}
          <BlogBrowser posts={posts} />
        </div>
      </section>
    </>
  );
}
