"use client";

import {
  BedDouble,
  CalendarDays,
  DollarSign,
  Hotel,
} from "lucide-react";

type Props = {
  stats: {
    rooms: number;
    bookings: number;
    occupied: number;
    occupancy: number;
    revenue: number;
  };
};

export function DashboardStats({
  stats,
}: Props) {
  const cards = [
    {
      title: "Номеров",
      value: stats.rooms,
      icon: Hotel,
    },
    {
      title: "Бронирований",
      value: stats.bookings,
      icon: CalendarDays,
    },
    {
      title: "Загрузка",
      value: `${stats.occupancy}%`,
      icon: BedDouble,
    },
    {
      title: "Доход",
      value: `$${stats.revenue.toFixed(0)}`,
      icon: DollarSign,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6"
          >
            <div className="flex items-center justify-between">
              <div className="text-sm text-zinc-500">
                {card.title}
              </div>

              <Icon className="text-emerald-500" />
            </div>

            <div className="mt-5 text-3xl font-bold">
              {card.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}