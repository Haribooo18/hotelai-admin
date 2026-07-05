import { AppShell } from "@/components/dashboard/AppShell";
import { DashboardPage } from "@/components/dashboard/DashboardPage";

import { createBookingsRepository } from "@/repositories/bookings.repository.server";
import { createGuestsRepository } from "@/repositories/guests.repository.server";
import { createLeadsRepository } from "@/repositories/leads.repository.server";
import { createRoomsRepository } from "@/repositories/rooms.repository.server";
import { createServerRepositoryContext } from "@/repositories/context.server";
import { getTenantContext } from "@/lib/tenant/context";

import type { Booking } from "@/types/booking";
import type { Guest } from "@/types/guest";
import type { Lead } from "@/types/lead";
import type { Room } from "@/types/room";

export default async function DashboardRoute() {
  const tenant = await getTenantContext();
  const repositoryContext = await createServerRepositoryContext(tenant);

  let leads: Lead[] = [];
  let bookings: Booking[] = [];
  let rooms: Room[] = [];
  let guests: Guest[] = [];
  let errorMessage: string | null = null;

  try {
    [leads, bookings, rooms, guests] = await Promise.all([
      createLeadsRepository(repositoryContext).getAll(50),
      createBookingsRepository(repositoryContext).getAll(),
      createRoomsRepository(repositoryContext).getAll(),
      createGuestsRepository(repositoryContext).getAll(),
    ]);
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "Unknown error";
  }

  return (
    <AppShell
      hotel={{ id: tenant.hotelId, name: tenant.hotelName }}
      userEmail={tenant.userEmail}
    >
      {errorMessage ? (
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
          hotelId={tenant.hotelId}
        />
      )}
    </AppShell>
  );
}
