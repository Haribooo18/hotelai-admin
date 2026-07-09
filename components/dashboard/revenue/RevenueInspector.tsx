"use client";

import { Download, LineChart } from "lucide-react";

import { SkeletonCrossfade } from "@/components/motion/SkeletonCrossfade";
import { MotionInspectorShell } from "@/components/motion/MotionInspectorShell";
import { WorkspaceInspectorSkeleton } from "@/components/dashboard/shared/skeleton";
import { Button } from "@/components/ui/core/Button";
import { Badge } from "@/components/ui/display/Badge";
import { Metric } from "@/components/ui/display/Metric";
import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { Panel } from "@/components/ui/primitives/Panel";
import { Section } from "@/components/ui/primitives/Section";
import { formatPercent, formatNightsCount } from "@/lib/dashboard/format";
import { formatTranslation, useI18n } from "@/lib/i18n";

import {
  computeDisplayForecastTotal,
  computeDisplayGrowth,
  RevenueDetailRow,
} from "./revenue-ui";
import {
  formatRevenueCurrency,
  type RevenueDateRange,
  type RevenueForecastPoint,
  type RevenueKpis,
  type RevenueTrendPoint,
} from "./revenue-metrics";

type Props = {
  kpis: RevenueKpis;
  trend: RevenueTrendPoint[];
  forecast: RevenueForecastPoint[];
  range: RevenueDateRange;
  useServerSnapshot: boolean;
  canExport: boolean;
  exporting: boolean;
  loading?: boolean;
  onExport: () => void;
};

export function RevenueInspector({
  kpis,
  trend,
  forecast,
  range,
  useServerSnapshot,
  canExport,
  exporting,
  loading = false,
  onExport,
}: Props) {
  const { t } = useI18n();
  const forecastTotal = computeDisplayForecastTotal(forecast);
  const growth = computeDisplayGrowth(trend);
  const periodRevenue = trend.reduce((sum, point) => sum + point.revenue, 0);
  const growthLabel = `${growth >= 0 ? "+" : ""}${growth}%`;

  return (
    <Panel variant="glass" className="h-full p-[var(--ds-surface-padding)]">
      <SkeletonCrossfade
        loading={loading}
        skeleton={<WorkspaceInspectorSkeleton />}
      >
        <MotionInspectorShell
        header={
          <Section
            title={t("revenue.inspectorTitle")}
            subtitle={t("revenue.inspectorSubtitle")}
            action={
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onExport}
                disabled={exporting || !canExport}
                loading={exporting}
                className="gap-1.5"
              >
                <Download size={14} aria-hidden />
                {t("common.export")}
              </Button>
            }
          />
        }
        content={
          <>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant={useServerSnapshot ? "success" : "outline"}>
                {useServerSnapshot
                  ? t("revenue.rpcSnapshot")
                  : t("revenue.clientAnalytics")}
              </Badge>
              <Badge variant="outline">
                {range.from} — {range.to}
              </Badge>
            </div>

            <dl className="mt-4 grid gap-2">
              <RevenueDetailRow
                label={t("revenue.periodRevenue")}
                value={formatRevenueCurrency(periodRevenue)}
              />
              <RevenueDetailRow
                label={t("revenue.kpiAdr")}
                value={formatRevenueCurrency(kpis.adr)}
              />
              <RevenueDetailRow
                label={t("revenue.revpar")}
                value={formatRevenueCurrency(kpis.revpar)}
              />
              <RevenueDetailRow
                label={t("revenue.kpiOccupancy")}
                value={formatPercent(kpis.occupancy)}
              />
              <RevenueDetailRow
                label={t("revenue.kpiAverageStay")}
                value={formatNightsCount(kpis.averageStay, t)}
              />
              <RevenueDetailRow
                label={t("revenue.cancellationRate")}
                value={formatPercent(kpis.cancellationRate)}
              />
            </dl>

            <div className="mt-4 rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/60 px-3 py-3">
              <p className="ds-overline">{t("revenue.forecastSevenDayTotal")}</p>
              <p className="mt-2 text-[var(--type-kpi-size)] font-[var(--type-kpi-weight)] text-[var(--shell-text)]">
                <Metric value={forecastTotal} formatter={formatRevenueCurrency} />
              </p>
            </div>

            <div className="mt-4">
              <p className="ds-overline">{t("revenue.forecastDetailsTitle")}</p>
              {forecast.length === 0 ? (
                <div className="mt-3">
                  <EmptyState
                    title={t("revenue.noForecast")}
                    description={t("revenue.noForecastDesc")}
                    icon={<LineChart size={16} />}
                  />
                </div>
              ) : (
                <ul className="mt-3 space-y-2" role="list">
                  {forecast.map((point) => (
                    <li
                      key={point.date}
                      role="listitem"
                      className="flex items-center justify-between gap-2 rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/70 px-3 py-2 text-[12px]"
                    >
                      <span className="text-[var(--shell-text)]">{point.label}</span>
                      <span className="font-medium text-[var(--shell-text)]">
                        {formatRevenueCurrency(point.projected)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <p className="mt-4 text-[11px] text-[var(--shell-muted)]">
              {formatTranslation(t("revenue.periodGrowthHint"), { growth: growthLabel })}
            </p>
          </>
        }
        />
      </SkeletonCrossfade>
    </Panel>
  );
}
