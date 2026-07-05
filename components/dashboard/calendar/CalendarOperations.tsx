"use client";

import { useMemo } from "react";
import { AlertTriangle, BedDouble, CalendarDays } from "lucide-react";

import type { Booking } from "@/types/booking";
import type { Room } from "@/types/room";

import { DataCard } from "@/components/ui/data/DataCard";
import { Badge } from "@/components/ui/display/Badge";
import { SkeletonGroup } from "@/components/ui/display/Skeleton";
import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { Section } from "@/components/ui/primitives/Section";
import { todayIso } from "@/lib/dashboard/date";
import { rangesOverlap } from "@/lib/calendar";

import { BookingStatusBadge } from "@/components/dashboard/bookings/BookingStatusBadge";
import {
  formatBookingCurrency,
  formatBookingDate,
} from "@/components/dashboard/bookings/booking-ops-metrics";

import type { CalendarRoomModel } from "./calendar-ops-metrics";
import { CalendarOpsListItem } from "./calendar-ui";

type Props = {
  bookings: Booking[];
  rooms: Room[];
  roomModels: CalendarRoomModel[];
  loading?: boolean;
  onSelect?: (booking: Booking) => void;
};

function BookingOpsList({
  items,
  emptyTitle,
  emptyDescription,
  onSelect,
}: {
  items: Booking[];
  emptyTitle: string;
  emptyDescription: string;
  onSelect?: (booking: Booking) => void;
}) {
  if (items.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon={<CalendarDays size={16} />}
      />
    );
  }

  return (
    <div className="space-y-2" role="list">
      {items.slice(0, 5).map((booking) => (
        <CalendarOpsListItem
          key={booking.id}
          role="listitem"
          aria-label={`Open reservation for ${booking.guest_name}`}
          onClick={() => onSelect?.(booking)}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-[var(--shell-text)]">
                {booking.guest_name}
              </p>
              <p className="mt-0.5 text-[11px] text-[var(--shell-muted)]">
                {formatBookingDate(booking.check_in)} —{" "}
                {formatBookingDate(booking.check_out)}
              </p>
            </div>
            <p className="shrink-0 text-[12px] font-semibold text-[var(--shell-text)]">
              {formatBookingCurrency(Number(booking.total_price))}
            </p>
          </div>
          <div className="mt-2">
            <BookingStatusBadge status={booking.status} />
          </div>
        </CalendarOpsListItem>
      ))}
    </div>
  );
}

export function CalendarOperations({
  bookings,
  rooms,
  roomModels,
  loading = false,
  onSelect,
}: Props) {
  const today = todayIso();
  const roomName = useMemo(
    () => new Map(rooms.map((room) => [room.id, room.room_type])),
    [rooms]
  );

  const arrivalsToday = useMemo(
    () =>
      bookings.filter(
        (booking) =>
          booking.check_in === today && booking.status !== "cancelled"
      ),
    [bookings, today]
  );

  const departuresToday = useMemo(
    () =>
      bookings.filter(
        (booking) =>
          booking.check_out === today && booking.status !== "cancelled"
      ),
    [bookings, today]
  );

  const occupiedRooms = useMemo(
    () => roomModels.filter((model) => model.status === "occupied"),
    [roomModels]
  );

  const availableRooms = useMemo(
    () => roomModels.filter((model) => model.isAvailableToday),
    [roomModels]
  );

  const upcomingStays = useMemo(
    () =>
      bookings
        .filter(
          (booking) =>
            booking.check_in > today && booking.status !== "cancelled"
        )
        .sort((a, b) => a.check_in.localeCompare(b.check_in)),
    [bookings, today]
  );

  const conflicts = useMemo(() => {
    const active = bookings.filter((booking) => booking.status !== "cancelled");
    const pairs: Array<{ a: Booking; b: Booking }> = [];

    for (let i = 0; i < active.length; i += 1) {
      for (let j = i + 1; j < active.length; j += 1) {
        const a = active[i];
        const b = active[j];
        if (a.room_id !== b.room_id) continue;
        if (
          rangesOverlap(a.check_in, a.check_out, b.check_in, b.check_out)
        ) {
          pairs.push({ a, b });
        }
      }
    }

    return pairs;
  }, [bookings]);

  if (loading) {
    return (
      <Section title="Operations" subtitle="Daily planning and room flow">
        <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <DataCard key={index} title="Loading">
              <SkeletonGroup />
            </DataCard>
          ))}
        </div>
      </Section>
    );
  }

  return (
    <Section title="Operations" subtitle="Daily planning and room flow">
      <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        <DataCard
          interactive
          title="Today's arrivals"
          subtitle={`${arrivalsToday.length} expected check-ins`}
        >
          <BookingOpsList
            items={arrivalsToday}
            emptyTitle="No arrivals today"
            emptyDescription="Check-ins scheduled for today will appear here."
            onSelect={onSelect}
          />
        </DataCard>

        <DataCard
          interactive
          title="Today's departures"
          subtitle={`${departuresToday.length} expected check-outs`}
        >
          <BookingOpsList
            items={departuresToday}
            emptyTitle="No departures today"
            emptyDescription="Check-outs scheduled for today will appear here."
            onSelect={onSelect}
          />
        </DataCard>

        <DataCard
          interactive
          title="Occupied rooms"
          subtitle={`${occupiedRooms.length} in-house`}
        >
          {occupiedRooms.length === 0 ? (
            <EmptyState
              title="No occupied rooms"
              description="Active stays will appear here."
              icon={<BedDouble size={16} />}
            />
          ) : (
            <div className="space-y-2">
              {occupiedRooms.slice(0, 5).map((model) => (
                <div
                  key={model.room.id}
                  className="rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/60 px-3 py-2.5"
                >
                  <p className="text-[12px] font-medium text-[var(--shell-text)]">
                    {model.room.room_type}
                  </p>
                </div>
              ))}
            </div>
          )}
        </DataCard>

        <DataCard
          interactive
          title="Available rooms"
          subtitle={`${availableRooms.length} ready today`}
        >
          {availableRooms.length === 0 ? (
            <EmptyState
              title="No available rooms"
              description="Vacant inventory will appear here."
              icon={<BedDouble size={16} />}
            />
          ) : (
            <div className="space-y-2">
              {availableRooms.slice(0, 5).map((model) => (
                <div
                  key={model.room.id}
                  className="rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/60 px-3 py-2.5"
                >
                  <p className="text-[12px] font-medium text-[var(--shell-text)]">
                    {model.room.room_type}
                  </p>
                </div>
              ))}
            </div>
          )}
        </DataCard>

        <DataCard
          interactive
          title="Upcoming stays"
          subtitle="Future confirmed reservations"
        >
          <BookingOpsList
            items={upcomingStays}
            emptyTitle="No upcoming stays"
            emptyDescription="Future reservations will appear here."
            onSelect={onSelect}
          />
        </DataCard>

        <DataCard
          interactive
          title="Conflicts"
          subtitle={`${conflicts.length} overlapping bookings`}
        >
          {conflicts.length === 0 ? (
            <EmptyState
              title="No conflicts detected"
              description="Overlapping room assignments will appear here."
              icon={<AlertTriangle size={16} />}
            />
          ) : (
            <div className="space-y-2">
              {conflicts.slice(0, 5).map(({ a, b }) => (
                <button
                  key={`${a.id}-${b.id}`}
                  type="button"
                  onClick={() => onSelect?.(a)}
                  className="w-full rounded-[var(--ds-radius-sm)] border border-red-500/20 bg-red-500/5 px-3 py-2.5 text-left transition-[background-color] hover:bg-red-500/10 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--shell-accent-ring)]"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">Conflict</Badge>
                    <span className="text-[11px] text-[var(--shell-muted)]">
                      {roomName.get(a.room_id) ?? "Room"}
                    </span>
                  </div>
                  <p className="mt-2 text-[12px] text-[var(--shell-text)]">
                    {a.guest_name} · {a.check_in} — {a.check_out}
                  </p>
                  <p className="mt-1 text-[11px] text-[var(--shell-muted)]">
                    overlaps {b.guest_name}
                  </p>
                </button>
              ))}
            </div>
          )}
        </DataCard>
      </div>
    </Section>
  );
}
