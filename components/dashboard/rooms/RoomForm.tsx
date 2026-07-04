"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createRoom, updateRoom } from "@/lib/services/rooms.mutations";
import {
  roomCreateSchema,
  roomUpdateSchema,
} from "@/lib/validations/room";

import type { Room } from "@/types/room";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  room?: Room;
  onSuccess?: () => void;
};

type FieldErrors = Partial<
  Record<"room_type" | "capacity" | "price", string>
>;

export function RoomForm({ room, onSuccess }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [roomType, setRoomType] = useState(room?.room_type ?? "");
  const [capacity, setCapacity] = useState(String(room?.capacity ?? 2));
  const [price, setPrice] = useState(String(room?.price ?? 100));
  const [errors, setErrors] = useState<FieldErrors>({});

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const raw = { room_type: roomType, capacity, price };

    const parsed = room
      ? roomUpdateSchema.safeParse({ ...raw, id: room.id })
      : roomCreateSchema.safeParse(raw);

    if (!parsed.success) {
      const nextErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FieldErrors;
        if (key && !nextErrors[key]) {
          nextErrors[key] = issue.message;
        }
      }
      setErrors(nextErrors);
      return;
    }

    setErrors({});

    startTransition(async () => {
      try {
        if (room) {
          await updateRoom({ ...parsed.data, id: room.id });
          toast.success("Номер успешно обновлён");
        } else {
          await createRoom(parsed.data);
          toast.success("Номер успешно создан");
        }

        router.refresh();
        onSuccess?.();
      } catch (error) {
        console.error(error);
        toast.error(
          error instanceof Error ? error.message : "Ошибка сохранения номера"
        );
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <Field label="Тип номера" htmlFor="room_type" error={errors.room_type}>
        <Input
          id="room_type"
          placeholder="Тип номера"
          value={roomType}
          onChange={(e) => setRoomType(e.target.value)}
          aria-invalid={Boolean(errors.room_type)}
          aria-describedby={errors.room_type ? "room_type-error" : undefined}
        />
      </Field>

      <Field label="Вместимость" htmlFor="capacity" error={errors.capacity}>
        <Input
          id="capacity"
          type="number"
          min={1}
          placeholder="Вместимость"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          aria-invalid={Boolean(errors.capacity)}
          aria-describedby={errors.capacity ? "capacity-error" : undefined}
        />
      </Field>

      <Field label="Цена за ночь" htmlFor="price" error={errors.price}>
        <Input
          id="price"
          type="number"
          min={1}
          placeholder="Цена"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          aria-invalid={Boolean(errors.price)}
          aria-describedby={errors.price ? "price-error" : undefined}
        />
      </Field>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending
          ? "Сохранение..."
          : room
          ? "Сохранить изменения"
          : "Создать номер"}
      </Button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm text-zinc-400">
        {label}
      </label>

      {children}

      {error && (
        <p id={`${htmlFor}-error`} className="text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
