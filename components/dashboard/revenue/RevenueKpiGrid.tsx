import {
  BedDouble,
  CalendarClock,
  CalendarDays,
  DollarSign,
  Percent,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import {
  formatRevenueCurrency,
  type RevenueKpis,
} from "./revenue-metrics";
import {
  DashboardKpiCard,
  DashboardSkeleton,
  DashboardSurface,
} from "@/components/dashboard/home/DashboardPrimitives";

type Props = {
  kpis: RevenueKpis;
  loading?: boolean;
};

export function RevenueKpiGrid({ kpis, loading = false }: Props) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8">
        {Array.from({ length: 8 }).map((_, index) => (
          <DashboardSurface key={index} className="p-[var(--ds-surface-padding)]">
            <DashboardSkeleton />
          </DashboardSurface>
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: "Revenue today",
      value: formatRevenueCurrency(kpis.revenueToday),
      icon: <DollarSign size={18} />,
    },
    {
      label: "Revenue this week",
      value: formatRevenueCurrency(kpis.revenueWeek),
      icon: <CalendarDays size={18} />,
    },
    {
      label: "Revenue this month",
      value: formatRevenueCurrency(kpis.revenueMonth),
      icon: <TrendingUp size={18} />,
    },
    {
      label: "ADR",
      value: formatRevenueCurrency(kpis.adr),
      icon: <DollarSign size={18} />,
    },
    {
      label: "RevPAR",
      value: formatRevenueCurrency(kpis.revpar),
      icon: <BedDouble size={18} />,
    },
    {
      label: "Occupancy",
      value: `${kpis.occupancy}%`,
      icon: <Percent size={18} />,
    },
    {
      label: "Average stay",
      value: `${kpis.averageStay} nights`,
      icon: <CalendarClock size={18} />,
    },
    {
      label: "Cancellations",
      value: `${kpis.cancellationRate}%`,
      icon: <TrendingDown size={18} />,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8">
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
