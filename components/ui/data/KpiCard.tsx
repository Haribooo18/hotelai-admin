"use client";

import type { LucideIcon } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

import { MotionReveal } from "@/components/motion/MotionReveal";
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
import { motionPresets, type MotionRevealOrder } from "@/lib/design/motion";
import {
  motionKpiDeltaClass,
  motionKpiValueClass,
} from "@/lib/motion/kpi";
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
  trendKey?: string;
  sparkline?: ReactNode;
  revealOrder?: MotionRevealOrder;
  executive?: boolean;
  connected?: boolean;
  className?: string;
};

function replayValueEnterAnimation(element: HTMLSpanElement) {
  element.style.animation = "none";
  void element.offsetHeight;
  element.style.removeProperty("animation");
}

export function KpiCard({
  label,
  icon: Icon,
  value,
  format,
  tone = "default",
  bordered = false,
  pulse = false,
  trend,
  trendKey,
  sparkline,
  revealOrder,
  executive = false,
  connected = false,
  className,
}: KpiCardProps) {
  const valueWrapperRef = useRef<HTMLSpanElement>(null);
  const previousValue = useRef(value);
  const isHydrated = useRef(false);

  useEffect(() => {
    isHydrated.current = true;
  }, []);

  useEffect(() => {
    if (!isHydrated.current || previousValue.current === value) {
      return;
    }

    previousValue.current = value;

    const element = valueWrapperRef.current;
    if (!element) {
      return;
    }

    replayValueEnterAnimation(element);
  }, [value]);

  const card = (
    <div
      className={cn(
        kpiCellClass,
        executive && (connected ? "px-5 py-6" : "px-4 py-5"),
        motionPresets.transitionBase,
        !connected && motionPresets.hover.surfaceLift,
        bordered && !connected && kpiCellBorderClass,
        className
      )}
    >
      {executive ? (
        <>
          <div className="flex items-start justify-between gap-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--shell-muted)]">
              {label}
            </p>
            <div className="flex items-center gap-2">
              <div className={cn(kpiIconContainerClass, connected && "opacity-70")}>
                <Icon size={kpiIconSize} aria-hidden />
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
          </div>
          <p
            className={cn(
              kpiMetricGapClass,
              "ds-kpi",
              connected
                ? "text-[clamp(1.625rem,2.4vw,2rem)]"
                : "text-[clamp(1.5rem,2vw,1.75rem)]"
            )}
          >
            <span ref={valueWrapperRef} className={motionKpiValueClass}>
              <Metric value={value} formatter={format} />
            </span>
          </p>
          {trend ? (
            <div className={kpiTrendGapClass}>
              <span
                className={motionKpiDeltaClass}
                key={trendKey ?? "trend"}
              >
                {trend}
              </span>
            </div>
          ) : null}
          {sparkline ? (
            <div className={cn(kpiSparklineGapClass, connected ? "mt-2" : "mt-3")}>
              {sparkline}
            </div>
          ) : null}
        </>
      ) : (
        <>
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
            <span ref={valueWrapperRef} className={motionKpiValueClass}>
              <Metric value={value} formatter={format} />
            </span>
          </p>
          {trend ? (
            <div className={kpiTrendGapClass}>
              <span
                className={motionKpiDeltaClass}
                key={trendKey ?? "trend"}
              >
                {trend}
              </span>
            </div>
          ) : null}
          {sparkline ? <div className={kpiSparklineGapClass}>{sparkline}</div> : null}
        </>
      )}
      <span className="sr-only" aria-live="polite">
        {format(value)}
      </span>
    </div>
  );

  if (revealOrder === undefined) {
    return card;
  }

  return <MotionReveal order={revealOrder}>{card}</MotionReveal>;
}
