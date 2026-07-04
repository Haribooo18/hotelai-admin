import { updateBooking } from "@/lib/services/bookings.mutations";
import { getBooking } from "@/lib/services/bookings.service";
import {
  updateBookingToolInputSchema,
  updateBookingToolOutputSchema,
} from "@/lib/validations/ai-tools";

import type { AITool } from "../tools";
import { toolDefinitionFromZod } from "../tools";

export const updateBookingTool: AITool = {
  definition: toolDefinitionFromZod(
    "update_booking",
    "Обновить существующее бронирование",
    updateBookingToolInputSchema
  ),
  permission: "bookings:write",
  inputSchema: updateBookingToolInputSchema,
  outputSchema: updateBookingToolOutputSchema,
  async execute(ctx, args) {
    const input = updateBookingToolInputSchema.parse(args);

    const existing = await getBooking(input.booking_id);
    if (!existing || existing.hotel_id !== ctx.hotelId) {
      throw new Error("Бронирование не найдено");
    }

    if (input.status === "cancelled") {
      throw new Error("Для отмены используйте инструмент cancel_booking");
    }

    await updateBooking({
      id: input.booking_id,
      guest_name: input.guest_name ?? existing.guest_name,
      guest_email: existing.guest_email ?? "",
      guest_phone: existing.guest_phone ?? "",
      room_id: existing.room_id,
      check_in: input.check_in ?? existing.check_in,
      check_out: input.check_out ?? existing.check_out,
    });

    const output = { booking_id: input.booking_id, updated: true };
    updateBookingToolOutputSchema.parse(output);

    return {
      output,
      summary: "Бронирование обновлено",
    };
  },
};
