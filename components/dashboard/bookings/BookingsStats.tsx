import {
  CalendarCheck,
  CalendarClock,
  Sparkles,
  Users,
} from "lucide-react";

import type { Booking } from "@/types/booking";

type Props = {
  bookings: Booking[];
};

function countNewBookings(bookings: Booking[]): number {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  return bookings.filter((booking) => {
    const created = new Date(booking.created_at);
    return created >= weekAgo;
  }).length;
}

function countTodayBookings(bookings: Booking[]): number {
  const today = new Date().toISOString().slice(0, 10);

  return bookings.filter(
    (booking) => booking.check_in === today || booking.check_out === today
  ).length;
}

export function BookingsStats({ bookings }: Props) {
  const today = new Date().toISOString().slice(0, 10);

  const cards = [
    {
      title: "Total",
      value: bookings.length,
      icon: Users,
    },
    {
      title: "New",
      value: countNewBookings(bookings),
      icon: Sparkles,
    },
    {
      title: "Today",
      value: countTodayBookings(bookings),
      icon: CalendarClock,
      hint: today,
    },
    {
      title: "Confirmed",
      value: bookings.filter((b) => b.status === "confirmed").length,
      icon: CalendarCheck,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-[20px] bg-[var(--shell-surface)] p-5 shadow-[var(--shell-shadow-sm)] transition-all duration-[180ms] ease-out hover:-translate-y-0.5 hover:shadow-[var(--shell-shadow-md)]"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-[13px] font-medium text-[var(--shell-muted)]">
                {card.title}
              </p>
              <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-emerald-500/10 text-emerald-500">
                <Icon size={18} />
              </div>
            </div>

            <p className="mt-4 text-[32px] font-semibold tracking-[-0.02em] text-[var(--shell-text)]">
              {card.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
