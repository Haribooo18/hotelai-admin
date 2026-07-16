"use client";

import { Progress as ProgressPrimitive } from "@base-ui/react/progress";

import { cn } from "@/lib/utils";

type ProgressProps = ProgressPrimitive.Root.Props & {
  showValue?: boolean;
};

export function Progress({
  className,
  showValue = false,
  value,
  ...props
}: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      value={value}
      className={cn("space-y-1", className)}
      {...props}
    >
      {showValue ? (
        <ProgressPrimitive.Value className="text-[11px] font-medium text-[var(--shell-muted)]" />
      ) : null}
      <ProgressPrimitive.Track className="h-1.5 overflow-hidden rounded-full bg-[var(--shell-surface-raised)] shadow-[inset_0_0_0_1px_var(--shell-border)]">
        <ProgressPrimitive.Indicator className="h-full rounded-full bg-[var(--shell-accent)] transition-[width] duration-[var(--ds-duration-slow)] ease-[var(--ds-ease)]" />
      </ProgressPrimitive.Track>
    </ProgressPrimitive.Root>
  );
}
