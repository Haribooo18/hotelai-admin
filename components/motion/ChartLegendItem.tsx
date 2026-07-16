import type { ReactNode } from "react";

import { motionChartLegendItemClass } from "@/lib/motion/chart";
import { cn } from "@/lib/utils";

type Props = {
  order: number;
  children: ReactNode;
  className?: string;
};

export function ChartLegendItem({ order, children, className }: Props) {
  return (
    <span
      className={cn(motionChartLegendItemClass, className)}
      style={{ animationDelay: `${order * 50}ms` }}
    >
      {children}
    </span>
  );
}
