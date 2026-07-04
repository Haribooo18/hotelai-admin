import { NextResponse } from "next/server";

import { getAIHealthStatus } from "@/lib/services/ai-settings.service";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const health = await getAIHealthStatus();
  return NextResponse.json(health);
}
