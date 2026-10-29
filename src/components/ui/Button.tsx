import { ScrollLink as Link } from "@/components/ui/ScrollLink";
import type { ComponentProps, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "dark";
type Size = "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap " +
  "transition-[background-color,color,border-color,box-shadow] duration-200 select-none " +
  "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent disabled:opacity-60 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent-strong text-white shadow-[0_8px_24px_-8px_rgb(0_114_209/0.55)] hover:bg-accent-hover hover:shadow-[0_12px_30px_-8px_rgb(0_140_248/0.6)]",
  secondary: "bg-white text-ink border border-line shadow-sm hover:border-accent/40 hover:text-accent-strong",
  ghost: "text-ink hover:text-accent-strong",
  dark: "bg-ink text-white hover:bg-ink-deep",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-[15px]",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  children: ReactNode;
  className?: string;
};

export function buttonClasses({ variant = "primary", size = "md", className }: Omit<CommonProps, "children" | "arrow">) {
  return cn(base, variants[variant], sizes[size], className);
}

function Arrow() {
  return (
    <ArrowRight
      aria-hidden="true"
      className="size-4 transition-transform duration-200 group-hover/btn:translate-x-0.5"
    />
  );
}

export function ButtonLink({
  href,
  variant,
  size,
  arrow,
  className,
  children,
  ...rest
}: CommonProps & Omit<ComponentProps<typeof Link>, "className" | "children">) {
  return (
    <Link href={href} className={buttonClasses({ variant, size, className })} {...rest}>
      {children}
      {arrow && <Arrow />}
    </Link>
  );
}

export function Button({
  variant,
  size,
  arrow,
  className,
  children,
  type = "button",
  ...rest
}: CommonProps & Omit<ComponentProps<"button">, "className" | "children">) {
  return (
    <button type={type} className={buttonClasses({ variant, size, className })} {...rest}>
      {children}
      {arrow && <Arrow />}
    </button>
  );
}
