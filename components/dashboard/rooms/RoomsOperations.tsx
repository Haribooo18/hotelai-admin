import type { Booking } from "@/types/booking";

import {
  DashboardGlassPanel,
  DashboardPanelHeader,
} from "@/components/dashboard/home/DashboardPrimitives";

import {
  formatRoomCurrency,
  formatRoomDate,
  type RoomOperationsSnapshot,
} from "./room-ops-metrics";

type Props = {
  snapshot: RoomOperationsSnapshot;
};

export function RoomsOperations({ snapshot }: Props) {
  return (
    <div className="space-y-3">
      <DashboardPanelHeader
        title="Operations"
        subtitle="Housekeeping, maintenance, and daily flow"
      />

      <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
        <QueueWidget
          title="Housekeeping queue"
          items={snapshot.housekeepingQueue.map((model) => ({
            id: model.room.id,
            primary: `Room ${model.roomCode}`,
            secondary: model.housekeepingLabel,
          }))}
          empty="All rooms serviced"
        />
        <QueueWidget
          title="Maintenance queue"
          items={snapshot.maintenanceQueue.map((model) => ({
            id: model.room.id,
            primary: `Room ${model.roomCode}`,
            secondary: model.room.room_type,
          }))}
          empty="No maintenance tickets"
        />
        <BookingWidget
          title="Arrivals"
          bookings={snapshot.arrivals}
          empty="No arrivals today"
        />
        <BookingWidget
          title="Departures"
          bookings={snapshot.departures}
          empty="No departures today"
        />
        <QueueWidget
          title="Vacant ready"
          items={snapshot.vacantReady.map((model) => ({
            id: model.room.id,
            primary: `Room ${model.roomCode}`,
            secondary: model.room.room_type,
          }))}
          empty="No vacant-ready rooms"
        />
        <OccupancyWidget snapshot={snapshot} />
      </div>
    </div>
  );
}

function QueueWidget({
  title,
  items,
  empty,
}: {
  title: string;
  items: Array<{ id: string; primary: string; secondary: string }>;
  empty: string;
}) {
  return (
    <DashboardGlassPanel className="p-4">
      <p className="text-[13px] font-semibold text-[var(--shell-text)]">{title}</p>
      {items.length === 0 ? (
        <p className="mt-3 text-[12px] text-[var(--shell-muted)]">{empty}</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {items.slice(0, 5).map((item) => (
            <li
              key={item.id}
              className="rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/70 px-3 py-2"
            >
              <p className="text-[12px] font-medium text-[var(--shell-text)]">
                {item.primary}
              </p>
              <p className="text-[11px] text-[var(--shell-muted)]">{item.secondary}</p>
            </li>
          ))}
        </ul>
      )}
    </DashboardGlassPanel>
  );
}

function BookingWidget({
  title,
  bookings,
  empty,
}: {
  title: string;
  bookings: Booking[];
  empty: string;
}) {
  return (
    <DashboardGlassPanel className="p-4">
      <p className="text-[13px] font-semibold text-[var(--shell-text)]">{title}</p>
      {bookings.length === 0 ? (
        <p className="mt-3 text-[12px] text-[var(--shell-muted)]">{empty}</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {bookings.slice(0, 5).map((booking) => (
            <li
              key={booking.id}
              className="rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/70 px-3 py-2"
            >
              <p className="text-[12px] font-medium text-[var(--shell-text)]">
                {booking.guest_name}
              </p>
              <p className="text-[11px] text-[var(--shell-muted)]">
                {formatRoomDate(booking.check_in)} · {formatRoomCurrency(Number(booking.total_price))}
              </p>
            </li>
          ))}
        </ul>
      )}
    </DashboardGlassPanel>
  );
}

function OccupancyWidget({ snapshot }: { snapshot: RoomOperationsSnapshot }) {
  return (
    <DashboardGlassPanel className="p-4">
      <p className="text-[13px] font-semibold text-[var(--shell-text)]">
        Occupancy by room type
      </p>
      {snapshot.occupancyByType.length === 0 ? (
        <p className="mt-3 text-[12px] text-[var(--shell-muted)]">No room types</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {snapshot.occupancyByType.map((item) => {
            const percent =
              item.total > 0 ? Math.round((item.occupied / item.total) * 100) : 0;

            return (
              <li key={item.label}>
                <div className="mb-1 flex items-center justify-between text-[11px]">
                  <span className="text-[var(--shell-text)]">{item.label}</span>
                  <span className="text-[var(--shell-muted)]">
                    {item.occupied}/{item.total} · {percent}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[var(--shell-nav-hover-bg)]">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-[width] duration-[var(--ds-duration)]"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </DashboardGlassPanel>
  );
}
