import { createClient } from "@/lib/supabase/server";
import {
  cancelBookingToolInputSchema,
  cancelBookingToolOutputSchema,
} from "@/lib/validations/ai-tools";

import type { AITool } from "../tools";
import { toolDefinitionFromZod } from "../tools";

export const cancelBookingTool: AITool = {
  definition: toolDefinitionFromZod(
    "cancel_booking",
    "Отменить бронирование",
    cancelBookingToolInputSchema
  ),
  risk: "destructive",
  permission: "bookings:write",
  confirmationSummary: (args) =>
    `Отменить бронирование ${String(args.booking_id ?? "")}`,
  inputSchema: cancelBookingToolInputSchema,
  outputSchema: cancelBookingToolOutputSchema,
  async execute(ctx, args) {
    const input = cancelBookingToolInputSchema.parse(args);
    const supabase = await createClient();

    const { data: existing, error: readError } = await supabase
      .from("bookings")
      .select("id")
      .eq("id", input.booking_id)
      .eq("hotel_id", ctx.hotelId)
      .maybeSingle();

    if (readError) throw readError;
    if (!existing) throw new Error("Бронирование не найдено");

    const { error } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", input.booking_id)
      .eq("hotel_id", ctx.hotelId);

    if (error) throw error;

    const output = { booking_id: input.booking_id, cancelled: true };
    cancelBookingToolOutputSchema.parse(output);

    return {
      output,
      summary: input.reason
        ? `Бронирование отменено: ${input.reason}`
        : "Бронирование отменено",
    };
  },
};
