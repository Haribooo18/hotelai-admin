"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { Booking } from "@/types/booking";
import type { Room } from "@/types/room";

import {
  createBooking,
  updateBooking,
} from "@/lib/services/bookings.mutations";
import {
  bookingCreateSchema,
  bookingUpdateSchema,
} from "@/lib/validations/booking";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type Props = {
  rooms: Room[];
  booking?: Booking;
  onSuccess?: () => void;
};

type FieldErrors = Partial<
  Record<
    "guest_name" | "guest_email" | "guest_phone" | "room_id" | "check_in" | "check_out",
    string
  >
>;

export function BookingForm({ rooms, booking, onSuccess }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [guestName, setGuestName] = useState(booking?.guest_name ?? "");
  const [email, setEmail] = useState(booking?.guest_email ?? "");
  const [phone, setPhone] = useState(booking?.guest_phone ?? "");
  const [roomId, setRoomId] = useState(booking?.room_id ?? "");
  const [checkIn, setCheckIn] = useState(booking?.check_in ?? "");
  const [checkOut, setCheckOut] = useState(booking?.check_out ?? "");
  const [errors, setErrors] = useState<FieldErrors>({});

  function resetForm() {
    setGuestName("");
    setEmail("");
    setPhone("");
    setRoomId("");
    setCheckIn("");
    setCheckOut("");
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const raw = {
      guest_name: guestName,
      guest_email: email,
      guest_phone: phone,
      room_id: roomId,
      check_in: checkIn,
      check_out: checkOut,
    };

    const parsed = booking
      ? bookingUpdateSchema.safeParse({ ...raw, id: booking.id })
      : bookingCreateSchema.safeParse(raw);

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
        if (booking) {
          await updateBooking({ ...parsed.data, id: booking.id });
          toast.success("Reservation updated");
        } else {
          await createBooking(parsed.data);
          toast.success("Reservation created");
          resetForm();
        }

        router.refresh();
        onSuccess?.();
      } catch (error) {
        console.error(error);
        toast.error(
          error instanceof Error
            ? error.message
            : booking
            ? "Update failed"
            : "Create failed"
        );
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <Field label="Guest name" htmlFor="guest_name" error={errors.guest_name}>
        <Input
          id="guest_name"
          placeholder="Guest name"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          aria-invalid={Boolean(errors.guest_name)}
          aria-describedby={errors.guest_name ? "guest_name-error" : undefined}
        />
      </Field>

      <Field label="Email" htmlFor="guest_email" error={errors.guest_email}>
        <Input
          id="guest_email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={Boolean(errors.guest_email)}
          aria-describedby={errors.guest_email ? "guest_email-error" : undefined}
        />
      </Field>

      <Field label="Phone" htmlFor="guest_phone" error={errors.guest_phone}>
        <Input
          id="guest_phone"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </Field>

      <Field label="Room" htmlFor="room_id" error={errors.room_id}>
        <Select
          id="room_id"
          value={roomId}
          onChange={setRoomId}
          placeholder="Select room"
          aria-label="Room"
          aria-invalid={Boolean(errors.room_id)}
          aria-describedby={errors.room_id ? "room_id-error" : undefined}
          options={rooms.map((room) => ({
            value: room.id,
            label: `${room.room_type} — $${room.price}`,
          }))}
        />
      </Field>

      <Field label="Check-in" htmlFor="check_in" error={errors.check_in}>
        <Input
          id="check_in"
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          aria-invalid={Boolean(errors.check_in)}
          aria-describedby={errors.check_in ? "check_in-error" : undefined}
        />
      </Field>

      <Field label="Check-out" htmlFor="check_out" error={errors.check_out}>
        <Input
          id="check_out"
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          aria-invalid={Boolean(errors.check_out)}
          aria-describedby={errors.check_out ? "check_out-error" : undefined}
        />
      </Field>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending
          ? booking
            ? "Saving..."
            : "Creating..."
          : booking
          ? "Save changes"
          : "Create reservation"}
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
