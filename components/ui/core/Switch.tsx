"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";

import { focusRingClassName } from "@/lib/design/motion";
import { cn } from "@/lib/utils";

export function Switch({
  className,
  ...props
}: SwitchPrimitive.Root.Props) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-[var(--shell-border)] bg-[var(--shell-surface-raised)] transition-[background-color,border-color,box-shadow] duration-[var(--ds-duration)] ease-[var(--ds-ease)] data-checked:border-[var(--shell-accent-border)] data-checked:bg-[var(--shell-accent-muted)] disabled:cursor-not-allowed disabled:opacity-50",
        focusRingClassName,
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "pointer-events-none block size-4 translate-x-0.5 rounded-full bg-[var(--shell-text)] shadow-[var(--shell-shadow-sm)] transition-transform duration-[var(--ds-duration)] ease-[var(--ds-ease)] data-checked:translate-x-[18px] data-checked:bg-[var(--shell-accent)]"
        )}
      />
    </SwitchPrimitive.Root>
  );
}
