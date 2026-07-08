import { SkeletonRows } from "@/components/ui/display/Skeleton";
import {
  tableDefaultSkeletonRows,
  tableSkeletonGapClass,
  tableSkeletonRowClass,
} from "@/lib/dashboard/design-system";

type Props = {
  rows?: number;
  rowClassName?: string;
};

export function TableRowsSkeleton({
  rows = tableDefaultSkeletonRows,
  rowClassName = tableSkeletonRowClass,
}: Props) {
  return (
    <SkeletonRows
      rows={rows}
      rowClassName={rowClassName}
      className={tableSkeletonGapClass}
    />
  );
}
