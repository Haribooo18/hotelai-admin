import type { HTMLAttributes, ReactNode } from "react";

import {
  toolbarActionsClass,
  toolbarChipsRowClass,
  toolbarFiltersSlotClass,
  toolbarRowClass,
  toolbarSearchContainerClass,
  toolbarSearchSlotClass,
  workspaceToolbarFitClass,
  workspaceToolbarRow1Class,
  workspaceToolbarRow1StickyClass,
} from "@/lib/dashboard/design-system";
import { motionPresets } from "@/lib/design/motion";
import { cn } from "@/lib/utils";

type WorkspaceToolbarProps = HTMLAttributes<HTMLDivElement> & {
  search?: ReactNode;
  primaryFilters?: ReactNode;
  actions?: ReactNode;
  chips?: ReactNode;
  nowrap?: boolean;
  fitContent?: boolean;
  compactSearch?: boolean;
  wideSearch?: boolean;
  searchGrow?: boolean;
};

export function WorkspaceToolbar({
  search,
  primaryFilters,
  actions,
  chips,
  nowrap = false,
  fitContent = false,
  compactSearch = false,
  wideSearch = false,
  searchGrow = false,
  className,
}: WorkspaceToolbarProps) {
  const hasRow1 = search || primaryFilters || actions;
  const hasRow2 = Boolean(chips);

  if (!hasRow1 && !hasRow2) {
    return null;
  }

  return (
    <div
      className={cn(
        fitContent ? workspaceToolbarFitClass : workspaceToolbarRow1StickyClass,
        className
      )}
      data-workspace-toolbar
    >
      {hasRow1 ? (
        <div
          className={cn(
            workspaceToolbarRow1Class,
            toolbarRowClass,
            nowrap && "flex-nowrap",
            fitContent && "w-max"
          )}
          data-workspace-toolbar-row="1"
        >
          {search ? (
            <div
              className={cn(
                searchGrow
                  ? "min-w-[140px] flex-1"
                  : wideSearch
                    ? "min-w-[280px] flex-1 max-w-[640px]"
                    : nowrap
                    ? "min-w-[120px] max-w-[180px] shrink-0 flex-none"
                    : compactSearch
                      ? "min-w-[140px] max-w-[min(50%,320px)] shrink-0 flex-none"
                      : cn(toolbarSearchSlotClass, toolbarSearchContainerClass)
              )}
            >
              {search}
            </div>
          ) : null}

          {primaryFilters ? (
            <div
              className={cn(
                toolbarFiltersSlotClass,
                nowrap && "shrink-0 flex-nowrap"
              )}
            >
              {primaryFilters}
            </div>
          ) : null}

          {actions ? (
            <div
              className={cn(
                "flex flex-wrap items-center",
                toolbarActionsClass,
                fitContent ? "shrink-0" : "sm:ml-auto"
              )}
            >
              {actions}
            </div>
          ) : null}
        </div>
      ) : null}

      {hasRow2 ? (
        <div
          className={cn(
            toolbarChipsRowClass,
            hasRow1 && "pt-[var(--ds-toolbar-gap)]",
            motionPresets.filterPanel
          )}
          data-workspace-toolbar-row="2"
        >
          {chips}
        </div>
      ) : null}
    </div>
  );
}
