import { createBooking } from "@/lib/services/bookings.mutations";
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
  permission: "bookings:write",
  inputSchema: createBookingToolInputSchema,
  outputSchema: createBookingToolOutputSchema,
  async execute(_ctx, args) {
    const input = createBookingToolInputSchema.parse(args);

    const result = await createBooking({
      room_id: input.room_id,
      guest_name: input.guest_name,
      check_in: input.check_in,
      check_out: input.check_out,
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
