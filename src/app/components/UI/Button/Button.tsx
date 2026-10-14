import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "accent" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-control font-medium " +
  "transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-paper hover:bg-ink/85",
  accent: "bg-link text-white hover:bg-link-hover dark:text-paper",
  secondary: "border border-line-strong bg-surface text-ink hover:bg-sunken",
  ghost: "text-ink-soft hover:bg-sunken hover:text-ink",
  danger: "border border-line-strong bg-surface text-danger hover:bg-danger-tint hover:border-danger/40",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-[0.9375rem]",
  lg: "h-12 px-5 text-base",
};

export function buttonClass({
  variant = "secondary",
  size = "md",
  className = "",
}: { variant?: Variant; size?: Size; className?: string } = {}) {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`;
}

type ButtonProps = ComponentProps<"button"> & { variant?: Variant; size?: Size };

export function Button({ variant, size, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClass({ variant, size, className })} {...props} />;
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: Variant; size?: Size };

export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClass({ variant, size, className })} {...props} />;
}

export default ButtonLink;
