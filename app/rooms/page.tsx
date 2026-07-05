import { AppShell } from "@/components/dashboard/AppShell";
import { RoomsPage } from "@/components/dashboard/rooms/RoomsPage";
import { getRooms } from "@/lib/services/rooms.service";
import { getCurrentHotel } from "@/lib/tenant";

export default async function RoomsRoute() {
  const [hotel, rooms] = await Promise.all([getCurrentHotel(), getRooms()]);

  return (
    <AppShell hotel={hotel}>
      <RoomsPage rooms={rooms} />
    </AppShell>
  );
}
