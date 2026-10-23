/** Faint, static code lines behind the hero — decorative only (no animation on long-form pages). */
const CODE = [
  "const insight = await research(topic);",
  "export function share(idea: Idea) {",
  "  return publish(idea, { audience: 'builders' });",
  "}",
  "// engineering notes, patterns, lessons",
  "type Article = { title: string; ideas: string[] };",
  "await deploy(article, 'blog');",
];

export function BlogHero() {
  return (
    <section aria-labelledby="blog-title" className="relative overflow-hidden pt-[calc(var(--header-h)+56px)] pb-12 sm:pb-16 lg:pt-[calc(var(--header-h)+80px)]">
      <div className="ambient" aria-hidden="true" />
      <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_70%_20%,#000_15%,transparent_70%)]" aria-hidden="true" />
      <pre
        aria-hidden="true"
        className="pointer-events-none absolute top-[calc(var(--header-h)+24px)] right-0 hidden font-mono text-[13px] leading-7 text-accent/25 select-none [mask-image:linear-gradient(to_left,#000_30%,transparent)] lg:block"
      >
        {CODE.join("\n")}
      </pre>
      <div className="container-x relative">
        <p className="enter-up font-mono text-[13px] tracking-wide text-accent-strong">{"// INSIGHTS & IDEAS"}</p>
        <h1 id="blog-title" className="enter-up mt-5 max-w-4xl text-[2.4rem] leading-[1.04] font-semibold tracking-[-0.04em] text-balance text-ink [animation-delay:80ms] sm:text-6xl lg:text-[4.1rem]">
          Insights from the World of <span className="text-gradient">Technology.</span>
        </h1>
        <p className="enter-up mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-ink-soft [animation-delay:150ms]">
          Explore ideas, engineering insights, development practices, and emerging technologies shaping the future of digital products.
        </p>
      </div>
    </section>
  );
}
