import {
  ArrowDownLeft,
  ArrowUpRight,
  BedDouble,
  ClipboardList,
  Star,
  Users,
  Wallet,
} from "lucide-react";

import {
  formatDashboardCurrency,
  formatDashboardPercent,
  type DashboardMetrics,
} from "./dashboard-metrics";
import {
  DashboardKpiCard,
  DashboardSkeleton,
  DashboardSurface,
} from "./DashboardPrimitives";

type Props = {
  metrics: DashboardMetrics;
  loading: boolean;
};

export function DashboardKpiGrid({ metrics, loading }: Props) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <DashboardSurface key={index} className="p-5">
            <DashboardSkeleton />
          </DashboardSurface>
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: "Occupancy",
      value: formatDashboardPercent(metrics.occupancyPercent),
      icon: <BedDouble size={18} />,
    },
    {
      label: "Revenue today",
      value: formatDashboardCurrency(metrics.revenueToday),
      icon: <Wallet size={18} />,
    },
    {
      label: "Revenue this month",
      value: formatDashboardCurrency(metrics.revenueMonth),
      icon: <Wallet size={18} />,
    },
    {
      label: "Active guests",
      value: metrics.activeGuests,
      icon: <Users size={18} />,
    },
    {
      label: "Check-ins",
      value: metrics.checkInsToday,
      icon: <ArrowUpRight size={18} />,
    },
    {
      label: "Check-outs",
      value: metrics.checkOutsToday,
      icon: <ArrowDownLeft size={18} />,
    },
    {
      label: "Open requests",
      value: metrics.openRequests,
      icon: <ClipboardList size={18} />,
    },
    {
      label: "Average rating",
      value:
        metrics.averageRating === null
          ? "—"
          : metrics.averageRating.toFixed(1),
      hint:
        metrics.averageRating === null ? "Not enough data to calculate" : undefined,
      icon: <Star size={18} />,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <DashboardKpiCard
          key={card.label}
          label={card.label}
          value={card.value}
          hint={card.hint}
          icon={card.icon}
        />
      ))}
    </div>
  );
}
