import { RoomsPage } from "@/components/dashboard/rooms/RoomsPage";
import { createBookingsRepository } from "@/repositories/bookings.repository.server";
import { createRoomsRepository } from "@/repositories/rooms.repository.server";
import { createServerRepositoryContext } from "@/repositories/context.server";
import { getTenantContext } from "@/lib/tenant/context";

export default async function RoomsRoute() {
  const tenant = await getTenantContext();
  const repositoryContext = await createServerRepositoryContext(tenant);

  const [rooms, bookings] = await Promise.all([
    createRoomsRepository(repositoryContext).getAll(),
    createBookingsRepository(repositoryContext).getAll(),
  ]);

  return <RoomsPage rooms={rooms} bookings={bookings} />;
}
