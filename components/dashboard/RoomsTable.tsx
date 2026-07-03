"use client";

import {
  BedDouble,
  Users,
  CheckCircle2,
  XCircle,
} from "lucide-react";

type Room = {
  id: string;
  name: string;
  type: string;
  capacity: number;
  status: "available" | "occupied" | "maintenance";
};

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
              Номер
            </th>

            <th className="px-6 py-4 text-left text-xs uppercase text-zinc-500">
              Тип
            </th>

            <th className="px-6 py-4 text-left text-xs uppercase text-zinc-500">
              Вместимость
            </th>

            <th className="px-6 py-4 text-left text-xs uppercase text-zinc-500">
              Статус
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

                  <div>
                    <div className="font-medium">{room.name}</div>
                  </div>
                </div>
              </td>

              <td className="px-6 py-5">
                {room.type}
              </td>

              <td className="px-6 py-5">
                <div className="flex items-center gap-2">
                  <Users size={16} />

                  {room.capacity}
                </div>
              </td>

              <td className="px-6 py-5">
                {room.status === "available" && (
                  <span className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 size={16} />
                    Свободен
                  </span>
                )}

                {room.status === "occupied" && (
                  <span className="text-orange-400">
                    Занят
                  </span>
                )}

                {room.status === "maintenance" && (
                  <span className="flex items-center gap-2 text-red-400">
                    <XCircle size={16} />
                    Обслуживание
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}