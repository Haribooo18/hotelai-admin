import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type StackProps = HTMLAttributes<HTMLDivElement> & {
  gap?: "sm" | "md" | "lg";
};

const stackGapClass = {
  sm: "space-y-3",
  md: "space-y-5",
  lg: "space-y-8",
} as const;

export function Stack({ gap = "md", className, children, ...props }: StackProps) {
  return (
    <div className={cn(stackGapClass[gap], className)} {...props}>
      {children}
    </div>
  );
}
