"use client";

import type { ComponentProps, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/overlay/DropdownMenu";
import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { TableContainer } from "@/components/ui/data/TableContainer";
import { TableRowsSkeleton } from "@/components/dashboard/shared/TableRowsSkeleton";
import { tableRowA11yProps } from "@/lib/dashboard/a11y";
import {
  tableBodyCellClass,
  tableBodyRowClass,
  tableBodyRowSelectedClass,
  tableContainerClass,
  tableDefaultSkeletonRows,
  tableElementClass,
  tableHeadClass,
  tableHeadRowClass,
  tableHeaderCellClass,
  iconActionClass,
  tableActionButtonClass,
  tableActionIconSize,
  tableActionsCellClass,
  tableMenuItemClass,
  tableMenuItemDestructiveClass,
  tableMenuItemIconSize,
} from "@/lib/dashboard/design-system";
import { motionPresets } from "@/lib/design/motion";
import { cn } from "@/lib/utils";

export type WorkspaceTableHeader = {
  key: string;
  label: ReactNode;
  srOnly?: boolean;
};

type WorkspaceTableProps = {
  caption: string;
  headers: WorkspaceTableHeader[];
  minWidth?: number;
  loading?: boolean;
  skeletonRows?: number;
  isEmpty?: boolean;
  empty?: {
    title: string;
    description: string;
    icon: ReactNode;
  };
  children: ReactNode;
  footer?: ReactNode;
};

export function WorkspaceTable({
  caption,
  headers,
  minWidth = 920,
  loading = false,
  skeletonRows = tableDefaultSkeletonRows,
  isEmpty = false,
  empty,
  children,
  footer,
}: WorkspaceTableProps) {
  if (loading) {
    return (
      <TableContainer>
        <TableRowsSkeleton rows={skeletonRows} />
      </TableContainer>
    );
  }

  if (isEmpty && empty) {
    return (
      <EmptyState
        title={empty.title}
        description={empty.description}
        icon={empty.icon}
      />
    );
  }

  return (
    <TableContainer scrollable className={tableContainerClass} footer={footer}>
      <table
        className={tableElementClass}
        style={{ minWidth: `${minWidth}px` }}
      >
        <caption className="sr-only">{caption}</caption>
        <thead className={tableHeadClass}>
          <tr className={tableHeadRowClass}>
            {headers.map((header) => (
              <th key={header.key} scope="col" className={tableHeaderCellClass}>
                {header.srOnly ? (
                  <span className="sr-only">{header.label}</span>
                ) : (
                  header.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </TableContainer>
  );
}

type WorkspaceTableRowProps = ComponentProps<"tr"> & {
  selected?: boolean;
  a11yLabel: string;
  onActivate?: () => void;
};

export function WorkspaceTableRow({
  selected = false,
  a11yLabel,
  onActivate,
  className,
  children,
  onClick,
  ...props
}: WorkspaceTableRowProps) {
  return (
    <tr
      onClick={onClick}
      aria-selected={selected}
      className={cn(
        tableBodyRowClass,
        motionPresets.transitionBase,
        selected && tableBodyRowSelectedClass,
        className
      )}
      {...tableRowA11yProps(a11yLabel, onActivate ?? (() => undefined))}
      {...props}
    >
      {children}
    </tr>
  );
}

type WorkspaceTableCellProps = ComponentProps<"td"> & {
  align?: "left" | "right";
  muted?: boolean;
  metric?: boolean;
};

export function WorkspaceTableCell({
  align = "left",
  muted = false,
  metric = false,
  className,
  children,
  ...props
}: WorkspaceTableCellProps) {
  return (
    <td
      className={cn(
        tableBodyCellClass,
        align === "right" && cn(tableActionsCellClass, "w-[1%] max-w-none whitespace-nowrap"),
        align !== "right" && "max-w-0",
        muted && "text-[var(--shell-muted)]",
        metric && "font-semibold",
        className
      )}
      {...props}
    >
      {children}
    </td>
  );
}

export type TableRowActionItem = {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  destructive?: boolean;
};

type TableRowActionsProps = {
  ariaLabel: string;
  actions: TableRowActionItem[];
  onTriggerClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

export function TableRowActions({
  ariaLabel,
  actions,
  onTriggerClick,
}: TableRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={ariaLabel}
        onClick={onTriggerClick}
        className={cn(iconActionClass, tableActionButtonClass)}
      >
        <MoreHorizontal size={tableActionIconSize} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <DropdownMenuItem
              key={action.label}
              onClick={(event) => {
                event.stopPropagation();
                action.onClick();
              }}
              className={
                action.destructive
                  ? tableMenuItemDestructiveClass
                  : Icon
                    ? tableMenuItemClass
                    : undefined
              }
            >
              {Icon ? <Icon size={tableMenuItemIconSize} /> : null}
              {action.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
