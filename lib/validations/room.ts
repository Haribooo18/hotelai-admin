import { z } from "zod";

const roomFields = {
  room_type: z.string().trim().min(1, "Введите тип номера"),
  capacity: z.coerce
    .number()
    .int("Вместимость должна быть целым числом")
    .min(1, "Вместимость должна быть больше 0"),
  price: z.coerce.number().min(0.01, "Цена должна быть больше 0"),
};

export const roomCreateSchema = z.object(roomFields);

export const roomUpdateSchema = z.object({
  id: z.string().min(1),
  ...roomFields,
});

export type RoomCreateInput = z.infer<typeof roomCreateSchema>;
export type RoomUpdateInput = z.infer<typeof roomUpdateSchema>;
