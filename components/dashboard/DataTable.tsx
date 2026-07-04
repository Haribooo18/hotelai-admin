"use client";

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
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
      <table className="w-full">
        {caption && <caption className="sr-only">{caption}</caption>}

        <thead className="border-b border-zinc-800 bg-zinc-900">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className={cn(
                  "px-6 py-4 text-xs uppercase text-zinc-500",
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
              className="border-b border-zinc-900 last:border-0 hover:bg-zinc-900/60"
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
  );
}
