"use client";

import type { ReactNode } from "react";

import { viewToggleButtonClass } from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";

type SegmentedOption<T extends string> = {
  value: T;
  label: ReactNode;
  ariaLabel?: string;
};

type SegmentedControlProps<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: SegmentedOption<T>[];
  className?: string;
};

export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      className={cn(
        "flex rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)] p-1 shadow-[var(--shell-shadow-sm)]",
        className
      )}
    >
      {options.map((option) => {
        const selected = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            aria-label={option.ariaLabel}
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              viewToggleButtonClass,
              selected
                ? "bg-[var(--shell-nav-active-bg)] text-[var(--shell-accent)]"
                : "text-[var(--shell-muted)] hover:text-[var(--shell-text)]"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
