import { AppShell } from "@/components/dashboard/AppShell";

import { CalendarPage } from "@/components/dashboard/calendar";

import { createBookingsRepository } from "@/repositories/bookings.repository.server";
import { createGuestsRepository } from "@/repositories/guests.repository.server";
import { createRoomsRepository } from "@/repositories/rooms.repository.server";
import { createServerRepositoryContext } from "@/repositories/context.server";
import { getTenantContext } from "@/lib/tenant/context";

export default async function Page() {
  const tenant = await getTenantContext();
  const repositoryContext = await createServerRepositoryContext(tenant);

  const [rooms, bookings, guests] = await Promise.all([
    createRoomsRepository(repositoryContext).getAll(),
    createBookingsRepository(repositoryContext).getAll(),
    createGuestsRepository(repositoryContext).getAll(),
  ]);

  return (
    <AppShell
      hotel={{ id: tenant.hotelId, name: tenant.hotelName }}
      userEmail={tenant.userEmail}
    >
      <CalendarPage rooms={rooms} bookings={bookings} guests={guests} />
    </AppShell>
  );
}
