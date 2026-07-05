"use client";

import { useMemo, useState } from "react";
import {
  BedDouble,
  Brush,
  Camera,
  FileText,
  History,
  NotebookPen,
  UserRound,
  Wrench,
} from "lucide-react";

import type { Booking } from "@/types/booking";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  DashboardEmptyState,
  DashboardSurface,
} from "@/components/dashboard/home/DashboardPrimitives";
import { BookingStatusBadge } from "@/components/dashboard/bookings/BookingStatusBadge";

import { RoomStatusBadge } from "./RoomStatusBadge";
import {
  buildRoomTimeline,
  formatRoomCurrency,
  formatRoomDate,
  type RoomCardModel,
} from "./room-ops-metrics";

const TABS = [
  { id: "overview", label: "Overview", icon: BedDouble },
  { id: "reservations", label: "Reservations", icon: NotebookPen },
  { id: "guest", label: "Current Guest", icon: UserRound },
  { id: "housekeeping", label: "Housekeeping", icon: Brush },
  { id: "maintenance", label: "Maintenance", icon: Wrench },
  { id: "notes", label: "Notes", icon: FileText },
  { id: "photos", label: "Photos", icon: Camera },
  { id: "history", label: "History", icon: History },
] as const;

type TabId = (typeof TABS)[number]["id"];

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  model: RoomCardModel | null;
  bookings: Booking[];
};

export function RoomDetailDrawer({
  open,
  onOpenChange,
  model,
  bookings,
}: Props) {
  const [tab, setTab] = useState<TabId>("overview");

  const roomBookings = useMemo(
    () =>
      model
        ? bookings.filter((booking) => booking.room_id === model.room.id)
        : [],
    [bookings, model]
  );

  const timeline = useMemo(
    () => (model ? buildRoomTimeline(model.room, roomBookings) : []),
    [model, roomBookings]
  );

  if (!model) return null;

  const { room, currentGuest, housekeepingLabel, cleaningProgress } = model;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full gap-0 overflow-hidden border-0 bg-[var(--shell-content)] p-0 sm:max-w-2xl"
      >
        <SheetHeader className="border-b border-[var(--shell-border)] px-6 py-5">
          <SheetTitle className="text-left text-[20px] font-semibold text-[var(--shell-text)]">
            Room {model.roomCode}
          </SheetTitle>
          <p className="text-left text-[14px] text-[var(--shell-muted)]">
            {room.room_type}
          </p>
          <div className="mt-3">
            <RoomStatusBadge status={model.status} />
          </div>
        </SheetHeader>

        <div className="flex h-full min-h-0 flex-col">
          <div className="border-b border-[var(--shell-border)] px-4 py-3">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {TABS.map((item) => {
                const Icon = item.icon;
                const active = tab === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTab(item.id)}
                    className={cn(
                      "inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-[12px] font-medium transition-all duration-[var(--ds-duration-slow)] ease-out",
                      active
                        ? "bg-emerald-500/15 text-emerald-500"
                        : "bg-[var(--shell-nav-hover-bg)] text-[var(--shell-muted)] hover:text-[var(--shell-text)]"
                    )}
                  >
                    <Icon size={14} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            {tab === "overview" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <OverviewStat label="Price" value={formatRoomCurrency(room.price)} />
                <OverviewStat label="Capacity" value={`${room.capacity} guests`} />
                <OverviewStat
                  label="Current Guest"
                  value={currentGuest ?? "—"}
                />
                <OverviewStat label="Housekeeping" value={housekeepingLabel} />
              </div>
            ) : null}

            {tab === "reservations" ? (
              <div className="space-y-3">
                {roomBookings.length === 0 ? (
                  <DashboardSurface>
                    <DashboardEmptyState
                      title="No reservations"
                      description="When the room is booked, entries will appear here."
                      icon={<NotebookPen size={20} />}
                    />
                  </DashboardSurface>
                ) : (
                  roomBookings.map((booking) => (
                    <DashboardSurface
                      key={booking.id}
                      className="p-4 transition-all duration-[var(--ds-duration-slow)] ease-out hover:-translate-y-0.5 hover:shadow-[var(--shell-shadow-md)]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[14px] font-medium text-[var(--shell-text)]">
                            {booking.guest_name}
                          </p>
                          <p className="mt-1 text-[13px] text-[var(--shell-muted)]">
                            {formatRoomDate(booking.check_in)} —{" "}
                            {formatRoomDate(booking.check_out)}
                          </p>
                        </div>
                        <p className="text-[13px] font-semibold text-[var(--shell-text)]">
                          {formatRoomCurrency(booking.total_price)}
                        </p>
                      </div>
                      <div className="mt-3">
                        <BookingStatusBadge status={booking.status} />
                      </div>
                    </DashboardSurface>
                  ))
                )}
              </div>
            ) : null}

            {tab === "guest" ? (
              <DashboardSurface className="p-6">
                {currentGuest ? (
                  <div className="space-y-2">
                    <p className="text-[15px] font-medium text-[var(--shell-text)]">
                      {currentGuest}
                    </p>
                    {model.activeBooking ? (
                      <p className="text-[13px] text-[var(--shell-muted)]">
                        {formatRoomDate(model.activeBooking.check_in)} —{" "}
                        {formatRoomDate(model.activeBooking.check_out)}
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <DashboardEmptyState
                    title="Room available"
                    description="There is no registered guest in this room right now."
                    icon={<UserRound size={20} />}
                  />
                )}
              </DashboardSurface>
            ) : null}

            {tab === "housekeeping" ? (
              <DashboardSurface className="space-y-4 p-6">
                <p className="text-[14px] text-[var(--shell-text)]">
                  {housekeepingLabel}
                </p>
                <div>
                  <div className="mb-1.5 flex items-center justify-between text-[12px] text-[var(--shell-muted)]">
                    <span>Cleaning progress</span>
                    <span>{cleaningProgress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[var(--shell-nav-hover-bg)]">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${cleaningProgress}%` }}
                    />
                  </div>
                </div>
              </DashboardSurface>
            ) : null}

            {tab === "maintenance" ? (
              <DashboardSurface>
                <DashboardEmptyState
                  title="Maintenance not tracked"
                  description="Repair and maintenance requests will appear here once the module is connected."
                  icon={<Wrench size={20} />}
                />
              </DashboardSurface>
            ) : null}

            {tab === "notes" ? (
              <DashboardSurface>
                <DashboardEmptyState
                  title="No notes yet"
                  description="Internal room notes will be available in future versions."
                  icon={<FileText size={20} />}
                />
              </DashboardSurface>
            ) : null}

            {tab === "photos" ? (
              <DashboardSurface>
                <DashboardEmptyState
                  title="No photos"
                  description="Add room photos so the team can see the room condition."
                  icon={<Camera size={20} />}
                />
              </DashboardSurface>
            ) : null}

            {tab === "history" ? (
              <div className="space-y-3">
                {timeline.length === 0 ? (
                  <DashboardSurface>
                    <DashboardEmptyState
                      title="History is empty"
                      description="Room events will appear after bookings."
                      icon={<History size={20} />}
                    />
                  </DashboardSurface>
                ) : (
                  timeline.map((item) => (
                    <DashboardSurface key={item.id} className="p-4">
                      <p className="text-[14px] font-medium text-[var(--shell-text)]">
                        {item.title}
                      </p>
                      <p className="mt-1 text-[13px] text-[var(--shell-muted)]">
                        {item.subtitle}
                      </p>
                    </DashboardSurface>
                  ))
                )}
              </div>
            ) : null}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function OverviewStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <DashboardSurface className="p-4">
      <p className="text-[11px] uppercase tracking-[0.08em] text-[var(--shell-muted)]">
        {label}
      </p>
      <p className="mt-2 text-[18px] font-semibold text-[var(--shell-text)]">
        {value}
      </p>
    </DashboardSurface>
  );
}
