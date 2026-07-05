"use client";

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { CheckIcon, MinusIcon } from "lucide-react";

import { focusRingClassName } from "@/lib/design/motion";
import { cn } from "@/lib/utils";

export function Checkbox({
  className,
  ...props
}: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        "peer flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-[var(--shell-border-strong)] bg-[var(--shell-surface-raised)] transition-[background-color,border-color,box-shadow] duration-[var(--ds-duration)] ease-[var(--ds-ease)] data-checked:border-[var(--shell-accent-border)] data-checked:bg-[var(--shell-accent-muted)] data-indeterminate:border-[var(--shell-accent-border)] data-indeterminate:bg-[var(--shell-accent-muted)] disabled:opacity-50",
        focusRingClassName,
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-[var(--shell-accent)]">
        {props.indeterminate ? (
          <MinusIcon className="size-3" aria-hidden />
        ) : (
          <CheckIcon className="size-3" aria-hidden />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
