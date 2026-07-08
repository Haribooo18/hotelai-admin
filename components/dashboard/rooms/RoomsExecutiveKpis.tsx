"use client";

import { useMemo } from "react";
import {
  BedDouble,
  Brush,
  DollarSign,
  Percent,
  Sparkles,
  TrendingUp,
  Wrench,
} from "lucide-react";

import { KpiCard } from "@/components/ui/data/KpiCard";
import { ExecutiveKpisPanel } from "@/components/dashboard/shared/ExecutiveKpisPanel";
import { formatPercent } from "@/lib/dashboard/format";
import { useI18n } from "@/lib/i18n";

import { useExecutiveKpiItems } from "@/components/dashboard/shared/useExecutiveKpiItems";

import {
  formatRoomCurrency,
  type RoomOpsKpis,
} from "./room-ops-metrics";

type Props = {
  kpis: RoomOpsKpis;
  loading?: boolean;
};

export function RoomsExecutiveKpis({ kpis, loading }: Props) {
  const { t } = useI18n();

  const kpiItems = useMemo(
    (): Array<{
      key: keyof RoomOpsKpis;
      label: string;
      icon: typeof BedDouble;
      tone: "default" | "success" | "warning";
      format: (value: number) => string;
    }> => [
      {
        key: "total",
        label: t("rooms.kpiTotal"),
        icon: BedDouble,
        tone: "default",
        format: (value) => String(Math.round(value)),
      },
      {
        key: "occupied",
        label: t("rooms.kpiOccupied"),
        icon: BedDouble,
        tone: "default",
        format: (value) => String(Math.round(value)),
      },
      {
        key: "available",
        label: t("rooms.kpiAvailable"),
        icon: Sparkles,
        tone: "success",
        format: (value) => String(Math.round(value)),
      },
      {
        key: "cleaning",
        label: t("statuses.housekeeping.dirty"),
        icon: Brush,
        tone: "warning",
        format: (value) => String(Math.round(value)),
      },
      {
        key: "maintenance",
        label: t("rooms.kpiOutOfService"),
        icon: Wrench,
        tone: "warning",
        format: (value) => String(Math.round(value)),
      },
      {
        key: "averageOccupancy",
        label: t("dashboard.occupancy"),
        icon: Percent,
        tone: "success",
        format: formatPercent,
      },
      {
        key: "adr",
        label: t("revenue.adrTrend"),
        icon: TrendingUp,
        tone: "default",
        format: formatRoomCurrency,
      },
      {
        key: "revenueToday",
        label: t("rooms.kpiRevenueToday"),
        icon: DollarSign,
        tone: "success",
        format: formatRoomCurrency,
      },
    ],
    [t]
  );

  const items = useExecutiveKpiItems(kpis, kpiItems);

  return (
    <ExecutiveKpisPanel
      ariaLabel={t("rooms.kpiAriaLabel")}
      loading={loading}
      count={8}
      gridClassName="sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8"
    >
      {items.map((item, index) => {
        const meta = kpiItems.find((entry) => entry.key === item.key);

        return (
          <KpiCard
            key={item.key}
            label={item.label}
            icon={item.icon}
            value={item.value}
            format={item.format}
            tone={meta?.tone}
            bordered={index > 0}
          />
        );
      })}
    </ExecutiveKpisPanel>
  );
}
