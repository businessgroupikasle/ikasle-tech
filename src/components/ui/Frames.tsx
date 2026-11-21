import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** macOS-style window chrome for app and editor mockups. */
export function WindowFrame({
  title,
  children,
  dark = false,
  className,
  bodyClassName,
  actions,
}: {
  title?: string;
  children: ReactNode;
  dark?: boolean;
  className?: string;
  bodyClassName?: string;
  actions?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border shadow-float",
        dark ? "border-editor-line bg-editor" : "border-line bg-white",
        className,
      )}
    >
      <div
        className={cn(
          "flex h-10 items-center gap-3 border-b px-4",
          dark ? "border-editor-line bg-editor-panel" : "border-line bg-bg-soft",
        )}
      >
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </div>
        {title && (
          <p className={cn("min-w-0 flex-1 truncate font-mono text-[11.5px]", dark ? "text-editor-muted" : "text-ink-soft")}>
            {title}
          </p>
        )}
        {actions}
      </div>
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}
