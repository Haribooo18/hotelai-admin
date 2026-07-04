import type { Booking } from "@/types/booking";
import type { Room } from "@/types/room";

import { CalendarBooking } from "./CalendarBooking";

type Props = {
  room: Room;
  bookings: Booking[];

  month: number;
  year: number;
  daysInMonth: number;
};

export function CalendarRoomRow({
  room,
  bookings,
  month,
  year,
  daysInMonth,
}: Props) {
  const days = Array.from(
    { length: daysInMonth },
    (_, i) => i + 1
  );

  const monthStart = new Date(
    year,
    month,
    1
  );

  const monthEnd = new Date(
    year,
    month,
    daysInMonth
  );

  return (
    <div className="relative">
      <div
        className="grid border-b border-zinc-900"
        style={{
          gridTemplateColumns: `220px repeat(${daysInMonth}, minmax(48px, 1fr))`,
        }}
      >
        <div className="border-r border-zinc-800 p-4">
          <div className="font-medium">
            {room.room_type}
          </div>

          <div className="mt-1 text-xs text-zinc-500">
            ${room.price}
          </div>
        </div>

        {days.map((day) => (
          <div
            key={day}
            className="h-16 border-r border-zinc-900"
          />
        ))}
      </div>

      {bookings
        .filter((booking) => {
          const checkIn = new Date(
            booking.check_in
          );

          const checkOut = new Date(
            booking.check_out
          );

          return (
            checkIn <= monthEnd &&
            checkOut >= monthStart
          );
        })
        .map((booking) => {
          const checkIn = new Date(
            booking.check_in
          );

          const checkOut = new Date(
            booking.check_out
          );

          const start =
            checkIn < monthStart
              ? 1
              : checkIn.getDate();

          const end =
            checkOut > monthEnd
              ? daysInMonth
              : checkOut.getDate();

          return (
            <CalendarBooking
              key={booking.id}
              guest={booking.guest_name}
              start={start}
              end={end}
              status={booking.status}
            />
          );
        })}
    </div>
  );
}