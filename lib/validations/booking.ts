import { z } from "zod";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const optionalEmail = z
  .string()
  .trim()
  .refine((v) => v === "" || EMAIL_RE.test(v), {
    message: "Некорректный email",
  });

const bookingFields = {
  guest_name: z.string().trim().min(1, "Введите имя гостя"),
  guest_email: optionalEmail.default(""),
  guest_phone: z.string().trim().default(""),
  room_id: z.string().min(1, "Выберите номер"),
  check_in: z.string().min(1, "Укажите дату заезда"),
  check_out: z.string().min(1, "Укажите дату выезда"),
};

const laterCheckout = (value: { check_in: string; check_out: string }) =>
  new Date(value.check_out) > new Date(value.check_in);

const laterCheckoutError = {
  message: "Дата выезда должна быть позже даты заезда",
  path: ["check_out"] as string[],
};

export const bookingCreateSchema = z
  .object(bookingFields)
  .refine(laterCheckout, laterCheckoutError);

export const bookingUpdateSchema = z
  .object({ id: z.string().min(1), ...bookingFields })
  .refine(laterCheckout, laterCheckoutError);

/** Minimal payload for calendar drag / resize (dates + room only). */
export const bookingRescheduleSchema = z
  .object({
    id: z.string().min(1),
    room_id: z.string().min(1, "Выберите номер"),
    check_in: z.string().min(1, "Укажите дату заезда"),
    check_out: z.string().min(1, "Укажите дату выезда"),
  })
  .refine(laterCheckout, laterCheckoutError);

export type BookingCreateInput = z.infer<typeof bookingCreateSchema>;
export type BookingUpdateInput = z.infer<typeof bookingUpdateSchema>;
export type BookingRescheduleInput = z.infer<typeof bookingRescheduleSchema>;
