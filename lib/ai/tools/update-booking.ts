import { updateBooking } from "@/lib/services/bookings.mutations";
import { getBooking } from "@/lib/services/bookings.service";
import { sanitizeBookingDates } from "../date-sanitizer";
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
  risk: "write",
  permission: "bookings:write",
  confirmationSummary: (args) =>
    `Изменить бронирование ${String(args.booking_id ?? "")}`,
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

    // Same safety net as create_booking: sanitize whichever date(s) are
    // actually changing before writing. Falling back to `existing.*` for
    // an untouched field means we only need to re-check ordering here, not
    // re-sanitize a date the guest never mentioned this turn.
    const nextCheckIn = input.check_in ?? existing.check_in;
    const nextCheckOut = input.check_out ?? existing.check_out;
    const { checkIn, checkOut, orderingValid } = sanitizeBookingDates(
      nextCheckIn,
      nextCheckOut
    );
    if (!orderingValid) {
      throw new Error(
        "Дата выезда должна быть позже даты заезда. Уточните у гостя корректные даты и попробуйте снова."
      );
    }

    await updateBooking({
      id: input.booking_id,
      guest_name: input.guest_name ?? existing.guest_name,
      guest_email: existing.guest_email ?? "",
      guest_phone: existing.guest_phone ?? "",
      room_id: existing.room_id,
      check_in: checkIn,
      check_out: checkOut,
    });

    const output = { booking_id: input.booking_id, updated: true };
    updateBookingToolOutputSchema.parse(output);

    return {
      output,
      summary: "Бронирование обновлено",
    };
  },
};
