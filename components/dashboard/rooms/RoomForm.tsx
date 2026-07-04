"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  createRoom,
  updateRoom,
} from "@/lib/services/rooms.mutations";

import type { Room } from "@/types/room";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  room?: Room;
  hotelId?: string;
  onSuccess?: () => void;
};

export function RoomForm({
  room,
  hotelId = "hotel_aurora",
  onSuccess,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [roomType, setRoomType] = useState(room?.room_type ?? "");
  const [capacity, setCapacity] = useState(room?.capacity ?? 2);
  const [price, setPrice] = useState(Number(room?.price ?? 100));

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!roomType.trim()) {
      toast.error("Введите тип номера");
      return;
    }

    if (capacity < 1) {
      toast.error("Вместимость должна быть больше 0");
      return;
    }

    if (price <= 0) {
      toast.error("Цена должна быть больше 0");
      return;
    }

    startTransition(async () => {
      try {
        if (room) {
          await updateRoom({
            id: room.id,
            room_type: roomType.trim(),
            capacity,
            price,
          });

          toast.success("Номер успешно обновлён");
        } else {
          await createRoom({
            hotel_id: hotelId,
            room_type: roomType.trim(),
            capacity,
            price,
          });

          toast.success("Номер успешно создан");
        }

        router.refresh();
        onSuccess?.();
      } catch (error) {
        console.error(error);
        toast.error("Ошибка сохранения номера");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        placeholder="Тип номера"
        value={roomType}
        onChange={(e) => setRoomType(e.target.value)}
        required
      />

      <Input
        type="number"
        min={1}
        placeholder="Вместимость"
        value={capacity}
        onChange={(e) => setCapacity(Number(e.target.value))}
        required
      />

      <Input
        type="number"
        min={1}
        placeholder="Цена"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        required
      />

      <Button
        type="submit"
        className="w-full"
        disabled={pending}
      >
        {pending
          ? "Сохранение..."
          : room
            ? "Сохранить изменения"
            : "Создать номер"}
      </Button>
    </form>
  );
}