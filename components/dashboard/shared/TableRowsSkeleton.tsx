import { SkeletonRows } from "@/components/ui/display/Skeleton";

type Props = {
  rows?: number;
  rowClassName?: string;
};

export function TableRowsSkeleton({
  rows = 6,
  rowClassName = "h-14",
}: Props) {
  return <SkeletonRows rows={rows} rowClassName={rowClassName} />;
}
