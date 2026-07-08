import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import {
  cardPaddingClass,
  cardRadiusClass,
  kpiIconContainerClass,
  kpiIconSize,
  kpiMetricGapClass,
} from "@/lib/dashboard/design-system";
import { surfaceStaticClass } from "@/lib/design/elevation";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: ReactNode;
  icon?: LucideIcon;
  hint?: ReactNode;
  className?: string;
};

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  className,
}: StatCardProps) {
  return (
    <div className={cn(surfaceStaticClass, cardRadiusClass, cardPaddingClass, className)}>
      <div className="flex items-center gap-2">
        {Icon ? (
          <div className={kpiIconContainerClass}>
            <Icon size={kpiIconSize} aria-hidden />
          </div>
        ) : null}
        <p className="ds-overline">{label}</p>
      </div>
      <p className={cn(kpiMetricGapClass, "ds-kpi")}>{value}</p>
      {hint ? <p className="mt-1 ds-caption">{hint}</p> : null}
    </div>
  );
}
