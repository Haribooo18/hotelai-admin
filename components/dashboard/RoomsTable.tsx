"use client";

import { useRouter } from "next/navigation";
import { BedDouble, Pencil, Trash2, Users } from "lucide-react";
import { toast } from "sonner";

import { deleteRoom } from "@/lib/services/rooms.mutations";
import type { Room } from "@/types/room";

import { RoomCreateDialog } from "@/components/dashboard/rooms";

type Props = {
  rooms: Room[];
};

export function RoomsTable({ rooms }: Props) {
  const router = useRouter();

  const handleDelete = async (room: Room) => {
    if (!confirm(`Удалить номер "${room.room_type}"?`)) {
      return;
    }

    try {
      await deleteRoom(room.id);

      toast.success("Номер успешно удалён");

      router.refresh();
    } catch (error) {
      console.error(error);

      toast.error("Не удалось удалить номер");
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
      <table className="w-full">
        <thead className="border-b border-zinc-800 bg-zinc-900">
          <tr>
            <th className="px-6 py-4 text-left text-xs uppercase text-zinc-500">
              Тип номера
            </th>

            <th className="px-6 py-4 text-left text-xs uppercase text-zinc-500">
              Вместимость
            </th>

            <th className="px-6 py-4 text-left text-xs uppercase text-zinc-500">
              Цена
            </th>

            <th className="px-6 py-4 text-right text-xs uppercase text-zinc-500">
              Действия
            </th>
          </tr>
        </thead>

        <tbody>
          {rooms.map((room) => (
            <tr
              key={room.id}
              className="border-b border-zinc-900 hover:bg-zinc-900/60"
            >
              <td className="px-6 py-5">
                <div className="flex items-center gap-3">
                  <BedDouble size={18} />
                  <span className="font-medium">
                    {room.room_type}
                  </span>
                </div>
              </td>

              <td className="px-6 py-5">
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  {room.capacity}
                </div>
              </td>

              <td className="px-6 py-5">
                ${Number(room.price).toFixed(0)}
              </td>

              <td className="px-6 py-5">
                <div className="flex justify-end gap-2">
                  <RoomCreateDialog
                    room={room}
                    trigger={
                      <button className="rounded-lg border border-zinc-700 p-2 transition hover:bg-zinc-800">
                        <Pencil size={16} />
                      </button>
                    }
                  />

                  <button
                    onClick={() => handleDelete(room)}
                    className="rounded-lg border border-red-900 p-2 text-red-400 transition hover:bg-red-950"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}