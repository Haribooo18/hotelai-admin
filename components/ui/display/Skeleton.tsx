import { motionPresets } from "@/lib/design/motion";
import { cn } from "@/lib/utils";

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn(motionPresets.skeleton.base, className)} />;
}

type SkeletonGroupProps = {
  className?: string;
  lines?: Array<string | undefined>;
};

export function SkeletonGroup({
  className,
  lines = ["h-3.5 w-1/3", "h-7 w-1/2", "h-20 w-full"],
}: SkeletonGroupProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {lines.map((lineClassName, index) => (
        <Skeleton key={index} className={lineClassName} />
      ))}
    </div>
  );
}

type SkeletonRowsProps = {
  rows?: number;
  rowClassName?: string;
  className?: string;
};

export function SkeletonRows({
  rows = 6,
  rowClassName = "h-14",
  className,
}: SkeletonRowsProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn("rounded-[var(--ds-radius-sm)]", rowClassName)}
        />
      ))}
    </div>
  );
}
