import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

type SpinnerProps = {
  className?: string;
  size?: number;
  label?: string;
};

export function Spinner({
  className,
  size = 20,
  label = "Loading",
}: SpinnerProps) {
  return (
    <Loader2
      className={cn("animate-spin text-[var(--shell-muted)]", className)}
      size={size}
      aria-label={label}
    />
  );
}
