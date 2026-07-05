import { AppShell } from "@/components/dashboard/AppShell";

import { CalendarPage } from "@/components/dashboard/calendar";

import { createBookingsRepository } from "@/repositories/bookings.repository.server";
import { createGuestsRepository } from "@/repositories/guests.repository.server";
import { createRoomsRepository } from "@/repositories/rooms.repository.server";
import { getCurrentHotel, getCurrentUserEmail } from "@/lib/tenant";

export default async function Page() {
  const [hotel, userEmail, rooms, bookings, guests] = await Promise.all([
    getCurrentHotel(),
    getCurrentUserEmail(),
    createRoomsRepository().then((repo) => repo.getAll()),
    createBookingsRepository().then((repo) => repo.getAll()),
    createGuestsRepository().then((repo) => repo.getAll()),
  ]);

  return (
    <AppShell hotel={hotel} userEmail={userEmail}>
      <CalendarPage rooms={rooms} bookings={bookings} guests={guests} />
    </AppShell>
  );
}
