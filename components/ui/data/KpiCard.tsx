import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Metric } from "@/components/ui/display/Metric";
import { StatusDot } from "@/components/ui/display/StatusDot";
import {
  kpiCellBorderClass,
  kpiCellClass,
  kpiIconContainerClass,
  kpiIconSize,
  kpiMetricGapClass,
  kpiSparklineGapClass,
  kpiTrendGapClass,
} from "@/lib/dashboard/design-system";
import { motionPresets } from "@/lib/design/motion";
import { cn } from "@/lib/utils";

export type KpiTone = "default" | "success" | "warning" | "muted";

type KpiCardProps = {
  label: string;
  icon: LucideIcon;
  value: number;
  format: (value: number) => string;
  tone?: KpiTone;
  bordered?: boolean;
  pulse?: boolean;
  trend?: ReactNode;
  sparkline?: ReactNode;
  className?: string;
};

export function KpiCard({
  label,
  icon: Icon,
  value,
  format,
  tone = "default",
  bordered = false,
  pulse = false,
  trend,
  sparkline,
  className,
}: KpiCardProps) {
  return (
    <div
      className={cn(
        kpiCellClass,
        motionPresets.transitionBase,
        motionPresets.hover.surfaceLift,
        bordered && kpiCellBorderClass,
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <div className={kpiIconContainerClass}>
            <Icon size={kpiIconSize} aria-hidden />
          </div>
          <p className="ds-overline">{label}</p>
        </div>
        <StatusDot
          tone={
            tone === "warning"
              ? "warning"
              : tone === "success"
                ? "success"
                : "default"
          }
          pulse={pulse}
        />
      </div>
      <p className={cn(kpiMetricGapClass, "ds-kpi")}>
        <Metric value={value} formatter={format} />
      </p>
      {trend ? <div className={kpiTrendGapClass}>{trend}</div> : null}
      {sparkline ? <div className={kpiSparklineGapClass}>{sparkline}</div> : null}
      <span className="sr-only" aria-live="polite">
        {format(value)}
      </span>
    </div>
  );
}
