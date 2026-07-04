import type { Booking } from "@/types/booking";
import type { Room } from "@/types/room";

import { CalendarHeader } from "./CalendarHeader";
import { CalendarRoomRow } from "./CalendarRoomRow";

type Props = {
  rooms: Room[];
  bookings: Booking[];

  month: number;
  year: number;
  daysInMonth: number;
};

export function CalendarGrid({
  rooms,
  bookings,
  month,
  year,
  daysInMonth,
}: Props) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-max">
        <CalendarHeader
          month={month}
          year={year}
          daysInMonth={daysInMonth}
        />

        {rooms.map((room) => (
          <CalendarRoomRow
            key={room.id}
            room={room}
            bookings={bookings.filter(
              (booking) =>
                booking.room_id === room.id
            )}
            month={month}
            year={year}
            daysInMonth={daysInMonth}
          />
        ))}
      </div>
    </div>
  );
}