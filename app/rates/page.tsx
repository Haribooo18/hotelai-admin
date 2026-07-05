import { AppShell } from "@/components/dashboard/AppShell";
import { RevenuePage } from "@/components/dashboard/revenue";
import { getBookings } from "@/lib/services/bookings.service";
import { getRooms } from "@/lib/services/rooms.service";
import { getCurrentHotel } from "@/lib/tenant";

export default async function RatesRoute() {
  const [hotel, bookings, rooms] = await Promise.all([
    getCurrentHotel(),
    getBookings(),
    getRooms(),
  ]);

  return (
    <AppShell hotel={hotel}>
      <RevenuePage bookings={bookings} rooms={rooms} />
    </AppShell>
  );
}
