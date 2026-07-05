import { AppShell } from "@/components/dashboard/AppShell";
import { GuestsPage } from "@/components/dashboard/guests";
import { createBookingsRepository } from "@/repositories/bookings.repository.server";
import { createGuestsRepository } from "@/repositories/guests.repository.server";
import { createRoomsRepository } from "@/repositories/rooms.repository.server";
import { createServerRepositoryContext } from "@/repositories/context.server";
import { getTenantContext } from "@/lib/tenant/context";

export default async function GuestsRoute() {
  const tenant = await getTenantContext();
  const repositoryContext = await createServerRepositoryContext(tenant);

  const [guests, bookings, rooms] = await Promise.all([
    createGuestsRepository(repositoryContext).getAll(),
    createBookingsRepository(repositoryContext).getAll(),
    createRoomsRepository(repositoryContext).getAll(),
  ]);

  return (
    <AppShell
      hotel={{ id: tenant.hotelId, name: tenant.hotelName }}
      userEmail={tenant.userEmail}
    >
      <GuestsPage guests={guests} bookings={bookings} rooms={rooms} />
    </AppShell>
  );
}
