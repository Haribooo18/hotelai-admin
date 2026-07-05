import { AppShell } from "@/components/dashboard/AppShell";
import { RoomsPage } from "@/components/dashboard/rooms/RoomsPage";
import { createRoomsRepository } from "@/repositories/rooms.repository.server";
import { getCurrentHotel } from "@/lib/tenant";

export default async function RoomsRoute() {
  const [hotel, roomsRepo] = await Promise.all([
    getCurrentHotel(),
    createRoomsRepository(),
  ]);
  const rooms = await roomsRepo.getAll();

  return (
    <AppShell hotel={hotel}>
      <RoomsPage rooms={rooms} />
    </AppShell>
  );
}
