import { AppShell } from "@/components/dashboard/AppShell";

import { CalendarPage } from "@/components/dashboard/calendar";

import { getBookings } from "@/lib/services/bookings.service";
import { getRooms } from "@/lib/services/rooms.service";
import { getCurrentHotel } from "@/lib/tenant";

export default async function Page() {
  const [hotel, rooms, bookings] = await Promise.all([
    getCurrentHotel(),
    getRooms(),
    getBookings(),
  ]);

  return (
    <AppShell hotel={hotel}>
      <CalendarPage
        rooms={rooms}
        bookings={bookings}
      />
    </AppShell>
  );
}