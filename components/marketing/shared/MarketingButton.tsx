import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type MarketingButtonProps = ComponentProps<typeof Link> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "default" | "sm";
  mobileFull?: boolean;
};

const variantClass = {
  primary: "mkt-btn-primary",
  secondary: "mkt-btn-secondary",
  ghost: "mkt-btn-ghost",
} as const;

export function MarketingButton({
  variant = "primary",
  size = "default",
  mobileFull = false,
  className,
  children,
  ...props
}: MarketingButtonProps) {
  return (
    <Link
      className={cn(
        "mkt-btn",
        variantClass[variant],
        size === "sm" && "mkt-btn-sm",
        mobileFull && "mkt-btn-mobile-full",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
