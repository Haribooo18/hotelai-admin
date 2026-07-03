import { AppShell } from "@/components/dashboard/AppShell";
import { RoomsTable } from "@/components/dashboard/RoomsTable";
import { getRooms } from "@/lib/services/rooms.service";

export default async function RoomsPage() {
  const rooms = await getRooms();

  return (
    <AppShell>
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">
          HOTELAI ADMIN
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Управление номерами
        </h1>

        <p className="mt-2 text-zinc-500">
          Добавляйте и редактируйте номера гостиницы.
        </p>
      </div>

      <RoomsTable rooms={rooms} />
    </AppShell>
  );
}