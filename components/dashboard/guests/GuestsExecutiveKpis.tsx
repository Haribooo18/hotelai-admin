"use client";

import {
  Crown,
  Moon,
  RefreshCcw,
  Users,
  Wallet,
} from "lucide-react";

import { ExecutiveKpisGrid } from "@/components/dashboard/shared/ExecutiveKpisGrid";
import { useExecutiveKpiItems } from "@/components/dashboard/shared/useExecutiveKpiItems";

import {
  formatGuestCurrency,
  type GuestCrmKpis,
} from "./guest-crm-metrics";

type Props = {
  kpis: GuestCrmKpis;
  loading?: boolean;
};

const KPI_ITEMS: Array<{
  key: keyof GuestCrmKpis;
  label: string;
  icon: typeof Users;
  format: (value: number) => string;
}> = [
  {
    key: "total",
    label: "Total guests",
    icon: Users,
    format: (value) => String(Math.round(value)),
  },
  {
    key: "activeGuests",
    label: "Active guests",
    icon: Users,
    format: (value) => String(Math.round(value)),
  },
  {
    key: "returning",
    label: "Returning guests",
    icon: RefreshCcw,
    format: (value) => String(Math.round(value)),
  },
  {
    key: "vip",
    label: "VIP guests",
    icon: Crown,
    format: (value) => String(Math.round(value)),
  },
  {
    key: "averageStayNights",
    label: "Average stay",
    icon: Moon,
    format: (value) => `${Math.round(value)}n`,
  },
  {
    key: "lifetimeRevenue",
    label: "Lifetime revenue",
    icon: Wallet,
    format: formatGuestCurrency,
  },
];

export function GuestsExecutiveKpis({ kpis, loading = false }: Props) {
  const items = useExecutiveKpiItems(kpis, KPI_ITEMS);

  return (
    <ExecutiveKpisGrid
      items={items}
      loading={loading}
      gridClassName="sm:grid-cols-2 xl:grid-cols-6"
      skeletonCount={6}
      skeletonValueClassName="h-7 w-16"
    />
  );
}
