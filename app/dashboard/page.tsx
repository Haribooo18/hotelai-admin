import { AppShell } from "@/components/dashboard/AppShell";
import { DashboardPage } from "@/components/dashboard/DashboardPage";

import { createServerRepositoryContext } from "@/repositories/context.server";
import { createDashboardRepository } from "@/repositories/dashboard.repository.server";
import { getTenantContext } from "@/lib/tenant/context";

import type { DashboardMetrics } from "@/components/dashboard/home/dashboard-metrics";
import type { Booking } from "@/types/booking";
import type { Guest } from "@/types/guest";
import type { Lead } from "@/types/lead";
import type { Room } from "@/types/room";

export default async function DashboardRoute() {
  const tenant = await getTenantContext();
  const repositoryContext = await createServerRepositoryContext(tenant);
  const dashboardRepository = createDashboardRepository(repositoryContext);

  let leads: Lead[] = [];
  let bookings: Booking[] = [];
  let rooms: Room[] = [];
  let guests: Guest[] = [];
  let metrics: DashboardMetrics | null = null;
  let errorMessage: string | null = null;

  try {
    const dataPromise = dashboardRepository.load();
    const [data, resolvedMetrics] = await Promise.all([
      dataPromise,
      dashboardRepository.getMetrics(dataPromise),
    ]);

    leads = data.leads;
    bookings = data.bookings;
    rooms = data.rooms;
    guests = data.guests;
    metrics = resolvedMetrics;
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "Unknown error";
  }

  return (
    <AppShell
      hotel={{ id: tenant.hotelId, name: tenant.hotelName }}
      userEmail={tenant.userEmail}
    >
      {errorMessage || metrics == null ? (
        <div className="rounded-[var(--ds-radius)] border border-red-800 bg-red-950/40 p-6">
          <h1 className="text-2xl font-bold text-red-400">Connection error</h1>

          <pre className="mt-4 rounded-lg bg-black/30 p-4 text-sm text-red-200">
            {errorMessage}
          </pre>
        </div>
      ) : (
        <DashboardPage
          initialLeads={leads}
          bookings={bookings}
          rooms={rooms}
          guests={guests}
          initialMetrics={metrics}
          hotelId={tenant.hotelId}
        />
      )}
    </AppShell>
  );
}
