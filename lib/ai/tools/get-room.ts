import { createClient } from "@/lib/supabase/server";
import {
  getRoomToolInputSchema,
  getRoomToolOutputSchema,
} from "@/lib/validations/ai-tools";

import type { AITool } from "../tools";
import { toolDefinitionFromZod } from "../tools";

export const getRoomTool: AITool = {
  definition: toolDefinitionFromZod(
    "get_room",
    "Получить информацию о номере по ID или типу",
    getRoomToolInputSchema
  ),
  permission: "rooms:read",
  inputSchema: getRoomToolInputSchema,
  outputSchema: getRoomToolOutputSchema,
  async execute(ctx, args) {
    const input = getRoomToolInputSchema.parse(args);
    const supabase = await createClient();

    let query = supabase
      .from("rooms")
      .select("id, room_type, price, capacity")
      .eq("hotel_id", ctx.hotelId);

    if (input.room_id) {
      query = query.eq("id", input.room_id);
    } else if (input.room_type) {
      query = query.ilike("room_type", `%${input.room_type}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    const output = { rooms: data ?? [] };
    getRoomToolOutputSchema.parse(output);

    return {
      output,
      summary: `Найдено номеров: ${output.rooms.length}`,
    };
  },
};
