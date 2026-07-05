import { cn } from "@/lib/utils";

type Props = {
  rows?: number;
  rowClassName?: string;
};

export function TableRowsSkeleton({
  rows = 6,
  rowClassName = "h-14",
}: Props) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className={cn("ds-skeleton rounded-[var(--ds-radius-sm)]", rowClassName)}
        />
      ))}
    </div>
  );
}
