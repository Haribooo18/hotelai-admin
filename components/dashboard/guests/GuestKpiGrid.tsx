import {
  CalendarClock,
  Crown,
  Moon,
  RefreshCcw,
  Sparkles,
  Users,
} from "lucide-react";

import type { GuestCrmKpis } from "./guest-crm-metrics";
import {
  DashboardKpiCard,
  DashboardSkeleton,
  DashboardSurface,
} from "@/components/dashboard/home/DashboardPrimitives";

type Props = {
  kpis: GuestCrmKpis;
  loading?: boolean;
};

export function GuestKpiGrid({ kpis, loading = false }: Props) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <DashboardSurface key={index} className="p-[var(--ds-surface-padding)]">
            <DashboardSkeleton />
          </DashboardSurface>
        ))}
      </div>
    );
  }

  const cards = [
    { label: "Total guests", value: kpis.total, icon: <Users size={18} /> },
    {
      label: "Currently staying",
      value: kpis.stayingNow,
      icon: <CalendarClock size={18} />,
    },
    { label: "VIP", value: kpis.vip, icon: <Crown size={18} /> },
    {
      label: "New this month",
      value: kpis.newThisMonth,
      icon: <Sparkles size={18} />,
    },
    {
      label: "Average stay length",
      value: `${kpis.averageStayNights} nights`,
      icon: <Moon size={18} />,
    },
    {
      label: "Returning guests",
      value: kpis.returning,
      icon: <RefreshCcw size={18} />,
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
