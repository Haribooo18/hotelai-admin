import type { ReactNode } from "react";

import {
  tableBodyCellClass,
  tableBodyRowClass,
  tableElementClass,
  tableHeadClass,
  tableHeadRowClass,
  tableHeaderCellClass,
  tableScrollClass,
  tableShellClass,
} from "@/lib/dashboard/design-system";
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
  empty?: ReactNode;
  caption?: string;
  minWidth?: number;
};

export function DataTable<T>({
  columns,
  data,
  getRowId,
  empty,
  caption,
  minWidth = 480,
}: Props<T>) {
  if (data.length === 0 && empty !== undefined) {
    return <>{empty}</>;
  }

  return (
    <div className={tableShellClass}>
      <div className={tableScrollClass}>
        <table
          className={tableElementClass}
          style={{ minWidth: `${minWidth}px` }}
        >
          {caption ? <caption className="sr-only">{caption}</caption> : null}

          <thead className={tableHeadClass}>
            <tr className={tableHeadRowClass}>
              {columns.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className={cn(
                    tableHeaderCellClass,
                    column.align === "right" && "text-right",
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
              <tr key={getRowId(row)} className={tableBodyRowClass}>
                {columns.map((column, index) => (
                  <td
                    key={index}
                    className={cn(
                      tableBodyCellClass,
                      column.align === "right" && "text-right",
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
