import { AppShell } from "@/components/dashboard/AppShell";
import { DashboardPage } from "@/components/dashboard/DashboardPage";

import { getLeads } from "@/lib/services/leads.service";
import { getCurrentHotel } from "@/lib/tenant";

import type { Lead } from "@/types/lead";

export default async function Home() {
  const hotel = await getCurrentHotel();

  let leads: Lead[] = [];
  let errorMessage: string | null = null;

  try {
    leads = await getLeads(50);
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "Неизвестная ошибка";
  }

  return (
    <AppShell hotel={hotel}>
      {errorMessage ? (
        <div className="rounded-xl border border-red-800 bg-red-950/40 p-6">
          <h1 className="text-2xl font-bold text-red-400">
            Ошибка подключения
          </h1>

          <pre className="mt-4 rounded-lg bg-black/30 p-4 text-sm text-red-200">
            {errorMessage}
          </pre>
        </div>
      ) : (
        <DashboardPage initialLeads={leads} hotelId={hotel.id} />
      )}
    </AppShell>
  );
}
