import { AppShell } from "@/components/dashboard/AppShell";
import { RoomsPage } from "@/components/dashboard/rooms/RoomsPage";
import { createBookingsRepository } from "@/repositories/bookings.repository.server";
import { createRoomsRepository } from "@/repositories/rooms.repository.server";
import { getCurrentHotel, getCurrentUserEmail } from "@/lib/tenant";

export default async function RoomsRoute() {
  const [hotel, userEmail, rooms, bookings] = await Promise.all([
    getCurrentHotel(),
    getCurrentUserEmail(),
    createRoomsRepository().then((repo) => repo.getAll()),
    createBookingsRepository().then((repo) => repo.getAll()),
  ]);

  return (
    <AppShell hotel={hotel} userEmail={userEmail}>
      <RoomsPage rooms={rooms} bookings={bookings} />
    </AppShell>
  );
}
