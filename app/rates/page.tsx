import { AppShell } from "@/components/dashboard/AppShell";
import { RevenuePage } from "@/components/dashboard/revenue";
import { createBookingsRepository } from "@/repositories/bookings.repository.server";
import { createRoomsRepository } from "@/repositories/rooms.repository.server";
import { getCurrentHotel } from "@/lib/tenant";

export default async function RatesRoute() {
  const [hotel, bookingsRepo, roomsRepo] = await Promise.all([
    getCurrentHotel(),
    createBookingsRepository(),
    createRoomsRepository(),
  ]);
  const [bookings, rooms] = await Promise.all([
    bookingsRepo.getAll(),
    roomsRepo.getAll(),
  ]);

  return (
    <AppShell hotel={hotel}>
      <RevenuePage bookings={bookings} rooms={rooms} />
    </AppShell>
  );
}
