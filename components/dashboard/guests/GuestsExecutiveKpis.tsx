"use client";

import { useMemo } from "react";
import {
  Crown,
  Moon,
  RefreshCcw,
  Users,
  Wallet,
} from "lucide-react";

import { KpiCard } from "@/components/ui/data/KpiCard";
import { ExecutiveKpisPanel } from "@/components/dashboard/shared/ExecutiveKpisPanel";
import type { MotionRevealOrder } from "@/lib/design/motion";
import { useI18n } from "@/lib/i18n";

import { formatNightsCount } from "@/lib/dashboard/format";

import { useExecutiveKpiItems } from "@/components/dashboard/shared/useExecutiveKpiItems";

import {
  formatGuestCurrency,
  type GuestCrmKpis,
} from "./guest-crm-metrics";

type Props = {
  kpis: GuestCrmKpis;
  loading?: boolean;
};

export function GuestsExecutiveKpis({ kpis, loading = false }: Props) {
  const { t } = useI18n();

  const kpiItems = useMemo(
    (): Array<{
      key: keyof GuestCrmKpis;
      label: string;
      icon: typeof Users;
      tone: "default" | "success" | "warning";
      format: (value: number) => string;
    }> => [
      {
        key: "total",
        label: t("guests.kpiTotal"),
        icon: Users,
        tone: "default",
        format: (value) => String(Math.round(value)),
      },
      {
        key: "activeGuests",
        label: t("guests.kpiActive"),
        icon: Users,
        tone: "default",
        format: (value) => String(Math.round(value)),
      },
      {
        key: "returning",
        label: t("guests.kpiReturning"),
        icon: RefreshCcw,
        tone: "success",
        format: (value) => String(Math.round(value)),
      },
      {
        key: "vip",
        label: t("guests.crmVipTitle"),
        icon: Crown,
        tone: "warning",
        format: (value) => String(Math.round(value)),
      },
      {
        key: "averageStayNights",
        label: t("guests.kpiAverageStay"),
        icon: Moon,
        tone: "default",
        format: (value) => formatNightsCount(value, t),
      },
      {
        key: "lifetimeRevenue",
        label: t("guests.kpiLifetimeRevenue"),
        icon: Wallet,
        tone: "success",
        format: formatGuestCurrency,
      },
    ],
    [t]
  );

  const items = useExecutiveKpiItems(kpis, kpiItems);

  return (
    <ExecutiveKpisPanel
      ariaLabel={t("guests.kpiAriaLabel")}
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
            revealOrder={Math.min(index, 7) as MotionRevealOrder}
          />
        );
      })}
    </ExecutiveKpisPanel>
  );
}
