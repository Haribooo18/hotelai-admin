import { createBooking } from "@/lib/services/bookings.mutations";
import { createClient } from "@/lib/supabase/server";
import { sanitizeBookingDates } from "../date-sanitizer";
import {
  createBookingToolInputSchema,
  createBookingToolOutputSchema,
} from "@/lib/validations/ai-tools";

import type { AITool } from "../tools";
import { toolDefinitionFromZod } from "../tools";

export const createBookingTool: AITool = {
  definition: toolDefinitionFromZod(
    "create_booking",
    "Создать новое бронирование для гостя",
    createBookingToolInputSchema
  ),
  risk: "write",
  permission: "bookings:write",
  confirmationSummary: (args) =>
    `Создать бронирование для ${String(args.guest_name ?? "гостя")} с ${String(args.check_in ?? "?")} по ${String(args.check_out ?? "?")}`,
  inputSchema: createBookingToolInputSchema,
  outputSchema: createBookingToolOutputSchema,
  async execute(ctx, args) {
    const input = createBookingToolInputSchema.parse(args);
    const supabase = await createClient();

    const { data: room, error: roomError } = await supabase
      .from("rooms")
      .select("id")
      .eq("id", input.room_id)
      .eq("hotel_id", ctx.hotelId)
      .maybeSingle();

    if (roomError) throw roomError;
    if (!room) throw new Error("Номер не найден");

    // Safety net: an LLM given "15 января" with no year has been observed
    // (in the equivalent n8n workflow) to default to the current calendar
    // year instead of the nearest future one, silently producing a past
    // date. The system prompt now instructs the model correctly, but this
    // tool still never trusts that alone — the same way `create_booking`
    // writes a real reservation, not a lead a human reviews first.
    const { checkIn, checkOut, orderingValid } = sanitizeBookingDates(
      input.check_in,
      input.check_out
    );
    if (!orderingValid) {
      throw new Error(
        "Дата выезда должна быть позже даты заезда. Уточните у гостя корректные даты и попробуйте снова."
      );
    }

    const result = await createBooking({
      room_id: input.room_id,
      guest_name: input.guest_name,
      check_in: checkIn,
      check_out: checkOut,
      guest_email: input.guest_email || "",
      guest_phone: input.guest_phone || "",
    });

    const output = {
      booking_id: result.id,
      total_price: result.total_price,
    };
    createBookingToolOutputSchema.parse(output);

    return {
      output,
      summary: `Бронирование создано для ${input.guest_name}`,
    };
  },
};
