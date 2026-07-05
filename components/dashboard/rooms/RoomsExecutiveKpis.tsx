"use client";

import {
  BedDouble,
  Brush,
  DollarSign,
  Percent,
  Sparkles,
  TrendingUp,
  Wrench,
} from "lucide-react";

import { ExecutiveKpisGrid } from "@/components/dashboard/shared/ExecutiveKpisGrid";
import { useExecutiveKpiItems } from "@/components/dashboard/shared/useExecutiveKpiItems";
import { formatPercent } from "@/lib/dashboard/format";

import {
  formatRoomCurrency,
  type RoomOpsKpis,
} from "./room-ops-metrics";

type Props = {
  kpis: RoomOpsKpis;
  loading?: boolean;
};

const KPI_ITEMS: Array<{
  key: keyof RoomOpsKpis;
  label: string;
  icon: typeof BedDouble;
  format: (value: number) => string;
}> = [
  { key: "total", label: "Total rooms", icon: BedDouble, format: (v) => String(v) },
  { key: "occupied", label: "Occupied", icon: BedDouble, format: (v) => String(v) },
  { key: "available", label: "Available", icon: Sparkles, format: (v) => String(v) },
  { key: "cleaning", label: "Dirty", icon: Brush, format: (v) => String(v) },
  { key: "maintenance", label: "Out of service", icon: Wrench, format: (v) => String(v) },
  {
    key: "averageOccupancy",
    label: "Occupancy",
    icon: Percent,
    format: formatPercent,
  },
  { key: "adr", label: "ADR", icon: TrendingUp, format: formatRoomCurrency },
  {
    key: "revenueToday",
    label: "Revenue today",
    icon: DollarSign,
    format: formatRoomCurrency,
  },
];

export function RoomsExecutiveKpis({ kpis, loading }: Props) {
  const items = useExecutiveKpiItems(kpis, KPI_ITEMS);

  return (
    <ExecutiveKpisGrid
      items={items}
      loading={loading}
      gridClassName="sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8"
      borderFrom="2xl"
      skeletonCount={8}
    />
  );
}
