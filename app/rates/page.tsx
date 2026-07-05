import { AppShell } from "@/components/dashboard/AppShell";
import { RevenuePage } from "@/components/dashboard/revenue";
import { createBookingsRepository } from "@/repositories/bookings.repository.server";
import { createRoomsRepository } from "@/repositories/rooms.repository.server";
import { getCurrentHotel, getCurrentUserEmail } from "@/lib/tenant";

export default async function RatesRoute() {
  const [hotel, userEmail, bookings, rooms] = await Promise.all([
    getCurrentHotel(),
    getCurrentUserEmail(),
    createBookingsRepository().then((repo) => repo.getAll()),
    createRoomsRepository().then((repo) => repo.getAll()),
  ]);

  return (
    <AppShell hotel={hotel} userEmail={userEmail}>
      <RevenuePage bookings={bookings} rooms={rooms} />
    </AppShell>
  );
}
