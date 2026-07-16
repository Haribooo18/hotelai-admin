"use client";

import type { ReactNode } from "react";
import { Filter } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/overlay/DropdownMenu";
import {
  filterSelectTriggerClass,
  toolbarFilterIconSize,
} from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";

type FilterSelectOption<T extends string> = {
  value: T;
  label: string;
};

type FilterSelectProps<T extends string> = {
  value: T;
  options: FilterSelectOption<T>[];
  onChange: (value: T) => void;
  ariaLabel: string;
  className?: string;
  showFilterIcon?: boolean;
  icon?: ReactNode;
};

export function FilterSelect<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
  className,
  showFilterIcon = true,
  icon,
}: FilterSelectProps<T>) {
  const activeLabel =
    options.find((option) => option.value === value)?.label ??
    options[0]?.label ??
    "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(filterSelectTriggerClass, className)}
        aria-label={ariaLabel}
      >
        {icon ?? (showFilterIcon ? <Filter size={toolbarFilterIconSize} aria-hidden /> : null)}
        <span className="min-w-0 truncate">{activeLabel}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value || "all"}
            onClick={() => onChange(option.value)}
            className={cn(
              value === option.value &&
                "bg-[var(--shell-nav-active-bg)] text-[var(--shell-accent)]"
            )}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
