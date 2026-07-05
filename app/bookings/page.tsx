import { AppShell } from "@/components/dashboard/AppShell";
import { BookingsPage } from "@/components/dashboard/bookings";
import { createBookingsRepository } from "@/repositories/bookings.repository.server";
import { createRoomsRepository } from "@/repositories/rooms.repository.server";
import { getCurrentHotel } from "@/lib/tenant";

export default async function BookingsRoute() {
  const hotel = await getCurrentHotel();
  const [bookingsRepo, roomsRepo] = await Promise.all([
    createBookingsRepository(),
    createRoomsRepository(),
  ]);
  const [bookings, rooms] = await Promise.all([
    bookingsRepo.getAll(),
    roomsRepo.getAll(),
  ]);

  return (
    <AppShell hotel={hotel}>
      <BookingsPage bookings={bookings} rooms={rooms} />
    </AppShell>
  );
}
