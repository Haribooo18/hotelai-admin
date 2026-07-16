import type { ReactNode } from "react";

import {
  cardMetricCellClass,
  cardMetricCellLabelClass,
  cardMetricCellValueClass,
} from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value?: string;
  children?: ReactNode;
  className?: string;
};

export function CardMetricCell({ label, value, children, className }: Props) {
  return (
    <div className={cn(cardMetricCellClass, className)}>
      <p className={cardMetricCellLabelClass}>{label}</p>
      <p className={cardMetricCellValueClass}>{children ?? value}</p>
    </div>
  );
}
