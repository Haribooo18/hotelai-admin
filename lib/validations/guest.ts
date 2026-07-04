import { z } from "zod";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const optionalEmail = z
  .string()
  .trim()
  .refine((v) => v === "" || EMAIL_RE.test(v), {
    message: "Некорректный email",
  })
  .default("");

const guestFields = {
  first_name: z.string().trim().min(1, "Введите имя"),
  last_name: z.string().trim().min(1, "Введите фамилию"),
  email: optionalEmail,
  phone: z.string().trim().default(""),
  country: z.string().trim().default(""),
  city: z.string().trim().default(""),
  notes: z.string().trim().default(""),
  avatar_url: z.string().trim().default(""),
  tags: z.array(z.string().trim().min(1)).default([]),
  is_vip: z.boolean().default(false),
  is_favorite: z.boolean().default(false),
};

export const guestCreateSchema = z.object(guestFields);

export const guestUpdateSchema = z.object({
  id: z.string().min(1),
  ...guestFields,
});

export type GuestCreateInput = z.infer<typeof guestCreateSchema>;
export type GuestUpdateInput = z.infer<typeof guestUpdateSchema>;
