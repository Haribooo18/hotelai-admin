"use client";

import { BedDouble, Users } from "lucide-react";
import type { Room } from "@/lib/services/rooms.service";

type Props = {
  rooms: Room[];
};

export function RoomsTable({ rooms }: Props) {
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
                  <span className="font-medium">{room.room_type}</span>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}