"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/toast";

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
import { FormField } from "@/components/ui/core/FormField";
import { ToolbarDateInput } from "@/components/ui/core/ToolbarDateInput";
import { formStackClass, inputClass } from "@/lib/dashboard/design-system";
import { localizeErrorWithT, useI18n } from "@/lib/i18n";

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
  const { t } = useI18n();
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
          toast.success(t("bookings.updated"));
        } else {
          await createBooking(parsed.data);
          toast.success(t("bookings.created"));
          resetForm();
        }

        router.refresh();
        onSuccess?.();
      } catch (error) {
        console.error(error);
        toast.error(
          localizeErrorWithT(
            t,
            error instanceof Error
              ? error.message
              : booking
                ? t("bookings.updateFailed")
                : t("bookings.createFailed")
          )
        );
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className={formStackClass} noValidate>
      <FormField label={t("bookings.formGuestName")} htmlFor="guest_name" error={errors.guest_name}>
        <Input
          id="guest_name"
          placeholder={t("bookings.formGuestNamePlaceholder")}
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          aria-invalid={Boolean(errors.guest_name)}
          aria-describedby={errors.guest_name ? "guest_name-error" : undefined}
        />
      </FormField>

      <FormField label={t("bookings.formEmail")} htmlFor="guest_email" error={errors.guest_email}>
        <Input
          id="guest_email"
          type="email"
          placeholder={t("bookings.formEmailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={Boolean(errors.guest_email)}
          aria-describedby={errors.guest_email ? "guest_email-error" : undefined}
        />
      </FormField>

      <FormField label={t("bookings.formPhone")} htmlFor="guest_phone" error={errors.guest_phone}>
        <Input
          id="guest_phone"
          placeholder={t("bookings.formPhonePlaceholder")}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </FormField>

      <FormField label={t("bookings.formRoom")} htmlFor="room_id" error={errors.room_id}>
        <Select
          id="room_id"
          value={roomId}
          onChange={setRoomId}
          placeholder={t("bookings.formSelectRoom")}
          aria-label={t("bookings.formRoom")}
          aria-invalid={Boolean(errors.room_id)}
          aria-describedby={errors.room_id ? "room_id-error" : undefined}
          options={rooms.map((room) => ({
            value: room.id,
            label: `${room.room_type} — $${room.price}`,
          }))}
        />
      </FormField>

      <FormField label={t("bookings.formCheckIn")} htmlFor="check_in" error={errors.check_in}>
        <ToolbarDateInput
          id="check_in"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          aria-invalid={Boolean(errors.check_in)}
          aria-describedby={errors.check_in ? "check_in-error" : undefined}
          className={inputClass}
          required
        />
      </FormField>

      <FormField label={t("bookings.formCheckOut")} htmlFor="check_out" error={errors.check_out}>
        <ToolbarDateInput
          id="check_out"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          aria-invalid={Boolean(errors.check_out)}
          aria-describedby={errors.check_out ? "check_out-error" : undefined}
          className={inputClass}
          required
        />
      </FormField>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending
          ? booking
            ? t("bookings.formSaving")
            : t("bookings.formCreating")
          : booking
            ? t("bookings.formSaveChanges")
            : t("bookings.formCreateReservation")}
      </Button>
    </form>
  );
}
