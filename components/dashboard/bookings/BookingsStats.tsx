import {
  CalendarCheck,
  CalendarClock,
  DollarSign,
  Hotel,
} from "lucide-react";

import type { Booking } from "@/types/booking";

type Props = {
  bookings: Booking[];
};

export function BookingsStats({
  bookings,
}: Props) {
  const today = new Date().toISOString().slice(0, 10);

  const todayArrivals = bookings.filter(
    (b) => b.check_in === today
  ).length;

  const activeBookings = bookings.filter(
    (b) =>
      b.status === "confirmed" ||
      b.status === "checked_in"
  ).length;

  const revenue = bookings.reduce(
    (sum, booking) =>
      sum + Number(booking.total_price),
    0
  );

  const cards = [
    {
      title: "Бронирований",
      value: bookings.length,
      icon: Hotel,
    },
    {
      title: "Заезды сегодня",
      value: todayArrivals,
      icon: CalendarClock,
    },
    {
      title: "Активные",
      value: activeBookings,
      icon: CalendarCheck,
    },
    {
      title: "Выручка",
      value: `$${revenue.toFixed(0)}`,
      icon: DollarSign,
    },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-500">
                {card.title}
              </p>

              <Icon
                size={20}
                className="text-emerald-500"
              />
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