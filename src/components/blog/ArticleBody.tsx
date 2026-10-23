import Image from "next/image";
import Link from "next/link";
import type { Block, Inline } from "@/content/blog/types";
import { tokenize } from "@/lib/highlight";
import { CopyButton } from "./CopyButton";

export const headingId = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export function InlineText({ content }: { content: Inline[] }) {
  return (
    <>
      {content.map((c, i) => {
        if (typeof c === "string") return <span key={i}>{c}</span>;
        if ("href" in c) {
          const external = /^https?:\/\//.test(c.href);
          return external ? (
            <a key={i} href={c.href} target="_blank" rel="noopener noreferrer" className="font-medium text-accent-strong underline decoration-accent/40 underline-offset-4 hover:decoration-accent">
              {c.text}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : (
            <Link key={i} href={c.href} className="font-medium text-accent-strong underline decoration-accent/40 underline-offset-4 hover:decoration-accent">
              {c.text}
            </Link>
          );
        }
        if ("code" in c)
          return (
            <code key={i} className="rounded-md border border-line bg-bg-soft px-1.5 py-0.5 font-mono text-[0.88em] text-ink">
              {c.code}
            </code>
          );
        return (
          <strong key={i} className="font-semibold text-ink">
            {c.strong}
          </strong>
        );
      })}
    </>
  );
}

function CodeBlock({ code, language, filename }: { code: string; language: string; filename?: string }) {
  const highlight = /^(tsx?|jsx?|typescript|javascript)$/i.test(language);
  return (
    <figure className="my-8 overflow-hidden rounded-2xl border border-editor-line bg-editor shadow-soft">
      <figcaption className="flex items-center justify-between gap-3 border-b border-editor-line bg-editor-panel px-4 py-2">
        <span className="truncate font-mono text-[12px] text-editor-muted">{filename ?? language}</span>
        <CopyButton code={code} />
      </figcaption>
      <pre className="code-surface overflow-x-auto p-4 text-[13.5px] leading-relaxed" tabIndex={0} aria-label={`${language} code`}>
        <code>
          {highlight
            ? tokenize(code).map((t, i) => (
                <span key={i} className={`tok-${t.cls}`}>
                  {t.text}
                </span>
              ))
            : <span className="tok-plain">{code}</span>}
        </code>
      </pre>
    </figure>
  );
}

/** Long-form article content. Server-rendered; no animation (reading comfort and performance). */
export function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="text-[17px] leading-[1.8] text-ink-soft">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "heading": {
            const id = headingId(b.text);
            return b.level === 2 ? (
              <h2 key={i} id={id} className="mt-12 mb-4 text-[1.6rem] leading-tight font-semibold tracking-[-0.025em] text-ink sm:text-[1.85rem]">
                {b.text}
              </h2>
            ) : (
              <h3 key={i} id={id} className="mt-9 mb-3 text-[1.25rem] leading-snug font-semibold tracking-tight text-ink">
                {b.text}
              </h3>
            );
          }
          case "paragraph":
            return (
              <p key={i} className="my-5">
                <InlineText content={b.content} />
              </p>
            );
          case "list": {
            const Tag = b.ordered ? "ol" : "ul";
            return (
              <Tag key={i} className={`my-5 space-y-2 pl-6 ${b.ordered ? "list-decimal" : "list-disc"} marker:text-accent`}>
                {b.items.map((item, j) => (
                  <li key={j} className="pl-1">
                    <InlineText content={item} />
                  </li>
                ))}
              </Tag>
            );
          }
          case "quote":
            return (
              <blockquote key={i} className="my-8 rounded-r-2xl border-l-4 border-accent bg-bg-blue/60 px-6 py-5 text-[1.15rem] leading-relaxed font-medium text-ink">
                <InlineText content={b.content} />
                {b.cite && <footer className="mt-2 text-[14px] font-normal text-ink-soft">— {b.cite}</footer>}
              </blockquote>
            );
          case "code":
            return <CodeBlock key={i} code={b.code} language={b.language} filename={b.filename} />;
          case "table":
            return (
              <div key={i} className="my-8 overflow-x-auto rounded-2xl border border-line" tabIndex={0} role="region" aria-label={b.caption ?? "Table"}>
                <table className="w-full min-w-[480px] border-collapse text-left text-[15px]">
                  {b.caption && <caption className="px-4 pt-3 text-left text-[13px] text-ink-soft">{b.caption}</caption>}
                  <thead>
                    <tr className="border-b border-line bg-bg-soft">
                      {b.headers.map((h) => (
                        <th key={h} scope="col" className="px-4 py-3 font-semibold text-ink">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((row, r) => (
                      <tr key={r} className="border-b border-line last:border-0">
                        {row.map((cell, c) => (
                          <td key={c} className="px-4 py-3 align-top">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "image":
            return (
              <figure key={i} className="my-8">
                <Image src={b.src} alt={b.alt} width={b.width} height={b.height} sizes="(min-width: 768px) 720px, 92vw" className="h-auto w-full rounded-2xl border border-line" />
                {b.caption && <figcaption className="mt-2 text-center text-[13px] text-ink-soft">{b.caption}</figcaption>}
              </figure>
            );
        }
      })}
    </div>
  );
}
