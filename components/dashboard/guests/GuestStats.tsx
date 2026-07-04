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
    { title: "Бронирований", value: stats.totalBookings, icon: Hotel },
    { title: "Всего ночей", value: stats.totalNights, icon: Moon },
    {
      title: "Общая выручка",
      value: `$${stats.totalRevenue.toFixed(0)}`,
      icon: DollarSign,
    },
    {
      title: "Последний визит",
      value: stats.lastStay ?? "—",
      icon: CalendarCheck,
    },
    {
      title: "Ближайший заезд",
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
            className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-500">{card.title}</p>
              <Icon size={18} className="text-emerald-500" />
            </div>
            <div className="mt-4 text-2xl font-bold">{card.value}</div>
          </div>
        );
      })}
    </div>
  );
}
