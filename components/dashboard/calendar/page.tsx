import { AppShell } from "@/components/dashboard/AppShell";

import { CalendarPage } from "@/components/dashboard/calendar";

import { getBookings } from "@/lib/services/bookings.service";
import { getRooms } from "@/lib/services/rooms.service";

export default async function Page() {
  const [rooms, bookings] = await Promise.all([
    getRooms(),
    getBookings(),
  ]);

  return (
    <AppShell>
      <CalendarPage
        rooms={rooms}
        bookings={bookings}
      />
    </AppShell>
  );
}