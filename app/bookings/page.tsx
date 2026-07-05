import { AppShell } from "@/components/dashboard/AppShell";
import { BookingsPage } from "@/components/dashboard/bookings";
import { createBookingsRepository } from "@/repositories/bookings.repository.server";
import { createGuestsRepository } from "@/repositories/guests.repository.server";
import { createRoomsRepository } from "@/repositories/rooms.repository.server";
import { getCurrentHotel, getCurrentUserEmail } from "@/lib/tenant";

export default async function BookingsRoute() {
  const [hotel, userEmail, bookings, rooms, guests] = await Promise.all([
    getCurrentHotel(),
    getCurrentUserEmail(),
    createBookingsRepository().then((repo) => repo.getAll()),
    createRoomsRepository().then((repo) => repo.getAll()),
    createGuestsRepository().then((repo) => repo.getAll()),
  ]);

  return (
    <AppShell hotel={hotel} userEmail={userEmail}>
      <BookingsPage bookings={bookings} rooms={rooms} guests={guests} />
    </AppShell>
  );
}
