import { supabase } from "@/lib/supabase";

import { AppShell } from "@/components/dashboard/AppShell";
import {
  DashboardPage,
  Lead,
} from "@/components/dashboard/DashboardPage";

type Props = {
  searchParams?: Promise<Record<string, string>>;
};

export default async function Home({}: Props) {
  const { data, error } = await supabase.rpc("list_hotel_leads", {
    p_hotel_id: "hotel_aurora",
    p_limit: 50,
  });

  if (error) {
    return (
      <AppShell>
        <div className="rounded-xl border border-red-800 bg-red-950/40 p-6">
          <h1 className="text-2xl font-bold text-red-400">
            Ошибка подключения
          </h1>

          <pre className="mt-4 rounded-lg bg-black/30 p-4 text-sm text-red-200">
            {error.message}
          </pre>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <DashboardPage initialLeads={(data ?? []) as Lead[]} />
    </AppShell>
  );
}