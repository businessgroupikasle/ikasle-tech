"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { useInViewport } from "@/hooks/useInViewport";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

export type TerminalLine =
  | { kind: "cmd"; text: string }
  | { kind: "out"; text: string; tone?: "success" | "muted" | "plain" | "accent" };

type Props = {
  lines: TerminalLine[];
  title?: string;
  className?: string;
  /** Called with the index of the line that just finished — used to sync companion visuals. */
  onProgress?: (lineIndex: number) => void;
};

const TYPE_MS = 38;
const OUTPUT_MS = 420;
const AFTER_CMD_MS = 500;

/**
 * Visual-only terminal demo. It never executes anything: the script is static text,
 * revealed with timers. Screen readers get the full transcript up front.
 */
export function TerminalAnimation({ lines, title = "zsh — ikasle-project", className, onProgress }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInViewport(ref, { rootMargin: "-10% 0px", once: true });
  const reduced = usePrefersReducedMotion();
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [run, setRun] = useState(0);
  const progressRef = useRef(onProgress);

  useEffect(() => {
    progressRef.current = onProgress;
  }, [onProgress]);

  const finished = reduced || lineIdx >= lines.length;

  useEffect(() => {
    if (!inView || reduced || lineIdx >= lines.length) return;
    const line = lines[lineIdx]!;
    let timer: number;
    if (line.kind === "cmd" && charIdx < line.text.length) {
      timer = window.setTimeout(() => setCharIdx((c) => c + 1), TYPE_MS + Math.random() * 30);
    } else {
      timer = window.setTimeout(
        () => {
          progressRef.current?.(lineIdx);
          setLineIdx((l) => l + 1);
          setCharIdx(0);
        },
        line.kind === "cmd" ? AFTER_CMD_MS : OUTPUT_MS,
      );
    }
    return () => clearTimeout(timer);
  }, [inView, reduced, lineIdx, charIdx, lines, run]);

  useEffect(() => {
    if (reduced) progressRef.current?.(lines.length - 1);
  }, [reduced, lines.length]);

  const replay = () => {
    setLineIdx(0);
    setCharIdx(0);
    setRun((r) => r + 1);
    progressRef.current?.(-1);
  };

  const visibleCount = reduced ? lines.length : lineIdx + 1;

  return (
    <div ref={ref} className={cn("overflow-hidden rounded-2xl border border-editor-line bg-editor shadow-float", className)}>
      <div className="flex h-10 items-center gap-3 border-b border-editor-line bg-editor-panel px-4">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </div>
        <p className="flex-1 truncate font-mono text-[11.5px] text-editor-muted">{title}</p>
        <button
          type="button"
          onClick={replay}
          disabled={!finished}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[11px] text-editor-muted transition-colors hover:bg-white/5 hover:text-editor-text disabled:opacity-0"
        >
          <RotateCcw className="size-3" aria-hidden="true" />
          Replay
        </button>
      </div>

      <pre className="sr-only">
        {lines.map((l) => (l.kind === "cmd" ? `$ ${l.text}` : l.text)).join("\n")}
      </pre>

      {/* Every line is always laid out; unrevealed ones are just invisible, so nothing shifts. */}
      <div aria-hidden="true" className="code-surface p-5 sm:p-6">
        {lines.map((line, i) => {
          const isCurrent = !reduced && i === lineIdx;
          const revealed = i < visibleCount;
          if (line.kind === "cmd") {
            const text = isCurrent ? line.text.slice(0, charIdx) : line.text;
            return (
              <div key={i} className={cn("relative whitespace-pre-wrap break-words", !revealed && "invisible")}>
                {/* Full text reserves the wrapped height; the typed text overlays it. */}
                <span className="invisible">
                  ikasle ~/project $ {line.text}
                </span>
                <span className="absolute inset-0">
                  <span className="text-accent-2">ikasle</span>
                  <span className="tok-muted"> ~/project </span>
                  <span className="tok-keyword">$ </span>
                  <span className="tok-plain">{text}</span>
                  {isCurrent && <span className="caret" />}
                </span>
              </div>
            );
          }
          return (
            <div
              key={i}
              className={cn(
                "whitespace-pre-wrap break-words",
                (!revealed || isCurrent) && "invisible",
                line.tone === "success" && "tok-success",
                line.tone === "muted" && "tok-muted",
                line.tone === "accent" && "text-accent-2",
                (!line.tone || line.tone === "plain") && "tok-plain",
              )}
            >
              {line.text}
            </div>
          );
        })}
          <div className={cn(!finished && "invisible")}>
            <span className="text-accent-2">ikasle</span>
            <span className="tok-muted"> ~/project </span>
            <span className="tok-keyword">$ </span>
            <span className="caret" />
          </div>
      </div>
    </div>
  );
}
