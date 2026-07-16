"use client";

import type { ReactNode } from "react";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { Radio } from "@base-ui/react/radio";
import { CircleIcon } from "lucide-react";

import { radioLabelClass, radioRootClass } from "@/lib/dashboard/design-system";
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
            "inline-flex cursor-pointer items-center gap-2",
            radioLabelClass,
            option.disabled && "cursor-not-allowed opacity-50"
          )}
        >
          <Radio.Root
            value={option.value}
            disabled={option.disabled}
            className={radioRootClass}
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
