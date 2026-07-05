import type { HTMLAttributes, ReactNode } from "react";

import {
  chipActiveClass,
  chipClass,
  chipIdleClass,
  stickyToolbarClass,
} from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";

type FilterBarProps = HTMLAttributes<HTMLDivElement> & {
  leading?: ReactNode;
  trailing?: ReactNode;
  filters?: ReactNode;
};

export function FilterBar({
  leading,
  trailing,
  filters,
  className,
  children,
  ...props
}: FilterBarProps) {
  return (
    <div className={cn(stickyToolbarClass, className)} {...props}>
      {leading || trailing ? (
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          {leading ? <div className="min-w-0 flex-1">{leading}</div> : null}
          {trailing ? (
            <div className="flex flex-wrap items-center gap-2">{trailing}</div>
          ) : null}
        </div>
      ) : null}
      {children}
      {filters ? <div className="flex flex-wrap gap-2">{filters}</div> : null}
    </div>
  );
}

type FilterChipProps = {
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
};

export function FilterChip({
  active = false,
  onClick,
  children,
  className,
}: FilterChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        chipClass,
        active ? chipActiveClass : chipIdleClass,
        className
      )}
    >
      {children}
    </button>
  );
}

export { chipActiveClass, chipClass, chipIdleClass, stickyToolbarClass };
