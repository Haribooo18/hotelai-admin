import { AppShell } from "@/components/dashboard/AppShell";

import { CalendarPage } from "@/components/dashboard/calendar";

import { createBookingsRepository } from "@/repositories/bookings.repository.server";
import { createRoomsRepository } from "@/repositories/rooms.repository.server";
import { getCurrentHotel } from "@/lib/tenant";

export default async function Page() {
  const [hotel, roomsRepo, bookingsRepo] = await Promise.all([
    getCurrentHotel(),
    createRoomsRepository(),
    createBookingsRepository(),
  ]);
  const [rooms, bookings] = await Promise.all([
    roomsRepo.getAll(),
    bookingsRepo.getAll(),
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
