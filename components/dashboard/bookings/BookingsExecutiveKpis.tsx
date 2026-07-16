"use client";

import { useMemo } from "react";
import {
  DoorClosed,
  DoorOpen,
  Percent,
  Users,
  Wallet,
} from "lucide-react";

import { KpiCard } from "@/components/ui/data/KpiCard";
import { ExecutiveKpisPanel } from "@/components/dashboard/shared/ExecutiveKpisPanel";
import type { MotionRevealOrder } from "@/lib/design/motion";
import { formatPercent } from "@/lib/dashboard/format";
import { useI18n } from "@/lib/i18n";

import { useExecutiveKpiItems } from "@/components/dashboard/shared/useExecutiveKpiItems";

import {
  formatBookingCurrency,
  type BookingOpsKpis,
} from "./booking-ops-metrics";

type Props = {
  kpis: BookingOpsKpis;
  loading?: boolean;
};

export function BookingsExecutiveKpis({ kpis, loading }: Props) {
  const { t } = useI18n();

  const kpiItems = useMemo(
    (): Array<{
      key: keyof BookingOpsKpis;
      label: string;
      icon: typeof Wallet;
      tone: "default" | "success" | "warning";
      format: (value: number) => string;
    }> => [
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
        key: "activeStays",
        label: t("bookings.kpiActiveStays"),
        icon: Users,
        tone: "default",
        format: (value) => String(Math.round(value)),
      },
      {
        key: "occupancyPercent",
        label: t("bookings.kpiOccupancy"),
        icon: Percent,
        tone: "success",
        format: formatPercent,
      },
      {
        key: "revenueTotal",
        label: t("bookings.kpiRevenue"),
        icon: Wallet,
        tone: "success",
        format: formatBookingCurrency,
      },
    ],
    [t]
  );

  const items = useExecutiveKpiItems(kpis, kpiItems);

  return (
    <ExecutiveKpisPanel
      ariaLabel={t("bookings.kpiAriaLabel")}
      loading={loading}
      count={5}
      gridClassName="sm:grid-cols-2 xl:grid-cols-5"
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
            revealOrder={Math.min(index, 7) as MotionRevealOrder}
          />
        );
      })}
    </ExecutiveKpisPanel>
  );
}
