import { createClient } from "@/lib/supabase/server";
import {
  checkAvailabilityInputSchema,
  checkAvailabilityOutputSchema,
} from "@/lib/validations/ai-tools";

import type { AITool } from "../tools";
import { toolDefinitionFromZod } from "../tools";

export const checkAvailabilityTool: AITool = {
  definition: toolDefinitionFromZod(
    "check_availability",
    "Проверить доступность номера на указанные даты заезда и выезда",
    checkAvailabilityInputSchema
  ),
  permission: "bookings:read",
  inputSchema: checkAvailabilityInputSchema,
  outputSchema: checkAvailabilityOutputSchema,
  async execute(ctx, args) {
    const input = checkAvailabilityInputSchema.parse(args);
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("bookings")
      .select("id, guest_name, check_in, check_out")
      .eq("hotel_id", ctx.hotelId)
      .eq("room_id", input.room_id)
      .neq("status", "cancelled");

    if (error) {
      throw new Error(`Ошибка проверки доступности: ${error.message}`);
    }

    const start = new Date(input.check_in).getTime();
    const end = new Date(input.check_out).getTime();

    const conflicts = (data ?? []).filter((booking) => {
      const existingStart = new Date(booking.check_in).getTime();
      const existingEnd = new Date(booking.check_out).getTime();
      return start < existingEnd && end > existingStart;
    });

    const output = {
      available: conflicts.length === 0,
      conflicts,
    };

    checkAvailabilityOutputSchema.parse(output);

    return {
      output,
      summary: conflicts.length === 0
        ? "Номер свободен на выбранные даты"
        : `Найдено конфликтов: ${conflicts.length}`,
    };
  },
};
