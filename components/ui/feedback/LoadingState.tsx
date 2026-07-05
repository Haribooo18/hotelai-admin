import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Skeleton, SkeletonGroup } from "@/components/ui/display/Skeleton";
import { Spinner } from "./Spinner";

type LoadingStateProps = {
  label?: string;
  variant?: "spinner" | "skeleton" | "skeleton-group";
  className?: string;
  children?: ReactNode;
};

export function LoadingState({
  label = "Loading",
  variant = "spinner",
  className,
  children,
}: LoadingStateProps) {
  if (children) {
    return (
      <div className={cn("space-y-3", className)} aria-busy="true" aria-label={label}>
        {children}
      </div>
    );
  }

  if (variant === "skeleton-group") {
    return (
      <div aria-busy="true" aria-label={label}>
        <SkeletonGroup className={className} />
      </div>
    );
  }

  if (variant === "skeleton") {
    return (
      <div aria-busy="true" aria-label={label}>
        <Skeleton className={cn("h-20 w-full rounded-[var(--ds-radius)]", className)} />
      </div>
    );
  }

  return (
    <div
      className={cn("flex items-center justify-center py-10", className)}
      aria-busy="true"
      aria-label={label}
    >
      <Spinner />
    </div>
  );
}
