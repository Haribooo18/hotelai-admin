import { AiPage } from "@/components/marketing/ai/AiPage";
import { createClient } from "@/lib/supabase/server";

import { DashboardAiInboxPage } from "./dashboard-inbox-page";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AiRoutePage({ searchParams }: Props) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <AiPage />;
  }

  return <DashboardAiInboxPage searchParams={searchParams} />;
}
