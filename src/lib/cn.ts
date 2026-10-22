type ClassValue = string | false | null | undefined;

/** Joins truthy class names. Tiny on purpose — no need for clsx/tailwind-merge. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
