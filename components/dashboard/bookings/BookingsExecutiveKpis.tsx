"use client";

import {
  DoorClosed,
  DoorOpen,
  Percent,
  Users,
  Wallet,
} from "lucide-react";

import { ExecutiveKpisGrid } from "@/components/dashboard/shared/ExecutiveKpisGrid";
import { useExecutiveKpiItems } from "@/components/dashboard/shared/useExecutiveKpiItems";
import { formatPercent } from "@/lib/dashboard/format";

import {
  formatBookingCurrency,
  type BookingOpsKpis,
} from "./booking-ops-metrics";

type Props = {
  kpis: BookingOpsKpis;
  loading: boolean;
};

const KPI_ITEMS: Array<{
  key: keyof BookingOpsKpis;
  label: string;
  icon: typeof Wallet;
  format: (value: number) => string;
}> = [
  {
    key: "checkInsToday",
    label: "Today's check-ins",
    icon: DoorOpen,
    format: (value) => String(Math.round(value)),
  },
  {
    key: "checkOutsToday",
    label: "Today's check-outs",
    icon: DoorClosed,
    format: (value) => String(Math.round(value)),
  },
  {
    key: "activeStays",
    label: "Active stays",
    icon: Users,
    format: (value) => String(Math.round(value)),
  },
  {
    key: "occupancyPercent",
    label: "Occupancy",
    icon: Percent,
    format: formatPercent,
  },
  {
    key: "revenueTotal",
    label: "Revenue",
    icon: Wallet,
    format: formatBookingCurrency,
  },
];

export function BookingsExecutiveKpis({ kpis, loading }: Props) {
  const items = useExecutiveKpiItems(kpis, KPI_ITEMS);

  return (
    <ExecutiveKpisGrid
      items={items}
      loading={loading}
      gridClassName="sm:grid-cols-2 xl:grid-cols-5"
      skeletonCount={5}
      skeletonValueClassName="h-7 w-16"
    />
  );
}
