import { createClient } from "@/lib/supabase/server";
import {
  getGuestToolInputSchema,
  getGuestToolOutputSchema,
} from "@/lib/validations/ai-tools";

import type { AITool } from "../tools";
import { toolDefinitionFromZod } from "../tools";

export const getGuestTool: AITool = {
  definition: toolDefinitionFromZod(
    "get_guest",
    "Получить информацию о госте по ID, email или телефону",
    getGuestToolInputSchema
  ),
  permission: "guests:read",
  inputSchema: getGuestToolInputSchema,
  outputSchema: getGuestToolOutputSchema,
  async execute(ctx, args) {
    const input = getGuestToolInputSchema.parse(args);
    const supabase = await createClient();

    let query = supabase
      .from("guests")
      .select("id, first_name, last_name, email, phone, is_vip, tags")
      .eq("hotel_id", ctx.hotelId)
      .is("deleted_at", null);

    if (input.guest_id) {
      query = query.eq("id", input.guest_id);
    } else if (input.email) {
      query = query.eq("email", input.email);
    } else if (input.phone) {
      query = query.eq("phone", input.phone);
    }

    const { data, error } = await query.maybeSingle();

    if (error) throw error;

    const output = {
      guest: data
        ? {
            id: data.id,
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            phone: data.phone,
            is_vip: data.is_vip,
            tags: data.tags ?? [],
          }
        : null,
    };

    getGuestToolOutputSchema.parse(output);

    return {
      output,
      summary: data
        ? `Гость: ${data.first_name} ${data.last_name}`
        : "Гость не найден",
    };
  },
};
