"use client";

import { useMemo, useState } from "react";

import type { Booking } from "@/types/booking";
import type { Room } from "@/types/room";

import {
  CalendarToolbar,
  CalendarGrid,
} from "@/components/dashboard/calendar";

type Props = {
  bookings: Booking[];
  rooms: Room[];
};

export function CalendarPage({
  bookings,
  rooms,
}: Props) {
  const [currentDate, setCurrentDate] = useState(
    new Date()
  );

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const daysInMonth = useMemo(() => {
    return new Date(
      year,
      month + 1,
      0
    ).getDate();
  }, [month, year]);

  function previousMonth() {
    setCurrentDate(
      new Date(year, month - 1, 1)
    );
  }

  function nextMonth() {
    setCurrentDate(
      new Date(year, month + 1, 1)
    );
  }

  function today() {
    setCurrentDate(new Date());
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
          HOTELAI ADMIN
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Календарь бронирований
        </h1>

        <p className="mt-3 text-zinc-400">
          Управление загрузкой номеров
        </p>
      </div>

      <CalendarToolbar
        date={currentDate}
        onPrevious={previousMonth}
        onNext={nextMonth}
        onToday={today}
      />

      <CalendarGrid
        rooms={rooms}
        bookings={bookings}
        month={month}
        year={year}
        daysInMonth={daysInMonth}
      />
    </div>
  );
}