import type { KeyboardEvent } from "react";

/** Keys that edit or move the caret; always allowed so filtered inputs stay usable. */
const EDITING_KEYS = new Set(["Backspace", "Delete", "Tab", "Enter", "Escape", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"]);

const withModifier = (e: KeyboardEvent) => e.ctrlKey || e.metaKey || e.altKey;

/** onKeyDown for number-only inputs (phone): blocks anything but digits, keeping editing keys and shortcuts. */
export function allowDigitsOnly(e: KeyboardEvent<HTMLInputElement>) {
  if (withModifier(e) || EDITING_KEYS.has(e.key)) return;
  if (!/^[0-9]$/.test(e.key)) e.preventDefault();
}

/** onKeyDown for name inputs: blocks typed digits, keeping shortcuts (paste is cleaned by validation). */
export function blockDigits(e: KeyboardEvent<HTMLInputElement>) {
  if (!withModifier(e) && /^[0-9]$/.test(e.key)) e.preventDefault();
}
