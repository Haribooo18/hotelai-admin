import {
  BedDouble,
  Brush,
  Percent,
  Sparkles,
  Wrench,
} from "lucide-react";

import type { RoomOpsKpis } from "./room-ops-metrics";
import {
  DashboardKpiCard,
  DashboardSkeleton,
  DashboardSurface,
} from "@/components/dashboard/home/DashboardPrimitives";

type Props = {
  kpis: RoomOpsKpis;
  loading?: boolean;
};

export function RoomKpiGrid({ kpis, loading = false }: Props) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <DashboardSurface key={index} className="p-5">
            <DashboardSkeleton />
          </DashboardSurface>
        ))}
      </div>
    );
  }

  const cards = [
    { label: "Total rooms", value: kpis.total, icon: <BedDouble size={18} /> },
    { label: "Available", value: kpis.available, icon: <Sparkles size={18} /> },
    { label: "Occupied", value: kpis.occupied, icon: <BedDouble size={18} /> },
    { label: "Housekeeping", value: kpis.cleaning, icon: <Brush size={18} /> },
    {
      label: "Maintenance",
      value: kpis.maintenance,
      icon: <Wrench size={18} />,
    },
    {
      label: "Average occupancy",
      value: `${kpis.averageOccupancy}%`,
      icon: <Percent size={18} />,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {cards.map((card) => (
        <DashboardKpiCard
          key={card.label}
          label={card.label}
          value={card.value}
          icon={card.icon}
        />
      ))}
    </div>
  );
}
