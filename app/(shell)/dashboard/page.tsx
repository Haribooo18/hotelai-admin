import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { ErrorState } from "@/components/ui/feedback/ErrorState";

import { createServerRepositoryContext } from "@/repositories/context.server";
import { createDashboardRepository } from "@/repositories/dashboard.repository.server";
import { getTenantContext } from "@/lib/tenant/context";

import type { DashboardMetrics } from "@/components/dashboard/home/dashboard-metrics";
import type { Booking } from "@/types/booking";
import type { Lead } from "@/types/lead";
import type { Room } from "@/types/room";

export default async function DashboardRoute() {
  const tenant = await getTenantContext();
  const repositoryContext = await createServerRepositoryContext(tenant);
  const dashboardRepository = createDashboardRepository(repositoryContext);

  let leads: Lead[] = [];
  let bookings: Booking[] = [];
  let rooms: Room[] = [];
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
    metrics = resolvedMetrics;
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "Unknown error";
  }

  return errorMessage || metrics == null ? (
    <div className="flex min-h-[60vh] items-center justify-center p-8">
      <ErrorState
        title="Connection error"
        description={errorMessage ?? "Unable to load dashboard data."}
        className="max-w-lg"
      />
    </div>
  ) : (
    <DashboardPage
      initialLeads={leads}
      bookings={bookings}
      rooms={rooms}
      initialMetrics={metrics}
      hotelId={tenant.hotelId}
      hotelName={tenant.hotelName}
    />
  );
}
