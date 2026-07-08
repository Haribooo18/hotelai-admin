import { BookingsPage } from "@/components/dashboard/bookings";
import { createBookingsRepository } from "@/repositories/bookings.repository.server";
import { createGuestsRepository } from "@/repositories/guests.repository.server";
import { createRoomsRepository } from "@/repositories/rooms.repository.server";
import { createServerRepositoryContext } from "@/repositories/context.server";
import { getTenantContext } from "@/lib/tenant/context";

export default async function BookingsRoute() {
  const tenant = await getTenantContext();
  const repositoryContext = await createServerRepositoryContext(tenant);

  const [bookings, rooms, guests] = await Promise.all([
    createBookingsRepository(repositoryContext).getAll(),
    createRoomsRepository(repositoryContext).getAll(),
    createGuestsRepository(repositoryContext).getAll(),
  ]);

  return (
    <BookingsPage bookings={bookings} rooms={rooms} guests={guests} />
  );
}
