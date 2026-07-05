"use client";

import {
  BedDouble,
  DoorClosed,
  DoorOpen,
  Percent,
  Users,
  Wallet,
} from "lucide-react";

import { formatBookingCurrency } from "@/components/dashboard/bookings/booking-ops-metrics";
import { ExecutiveKpisGrid } from "@/components/dashboard/shared/ExecutiveKpisGrid";
import { useExecutiveKpiItems } from "@/components/dashboard/shared/useExecutiveKpiItems";
import { formatPercent } from "@/lib/dashboard/format";

import type { CalendarOpsKpis } from "./calendar-ops-metrics";

type Props = {
  kpis: CalendarOpsKpis;
  loading?: boolean;
};

const KPI_ITEMS: Array<{
  key: keyof CalendarOpsKpis;
  label: string;
  icon: typeof Wallet;
  format: (value: number) => string;
}> = [
  {
    key: "occupancyPercent",
    label: "Occupancy",
    icon: Percent,
    format: formatPercent,
  },
  {
    key: "checkInsToday",
    label: "Check-ins today",
    icon: DoorOpen,
    format: (value) => String(Math.round(value)),
  },
  {
    key: "checkOutsToday",
    label: "Check-outs today",
    icon: DoorClosed,
    format: (value) => String(Math.round(value)),
  },
  {
    key: "availableRooms",
    label: "Available rooms",
    icon: BedDouble,
    format: (value) => String(Math.round(value)),
  },
  {
    key: "revenueToday",
    label: "Revenue today",
    icon: Wallet,
    format: formatBookingCurrency,
  },
  {
    key: "activeStays",
    label: "Active stays",
    icon: Users,
    format: (value) => String(Math.round(value)),
  },
];

export function CalendarExecutiveKpis({ kpis, loading }: Props) {
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
