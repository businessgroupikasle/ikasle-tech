"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/** Copies a code block to the clipboard; shows a brief confirmation. */
export function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be unavailable (permissions / insecure context); the code stays selectable.
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[11.5px] text-editor-muted transition-colors hover:bg-white/5 hover:text-white"
    >
      {copied ? <Check className="size-3.5 text-success" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
      {copied ? "Copied" : "Copy"}
      <span className="sr-only" aria-live="polite">
        {copied ? "Code copied to clipboard" : ""}
      </span>
    </button>
  );
}
