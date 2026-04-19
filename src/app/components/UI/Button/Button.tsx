import React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98]",
        secondary:
          "border border-border bg-card text-card-foreground hover:bg-secondary active:scale-[0.98]",
        ghost:
          "text-foreground hover:bg-secondary active:scale-[0.98]",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-secondary active:scale-[0.98]",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
  className?: string;
};

const Button = ({
  href,
  children,
  variant = "default",
  size = "default",
  className,
}: ButtonProps) => {
  return (
    <Link
      href={href}
      prefetch={false}
      className={cn(buttonVariants({ variant, size }), className)}
    >
      {children}
    </Link>
  );
};

export default Button;
