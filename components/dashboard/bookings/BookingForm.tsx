"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { Booking } from "@/types/booking";

import {
  createBooking,
  updateBooking,
} from "@/lib/services/bookings.mutations";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type RoomOption = {
  id: string;
  room_type: string;
  price: number;
};

type Props = {
  rooms: RoomOption[];
  booking?: Booking;
  onSuccess?: () => void;
};

export function BookingForm({
  rooms,
  booking,
  onSuccess,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [guestName, setGuestName] = useState(
    booking?.guest_name ?? ""
  );

  const [email, setEmail] = useState(
    booking?.guest_email ?? ""
  );

  const [phone, setPhone] = useState(
    booking?.guest_phone ?? ""
  );

  const [roomId, setRoomId] = useState(
    booking?.room_id ?? ""
  );

  const [checkIn, setCheckIn] = useState(
    booking?.check_in ?? ""
  );

  const [checkOut, setCheckOut] = useState(
    booking?.check_out ?? ""
  );

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    startTransition(async () => {
      try {
        if (booking) {
          await updateBooking({
            id: booking.id,
            guest_name: guestName,
            guest_email: email,
            guest_phone: phone,
            room_id: roomId,
            check_in: checkIn,
            check_out: checkOut,
          });

          toast.success(
            "Бронирование обновлено"
          );
        } else {
          await createBooking({
            guest_name: guestName,
            guest_email: email,
            guest_phone: phone,
            room_id: roomId,
            check_in: checkIn,
            check_out: checkOut,
          });

          toast.success(
            "Бронирование создано"
          );

          setGuestName("");
          setEmail("");
          setPhone("");
          setRoomId("");
          setCheckIn("");
          setCheckOut("");
        }

        router.refresh();

        onSuccess?.();
      } catch (error) {
        console.error(error);

        toast.error(
          booking
            ? "Ошибка обновления"
            : "Ошибка создания"
        );
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <Input
        placeholder="Имя гостя"
        value={guestName}
        onChange={(e) =>
          setGuestName(e.target.value)
        }
        required
      />

      <Input
        placeholder="Email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <Input
        placeholder="Телефон"
        value={phone}
        onChange={(e) =>
          setPhone(e.target.value)
        }
      />

      <Select
        value={roomId}
        onChange={setRoomId}
        placeholder="Выберите номер"
        options={rooms.map((room) => ({
          value: room.id,
          label: `${room.room_type} — $${room.price}`,
        }))}
      />

      <Input
        type="date"
        value={checkIn}
        onChange={(e) =>
          setCheckIn(e.target.value)
        }
        required
      />

      <Input
        type="date"
        value={checkOut}
        onChange={(e) =>
          setCheckOut(e.target.value)
        }
        required
      />

      <Button
        type="submit"
        className="w-full"
        disabled={pending}
      >
        {pending
          ? booking
            ? "Сохранение..."
            : "Создание..."
          : booking
          ? "Сохранить изменения"
          : "Создать бронирование"}
      </Button>
    </form>
  );
}