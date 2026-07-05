"use client";

import { Download, LineChart } from "lucide-react";

import { Button } from "@/components/ui/core/Button";
import { Badge } from "@/components/ui/display/Badge";
import { Metric } from "@/components/ui/display/Metric";
import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { Panel } from "@/components/ui/primitives/Panel";
import { Section } from "@/components/ui/primitives/Section";
import { formatPercent } from "@/lib/dashboard/format";

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
  onExport,
}: Props) {
  const forecastTotal = computeDisplayForecastTotal(forecast);
  const growth = computeDisplayGrowth(trend);
  const periodRevenue = trend.reduce((sum, point) => sum + point.revenue, 0);

  return (
    <Panel variant="glass" className="h-full p-[var(--ds-surface-padding)]">
      <Section
        title="Inspector"
        subtitle="Revenue summary and RPC snapshot"
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
            Export
          </Button>
        }
      />

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge variant={useServerSnapshot ? "success" : "outline"}>
          {useServerSnapshot ? "RPC snapshot" : "Client analytics"}
        </Badge>
        <Badge variant="outline">{range.from} — {range.to}</Badge>
      </div>

      <dl className="mt-4 grid gap-2">
        <RevenueDetailRow
          label="Period revenue"
          value={formatRevenueCurrency(periodRevenue)}
        />
        <RevenueDetailRow
          label="ADR"
          value={formatRevenueCurrency(kpis.adr)}
        />
        <RevenueDetailRow
          label="RevPAR"
          value={formatRevenueCurrency(kpis.revpar)}
        />
        <RevenueDetailRow
          label="Occupancy"
          value={formatPercent(kpis.occupancy)}
        />
        <RevenueDetailRow
          label="Average stay"
          value={`${Math.round(kpis.averageStay)}n`}
        />
        <RevenueDetailRow
          label="Cancellation rate"
          value={formatPercent(kpis.cancellationRate)}
        />
      </dl>

      <div className="mt-4 rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/60 px-3 py-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--shell-muted)]">
          7-day forecast total
        </p>
        <p className="mt-2 text-[var(--type-kpi-size)] font-[var(--type-kpi-weight)] text-[var(--shell-text)]">
          <Metric value={forecastTotal} formatter={formatRevenueCurrency} />
        </p>
      </div>

      <div className="mt-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--shell-muted)]">
          Forecast details
        </p>
        {forecast.length === 0 ? (
          <div className="mt-3">
            <EmptyState
              title="No forecast"
              description="Forecast appears once enough trend data is available."
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
        Period growth: {growth >= 0 ? "+" : ""}
        {growth}% versus prior half of selected range
      </p>
    </Panel>
  );
}
