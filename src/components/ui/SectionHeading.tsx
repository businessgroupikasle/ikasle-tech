import type { ReactNode } from "react";
import { AnimatedHeading } from "@/components/animations/AnimatedHeading";
import { cn } from "@/lib/cn";

type Props = {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
  className?: string;
  /** Optional mono-styled "file path" label above the title. */
  path?: string;
  id?: string;
  /** Replaces the default animated title element (e.g. a heading with its own animation). */
  heading?: ReactNode;
};

export function Eyebrow({ children, path }: { children: ReactNode; path?: string }) {
  return (
    <p className="inline-flex items-center gap-2 rounded-full border border-line bg-white/80 px-3 py-1 font-mono text-[12px] tracking-wide text-ink-soft shadow-sm">
      <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
      {path ? <span className="text-accent-strong">{path}</span> : null}
      {path ? <span aria-hidden="true">·</span> : null}
      <span>{children}</span>
    </p>
  );
}

export function SectionHeading({ eyebrow, title, description, align = "left", as = "h2", className, path, id, heading }: Props) {
  return (
    <div className={cn("flex flex-col gap-5", align === "center" ? "items-center text-center" : "items-start", className)}>
      {eyebrow && <Eyebrow path={path}>{eyebrow}</Eyebrow>}
      {heading ?? (
        <AnimatedHeading
          as={as}
          id={id}
          immediate={as === "h1"}
          text={title}
          className={cn(
            "text-balance font-semibold tracking-[-0.035em] text-ink",
            as === "h1"
              ? "text-[2.6rem] leading-[1.02] sm:text-6xl lg:text-[4.5rem]"
              : "text-[2rem] leading-[1.08] sm:text-5xl lg:text-[3.25rem]",
            align === "center" && "mx-auto max-w-4xl",
          )}
        />
      )}
      {description && (
        <p className={cn("max-w-2xl text-pretty text-base leading-relaxed text-ink-soft sm:text-lg", align === "center" && "mx-auto")}>
          {description}
        </p>
      )}
    </div>
  );
}
