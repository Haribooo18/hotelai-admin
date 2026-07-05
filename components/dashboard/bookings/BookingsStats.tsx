import {
  CalendarCheck,
  CalendarClock,
  Sparkles,
  Users,
} from "lucide-react";

import type { Booking } from "@/types/booking";

import { DashboardKpiCard } from "@/components/dashboard/home/DashboardPrimitives";

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
      icon: <Users size={17} />,
    },
    {
      title: "New",
      value: countNewBookings(bookings),
      icon: <Sparkles size={17} />,
    },
    {
      title: "Today",
      value: countTodayBookings(bookings),
      icon: <CalendarClock size={17} />,
      hint: today,
    },
    {
      title: "Confirmed",
      value: bookings.filter((b) => b.status === "confirmed").length,
      icon: <CalendarCheck size={17} />,
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <DashboardKpiCard
          key={card.title}
          label={card.title}
          value={card.value}
          hint={card.hint}
          icon={card.icon}
        />
      ))}
    </div>
  );
}
