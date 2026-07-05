import { AppShell } from "@/components/dashboard/AppShell";
import { RevenuePage } from "@/components/dashboard/revenue";
import { createBookingsRepository } from "@/repositories/bookings.repository.server";
import { createRoomsRepository } from "@/repositories/rooms.repository.server";
import { createServerRepositoryContext } from "@/repositories/context.server";
import { getTenantContext } from "@/lib/tenant/context";

export default async function RatesRoute() {
  const tenant = await getTenantContext();
  const repositoryContext = await createServerRepositoryContext(tenant);

  const [bookings, rooms] = await Promise.all([
    createBookingsRepository(repositoryContext).getAll(),
    createRoomsRepository(repositoryContext).getAll(),
  ]);

  return (
    <AppShell
      hotel={{ id: tenant.hotelId, name: tenant.hotelName }}
      userEmail={tenant.userEmail}
    >
      <RevenuePage bookings={bookings} rooms={rooms} />
    </AppShell>
  );
}
