import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type DataTableColumn<T> = {
  header: ReactNode;
  cell: (row: T) => ReactNode;
  align?: "left" | "right";
  headerClassName?: string;
  cellClassName?: string;
};

type Props<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowId: (row: T) => string;
  /** Rendered instead of the table when there are no rows. */
  empty?: ReactNode;
  /** Screen-reader table caption. */
  caption?: string;
};

/**
 * Shared, styled table shell for dashboard lists. Keeps the existing visual
 * design (zinc palette, rounded container) while removing duplicated markup and
 * standardizing empty states and header accessibility.
 */
export function DataTable<T>({
  columns,
  data,
  getRowId,
  empty,
  caption,
}: Props<T>) {
  if (data.length === 0 && empty !== undefined) {
    return <>{empty}</>;
  }

  return (
    <div className="overflow-hidden rounded-[var(--ds-radius)] border border-[var(--shell-border)] bg-[var(--shell-surface)]">
      <div className="overflow-x-auto overscroll-x-contain">
      <table className="w-full min-w-[480px]">
        {caption && <caption className="sr-only">{caption}</caption>}

        <thead className="border-b border-[var(--shell-border)] bg-[var(--shell-surface-raised)]">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className={cn(
                  "px-6 py-4 text-xs uppercase text-[var(--shell-muted)]",
                  column.align === "right" ? "text-right" : "text-left",
                  column.headerClassName
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr
              key={getRowId(row)}
              className="border-b border-[var(--shell-border)] last:border-0 hover:bg-[var(--shell-surface-raised)]/60"
            >
              {columns.map((column, index) => (
                <td
                  key={index}
                  className={cn(
                    "px-6 py-5",
                    column.align === "right" ? "text-right" : "text-left",
                    column.cellClassName
                  )}
                >
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
