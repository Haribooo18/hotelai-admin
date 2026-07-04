import { AppShell } from "@/components/dashboard/AppShell";
import { BookingsPage } from "@/components/dashboard/bookings";
import { getBookings } from "@/lib/services/bookings.service";
import { getRooms } from "@/lib/services/rooms.service";
import { getCurrentHotel } from "@/lib/tenant";

export default async function BookingsRoute() {
  const [hotel, bookings, rooms] = await Promise.all([
    getCurrentHotel(),
    getBookings(),
    getRooms(),
  ]);

  return (
    <AppShell hotel={hotel}>
      <BookingsPage bookings={bookings} rooms={rooms} />
    </AppShell>
  );
}
