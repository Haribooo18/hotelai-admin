"use client";

import type { ReactNode } from "react";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { Radio } from "@base-ui/react/radio";
import { CircleIcon } from "lucide-react";

import { focusRingClassName } from "@/lib/design/motion";
import { cn } from "@/lib/utils";

type RadioOption = {
  value: string;
  label: ReactNode;
  disabled?: boolean;
};

type RadioGroupProps = {
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  name?: string;
  className?: string;
  orientation?: "horizontal" | "vertical";
};

export function RadioGroup({
  value,
  onChange,
  options,
  name,
  className,
  orientation = "vertical",
}: RadioGroupProps) {
  return (
    <RadioGroupPrimitive
      value={value}
      onValueChange={onChange}
      name={name}
      className={cn(
        "flex gap-3",
        orientation === "vertical" ? "flex-col" : "flex-row flex-wrap items-center",
        className
      )}
    >
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            "inline-flex cursor-pointer items-center gap-2 text-[13px] text-[var(--shell-text)]",
            option.disabled && "cursor-not-allowed opacity-50"
          )}
        >
          <Radio.Root
            value={option.value}
            disabled={option.disabled}
            className={cn(
              "flex size-4 items-center justify-center rounded-full border border-[var(--shell-border-strong)] bg-[var(--shell-surface-raised)] transition-[border-color,box-shadow,background-color] duration-[var(--ds-duration)] ease-[var(--ds-ease)] data-checked:border-[var(--shell-accent-border)] data-checked:bg-[var(--shell-accent-muted)]",
              focusRingClassName
            )}
          >
            <Radio.Indicator className="flex items-center justify-center text-[var(--shell-accent)]">
              <CircleIcon className="size-2 fill-current" aria-hidden />
            </Radio.Indicator>
          </Radio.Root>
          <span>{option.label}</span>
        </label>
      ))}
    </RadioGroupPrimitive>
  );
}

export {
  RadioGroupPrimitive as RadioGroupRoot,
  Radio,
};
