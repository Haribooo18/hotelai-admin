import type { ComponentProps, HTMLAttributes, ReactNode } from "react";

import { Button } from "@/components/ui/core/Button";
import { WorkspaceToolbar } from "@/components/dashboard/shared/WorkspaceToolbar";
import {
  chipActiveClass,
  chipClass,
  chipIdleClass,
  toolbarPrimaryButtonClass,
  toolbarSecondaryButtonClass,
  toolbarShellClass,
} from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";

type FilterBarProps = HTMLAttributes<HTMLDivElement> & {
  search?: ReactNode;
  filters?: ReactNode;
  viewToggle?: ReactNode;
  actions?: ReactNode;
  chips?: ReactNode;
};

/** @deprecated Prefer WorkspaceToolbar */
export function FilterBar({
  search,
  filters,
  viewToggle,
  actions,
  chips,
  className,
  ...props
}: FilterBarProps) {
  const primaryFilters =
    filters || viewToggle ? (
      <>
        {filters}
        {viewToggle}
      </>
    ) : undefined;

  return (
    <WorkspaceToolbar
      className={className}
      search={search}
      primaryFilters={primaryFilters}
      actions={actions}
      chips={chips}
      {...props}
    />
  );
}

export function ToolbarSecondaryButton({
  className,
  size = "sm",
  variant = "outline",
  ...props
}: ComponentProps<typeof Button>) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(toolbarSecondaryButtonClass, className)}
      {...props}
    />
  );
}

export function ToolbarPrimaryButton({
  className,
  size = "sm",
  ...props
}: ComponentProps<typeof Button>) {
  return (
    <Button
      size={size}
      className={cn(toolbarPrimaryButtonClass, className)}
      {...props}
    />
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

export { chipActiveClass, chipClass, chipIdleClass, toolbarShellClass as stickyToolbarClass };
