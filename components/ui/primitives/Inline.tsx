import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type InlineProps = HTMLAttributes<HTMLDivElement> & {
  gap?: "sm" | "md" | "lg";
  wrap?: boolean;
};

const inlineGapClass = {
  sm: "gap-2",
  md: "gap-3",
  lg: "gap-4",
} as const;

export function Inline({
  gap = "md",
  wrap = true,
  className,
  children,
  ...props
}: InlineProps) {
  return (
    <div
      className={cn(
        "flex items-center",
        inlineGapClass[gap],
        wrap && "flex-wrap",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
