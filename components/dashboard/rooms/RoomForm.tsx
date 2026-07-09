"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/toast";

import { createRoom, updateRoom } from "@/lib/services/rooms.mutations";
import {
  roomCreateSchema,
  roomUpdateSchema,
} from "@/lib/validations/room";
import { localizeErrorWithT, useI18n } from "@/lib/i18n";

import type { Room } from "@/types/room";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/core/FormField";
import { formStackClass } from "@/lib/dashboard/design-system";

type Props = {
  room?: Room;
  template?: Pick<Room, "room_type" | "capacity" | "price">;
  onSuccess?: () => void;
};

type FieldErrors = Partial<
  Record<"room_type" | "capacity" | "price", string>
>;

export function RoomForm({ room, template, onSuccess }: Props) {
  const { t } = useI18n();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [roomType, setRoomType] = useState(
    room?.room_type ?? template?.room_type ?? ""
  );
  const [capacity, setCapacity] = useState(
    String(room?.capacity ?? template?.capacity ?? 2)
  );
  const [price, setPrice] = useState(
    String(room?.price ?? template?.price ?? 100)
  );
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
          toast.success(t("rooms.updated"));
        } else {
          await createRoom(parsed.data);
          toast.success(t("rooms.created"));
        }

        router.refresh();
        onSuccess?.();
      } catch (error) {
        console.error(error);
        toast.error(
          localizeErrorWithT(
            t,
            error instanceof Error ? error.message : t("rooms.saveFailed")
          )
        );
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className={formStackClass} noValidate>
      <FormField
        label={t("rooms.formRoomType")}
        htmlFor="room_type"
        error={errors.room_type}
      >
        <Input
          id="room_type"
          placeholder={t("rooms.formRoomTypePlaceholder")}
          value={roomType}
          onChange={(e) => setRoomType(e.target.value)}
          aria-invalid={Boolean(errors.room_type)}
          aria-describedby={errors.room_type ? "room_type-error" : undefined}
        />
      </FormField>

      <FormField
        label={t("rooms.formCapacity")}
        htmlFor="capacity"
        error={errors.capacity}
      >
        <Input
          id="capacity"
          type="number"
          min={1}
          placeholder={t("rooms.formCapacityPlaceholder")}
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          aria-invalid={Boolean(errors.capacity)}
          aria-describedby={errors.capacity ? "capacity-error" : undefined}
        />
      </FormField>

      <FormField
        label={t("rooms.formPricePerNight")}
        htmlFor="price"
        error={errors.price}
      >
        <Input
          id="price"
          type="number"
          min={1}
          placeholder={t("rooms.formPricePlaceholder")}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          aria-invalid={Boolean(errors.price)}
          aria-describedby={errors.price ? "price-error" : undefined}
        />
      </FormField>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending
          ? t("common.saving")
          : room
            ? t("rooms.formSaveChanges")
            : t("rooms.formCreateRoom")}
      </Button>
    </form>
  );
}
