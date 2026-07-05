import {
  CalendarCheck,
  CalendarClock,
  DollarSign,
  Hotel,
  Moon,
} from "lucide-react";

import type { GuestStats as GuestStatsType } from "@/types/guest";

type Props = {
  stats: GuestStatsType;
};

export function GuestStats({ stats }: Props) {
  const cards = [
    { title: "Bookings", value: stats.totalBookings, icon: Hotel },
    { title: "Total nights", value: stats.totalNights, icon: Moon },
    {
      title: "Total revenue",
      value: `$${stats.totalRevenue.toFixed(0)}`,
      icon: DollarSign,
    },
    {
      title: "Last visit",
      value: stats.lastStay ?? "—",
      icon: CalendarCheck,
    },
    {
      title: "Next check-in",
      value: stats.upcomingCheckIn ?? "—",
      icon: CalendarClock,
    },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="rounded-2xl border border-[var(--shell-border)] bg-[var(--shell-surface)] p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-[var(--shell-muted)]">{card.title}</p>
              <Icon size={18} className="text-emerald-500" />
            </div>
            <div className="mt-4 text-2xl font-bold">{card.value}</div>
          </div>
        );
      })}
    </div>
  );
}
