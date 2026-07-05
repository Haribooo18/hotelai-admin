import { AppShell } from "@/components/dashboard/AppShell";
import { RoomsTable } from "@/components/dashboard/RoomsTable";
import { RoomCreateDialog } from "@/components/dashboard/rooms/RoomCreateDialog";
import { getRooms } from "@/lib/services/rooms.service";
import { getCurrentHotel } from "@/lib/tenant";

export default async function RoomsPage() {
  const [hotel, rooms] = await Promise.all([getCurrentHotel(), getRooms()]);

  return (
    <AppShell hotel={hotel}>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold">
            Управление номерами
          </h1>

          <p className="mt-2 text-zinc-500">
            Добавляйте и редактируйте номера гостиницы.
          </p>
        </div>

        <RoomCreateDialog />
      </div>

      <RoomsTable rooms={rooms} />
    </AppShell>
  );
}