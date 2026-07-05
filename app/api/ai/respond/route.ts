import { NextResponse } from "next/server";

import { generateAIResponse } from "@/lib/services/ai-completion.service";
import { aiRespondSchema } from "@/lib/validations/ai-settings";
import { bindApiContext, runApiRoute } from "@/lib/ops/api-route";
import { AuthenticationError, ValidationError } from "@/lib/ops/errors";
import { createClient } from "@/lib/supabase/server";
import { getCurrentHotelId } from "@/lib/tenant";

export async function POST(request: Request) {
  return runApiRoute(
    request,
    {
      module: "api.ai",
      operation: "respond",
      endpoint: "/api/ai/respond",
      gracefulAiFailure: true,
    },
    async () => {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new AuthenticationError();
      }

      const hotelId = await getCurrentHotelId();
      bindApiContext({ userId: user.id, hotelId });

      let body: unknown;
      try {
        body = await request.json();
      } catch {
        throw new ValidationError("Некорректный JSON");
      }

      const parsed = aiRespondSchema.safeParse(body);
      if (!parsed.success) {
        throw new ValidationError(
          parsed.error.issues[0]?.message ?? "Некорректные данные"
        );
      }

      bindApiContext({ conversationId: parsed.data.conversation_id, provider: "openai" });

      const result = await generateAIResponse(parsed.data.conversation_id);
      return NextResponse.json(result);
    }
  );
}
