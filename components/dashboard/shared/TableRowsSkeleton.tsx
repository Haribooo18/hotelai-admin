import { WorkspaceTableSkeleton } from "@/components/dashboard/shared/skeleton";
import { tableDefaultSkeletonRows } from "@/lib/dashboard/design-system";

type Props = {
  rows?: number;
  /** @deprecated Row class is fixed in `WorkspaceTableSkeleton`. */
  rowClassName?: string;
  columns?: number;
};

/** @deprecated Use `WorkspaceTableSkeleton` from `@/components/dashboard/shared/skeleton`. */
export function TableRowsSkeleton({
  rows = tableDefaultSkeletonRows,
  columns = 5,
}: Props) {
  return <WorkspaceTableSkeleton rows={rows} columns={columns} />;
}
