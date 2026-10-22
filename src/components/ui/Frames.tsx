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

/** Browser chrome with an address bar. */
export function BrowserFrame({ url, children, className }: { url: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-line bg-white shadow-float", className)}>
      <div className="flex h-10 items-center gap-3 border-b border-line bg-bg-soft px-4">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="mx-auto flex h-6 w-full max-w-xs items-center justify-center rounded-md border border-line bg-white px-3 font-mono text-[11px] text-ink-soft">
          <span className="truncate">{url}</span>
        </div>
        <span className="w-10" aria-hidden="true" />
      </div>
      {children}
    </div>
  );
}

/** Phone device frame. Width is controlled by the caller; aspect ratio is fixed. */
export function PhoneFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative aspect-[9/19] rounded-[2.2rem] border border-[#0F2E46] bg-[#061C30] p-[7px] shadow-float",
        className,
      )}
    >
      <div className="relative h-full overflow-hidden rounded-[1.75rem] bg-white">
        <div className="absolute top-2 left-1/2 z-10 h-[18px] w-[34%] -translate-x-1/2 rounded-full bg-[#061C30]" aria-hidden="true" />
        {children}
      </div>
    </div>
  );
}
