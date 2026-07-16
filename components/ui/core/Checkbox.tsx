"use client";

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { CheckIcon, MinusIcon } from "lucide-react";

import {
  checkboxIconSize,
  checkboxRootClass,
} from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";

export function Checkbox({
  className,
  ...props
}: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      className={cn(checkboxRootClass, className)}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-[var(--shell-accent)]">
        {props.indeterminate ? (
          <MinusIcon size={checkboxIconSize} aria-hidden />
        ) : (
          <CheckIcon size={checkboxIconSize} aria-hidden />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
