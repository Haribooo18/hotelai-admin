import { requestAIHumanHandoff } from "@/lib/services/ai-handoff.service";
import { createClient } from "@/lib/supabase/server";
import {
  requestHumanHandoffInputSchema,
  requestHumanHandoffOutputSchema,
} from "@/lib/validations/ai-tools";

import type { AITool } from "../tools";
import { toolDefinitionFromZod } from "../tools";

export const requestHumanHandoffTool: AITool = {
  definition: toolDefinitionFromZod(
    "request_human_handoff",
    "Передать диалог сотруднику отеля, когда гость просит человека, AI не может безопасно помочь или ситуация требует участия персонала",
    requestHumanHandoffInputSchema,
  ),
  risk: "system",
  permission: "conversations:handoff",
  inputSchema: requestHumanHandoffInputSchema,
  outputSchema: requestHumanHandoffOutputSchema,
  async execute(ctx, args) {
    const input = requestHumanHandoffInputSchema.parse(args);
    const supabase = await createClient();
    const result = await requestAIHumanHandoff(supabase, {
      hotelId: ctx.hotelId,
      conversationId: ctx.conversationId,
      reason: input.reason,
      urgency: input.urgency,
      guestMessage: input.guest_message,
    });

    const output = {
      handoff_requested: true as const,
      conversation_id: result.conversation_id,
      status: "handoff_requested" as const,
      priority: result.priority,
    };
    requestHumanHandoffOutputSchema.parse(output);

    return {
      output,
      summary: result.already_requested
        ? "Диалог уже находится у сотрудника отеля"
        : "Диалог передан сотруднику отеля",
    };
  },
};
