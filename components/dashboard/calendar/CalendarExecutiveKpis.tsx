"use client";

import { useMemo } from "react";
import {
  BedDouble,
  DoorClosed,
  DoorOpen,
  Percent,
  Users,
  Wallet,
} from "lucide-react";

import { KpiCard } from "@/components/ui/data/KpiCard";
import { ExecutiveKpisPanel } from "@/components/dashboard/shared/ExecutiveKpisPanel";
import { formatPercent } from "@/lib/dashboard/format";
import { useI18n } from "@/lib/i18n";

import { formatBookingCurrency } from "@/components/dashboard/bookings/booking-ops-metrics";
import { useExecutiveKpiItems } from "@/components/dashboard/shared/useExecutiveKpiItems";

import type { CalendarOpsKpis } from "./calendar-ops-metrics";

type Props = {
  kpis: CalendarOpsKpis;
  loading?: boolean;
};

export function CalendarExecutiveKpis({ kpis, loading }: Props) {
  const { t } = useI18n();

  const kpiItems = useMemo(
    (): Array<{
      key: keyof CalendarOpsKpis;
      label: string;
      icon: typeof Wallet;
      tone: "default" | "success" | "warning";
      format: (value: number) => string;
    }> => [
      {
        key: "occupancyPercent",
        label: t("dashboard.occupancy"),
        icon: Percent,
        tone: "success",
        format: formatPercent,
      },
      {
        key: "checkInsToday",
        label: t("bookings.kpiCheckInsToday"),
        icon: DoorOpen,
        tone: "success",
        format: (value) => String(Math.round(value)),
      },
      {
        key: "checkOutsToday",
        label: t("bookings.kpiCheckOutsToday"),
        icon: DoorClosed,
        tone: "default",
        format: (value) => String(Math.round(value)),
      },
      {
        key: "availableRooms",
        label: t("calendar.kpiAvailable"),
        icon: BedDouble,
        tone: "default",
        format: (value) => String(Math.round(value)),
      },
      {
        key: "revenueToday",
        label: t("calendar.kpiRevenueToday"),
        icon: Wallet,
        tone: "success",
        format: formatBookingCurrency,
      },
      {
        key: "activeStays",
        label: t("calendar.kpiActiveStays"),
        icon: Users,
        tone: "default",
        format: (value) => String(Math.round(value)),
      },
    ],
    [t]
  );

  const items = useExecutiveKpiItems(kpis, kpiItems);

  return (
    <ExecutiveKpisPanel
      ariaLabel={t("calendar.kpiAriaLabel")}
      loading={loading}
      count={6}
      gridClassName="sm:grid-cols-2 xl:grid-cols-6"
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
