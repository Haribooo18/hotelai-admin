import { NextResponse } from "next/server";

import { getPlatformHealth } from "@/lib/ops/health";
import { bindApiContext, runApiRoute } from "@/lib/ops/api-route";
import { AuthenticationError } from "@/lib/ops/errors";
import { getAIHealthStatus } from "@/lib/services/ai-settings.service";
import { createClient } from "@/lib/supabase/server";
import { getCurrentHotelId } from "@/lib/tenant";

export async function GET(request: Request) {
  return runApiRoute(
    request,
    {
      module: "api.ai",
      operation: "health",
      endpoint: "/api/ai/health",
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

      const aiHealth = await getAIHealthStatus().catch(() => null);

      return NextResponse.json(getPlatformHealth(aiHealth));
    }
  );
}
