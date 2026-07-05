"use client";

import type { ReactNode } from "react";
import { useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  BedDouble,
  Brush,
  Pencil,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";

import type { Booking } from "@/types/booking";

import { Button } from "@/components/ui/core/Button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/overlay/Drawer";
import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { Panel } from "@/components/ui/primitives/Panel";
import { Scrollable } from "@/components/ui/primitives/Scrollable";
import { Section } from "@/components/ui/primitives/Section";
import { Stack } from "@/components/ui/primitives/Stack";
import { PaymentStatusBadge } from "@/components/dashboard/bookings/PaymentStatusBadge";
import { motionPresets } from "@/lib/design/motion";
import { cn } from "@/lib/utils";

import { HousekeepingBadge } from "./HousekeepingBadge";
import { MaintenanceBadge } from "./MaintenanceBadge";
import { RoomStatusBadge } from "./RoomStatusBadge";
import {
  buildRoomTimeline,
  formatRoomCurrency,
  formatRoomDate,
  getGuestInitials,
  getRoomBookings,
  getRoomMonthRevenue,
  getStayPaymentLabel,
  type RoomCardModel,
} from "./room-ops-metrics";
import { RoomDetailRow } from "./rooms-ui";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  model: RoomCardModel | null;
  bookings: Booking[];
  onEdit: () => void;
};

export function RoomDetailDrawer({
  open,
  onOpenChange,
  model,
  bookings,
  onEdit,
}: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const timeline = useMemo(
    () => (model ? buildRoomTimeline(model.room, bookings) : []),
    [model, bookings]
  );

  const roomBookings = useMemo(
    () => (model ? getRoomBookings(model.room.id, bookings) : []),
    [model, bookings]
  );

  const upcomingBookings = useMemo(
    () =>
      roomBookings.filter(
        (booking) =>
          booking.status === "confirmed" &&
          booking.check_in >= new Date().toISOString().slice(0, 10)
      ),
    [roomBookings]
  );

  if (!model) return null;

  const { room, activeBooking, currentGuest, housekeepingStatus, revenueToday } =
    model;
  const monthRevenue = getRoomMonthRevenue(room.id, bookings);
  const paymentStatus = activeBooking
    ? getStayPaymentLabel(activeBooking)
    : null;

  function notify(message: string) {
    startTransition(() => {
      toast.success(message);
      router.refresh();
    });
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        side="right"
        className="w-full gap-0 overflow-hidden border-0 bg-[var(--shell-content)] p-0 sm:max-w-xl"
      >
        <DrawerHeader className="border-b border-[var(--shell-border)]/70 px-6 py-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--ds-radius-sm)] bg-[var(--shell-accent-muted)] text-[18px] font-semibold text-[var(--shell-accent)]">
              {model.roomCode}
            </div>
            <div className="min-w-0 flex-1">
              <DrawerTitle className="text-left text-[18px] font-semibold tracking-[-0.02em] text-[var(--shell-text)]">
                Room {model.roomCode}
              </DrawerTitle>
              <p className="mt-1 text-left text-[13px] text-[var(--shell-muted)]">
                {room.room_type} · {model.floorLabel}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <RoomStatusBadge status={model.status} />
                <HousekeepingBadge status={housekeepingStatus} />
                <MaintenanceBadge active={model.status === "maintenance"} />
              </div>
            </div>
          </div>
        </DrawerHeader>

        <Scrollable className="flex-1 px-6 py-5">
          <Stack gap="md">
            <Panel variant="surface" className="p-4">
              <Section title="Room info" subtitle="Inventory details" />
              <dl className="mt-3 grid gap-2">
                <RoomDetailRow label="Number" value={model.roomCode} />
                <RoomDetailRow label="Type" value={room.room_type} />
                <RoomDetailRow label="Floor" value={model.floorLabel} />
                <RoomDetailRow label="Capacity" value={`${room.capacity} guests`} />
                <RoomDetailRow label="Rate" value={formatRoomCurrency(room.price)} />
              </dl>
            </Panel>

            <Panel variant="surface" className="p-4">
              <Section title="Current stay" subtitle="Guest and reservation" />
              {activeBooking ? (
                <div className="mt-3 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--shell-accent-muted)] text-[11px] font-semibold text-[var(--shell-accent)]">
                      {getGuestInitials(currentGuest)}
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-[var(--shell-text)]">
                        {currentGuest}
                      </p>
                      <p className="text-[11px] text-[var(--shell-muted)]">
                        {activeBooking.guest_email ??
                          activeBooking.guest_phone ??
                          "No contact"}
                      </p>
                    </div>
                  </div>
                  <RoomDetailRow
                    label="Dates"
                    value={`${formatRoomDate(activeBooking.check_in)} → ${formatRoomDate(activeBooking.check_out)}`}
                  />
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[12px] text-[var(--shell-muted)]">
                      Payment
                    </span>
                    {paymentStatus ? (
                      <PaymentStatusBadge status={paymentStatus} />
                    ) : (
                      <span>—</span>
                    )}
                  </div>
                  <RoomDetailRow label="Adults" value={String(activeBooking.adults)} />
                  <RoomDetailRow
                    label="Children"
                    value={String(activeBooking.children)}
                  />
                </div>
              ) : (
                <p className="mt-3 text-[13px] text-[var(--shell-muted)]">
                  No active stay
                </p>
              )}
            </Panel>

            <Panel variant="surface" className="p-4">
              <Section title="Upcoming bookings" subtitle="Future reservations" />
              {upcomingBookings.length === 0 ? (
                <EmptyState
                  title="No upcoming bookings"
                  description="Future reservations for this room will appear here."
                  icon={<BedDouble size={16} />}
                />
              ) : (
                <div className="mt-3 space-y-2">
                  {upcomingBookings.slice(0, 5).map((booking) => (
                    <div
                      key={booking.id}
                      className="rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/60 px-3 py-2.5"
                    >
                      <p className="text-[13px] font-medium text-[var(--shell-text)]">
                        {booking.guest_name}
                      </p>
                      <p className="mt-0.5 text-[11px] text-[var(--shell-muted)]">
                        {formatRoomDate(booking.check_in)} →{" "}
                        {formatRoomDate(booking.check_out)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Panel>

            <Panel variant="surface" className="p-4">
              <Section title="Housekeeping" subtitle="Turnover status" />
              <div className="mt-3 flex flex-wrap gap-2">
                <HousekeepingBadge status={housekeepingStatus} />
              </div>
              <p className="mt-3 text-[12px] text-[var(--shell-text)]">
                {model.housekeepingLabel}
              </p>
              <p className="mt-2 text-[11px] text-[var(--shell-muted)]">
                Progress: {model.cleaningProgress}%
              </p>
            </Panel>

            <Panel variant="surface" className="p-4">
              <Section title="Maintenance" subtitle="Incidents and blocks" />
              <p className="mt-3 text-[12px] text-[var(--shell-muted)]">
                {model.status === "maintenance"
                  ? "Room flagged for maintenance"
                  : "No open maintenance incidents"}
              </p>
            </Panel>

            <Panel variant="surface" className="p-4">
              <Section title="Revenue" subtitle="Financial snapshot" />
              <dl className="mt-3 grid gap-2">
                <RoomDetailRow
                  label="Today"
                  value={formatRoomCurrency(revenueToday)}
                />
                <RoomDetailRow
                  label="Current stay"
                  value={
                    activeBooking
                      ? formatRoomCurrency(Number(activeBooking.total_price))
                      : "—"
                  }
                />
                <RoomDetailRow
                  label="Month"
                  value={formatRoomCurrency(monthRevenue)}
                />
              </dl>
            </Panel>

            <Panel variant="surface" className="p-4">
              <Section title="Timeline" subtitle="Room activity history" />
              <div className="mt-3 space-y-2">
                {timeline.slice(0, 6).map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-start justify-between gap-3 rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/60 p-3",
                      motionPresets.transitionBase
                    )}
                  >
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-[var(--shell-text)]">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-[11px] text-[var(--shell-muted)]">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </Stack>
        </Scrollable>

        <div className="border-t border-[var(--shell-border)]/70 px-6 py-4">
          <Section title="Actions" subtitle="Operational shortcuts" />
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              type="button"
              className="h-[var(--ds-input-height)] gap-2 bg-emerald-600 hover:bg-emerald-500"
              onClick={onEdit}
            >
              <Pencil size={14} />
              Edit
            </Button>
            <ActionChip
              icon={<Brush size={14} />}
              label="Clean"
              onClick={() => notify("Room marked for cleaning")}
            />
            <ActionChip
              icon={<ShieldCheck size={14} />}
              label="Mark inspected"
              onClick={() => notify("Room marked as inspected")}
            />
            <ActionChip
              icon={<Wrench size={14} />}
              label="Maintenance"
              onClick={() => notify("Maintenance request logged")}
            />
            <ActionChip
              icon={<BedDouble size={14} />}
              label="Block room"
              onClick={() => notify("Room blocked for operations")}
            />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function ActionChip({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-[var(--ds-input-height)] items-center gap-2 rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)] px-3 text-[12px] font-medium text-[var(--shell-text)] shadow-[var(--shell-shadow-sm)] transition-[background-color] hover:bg-[var(--shell-nav-hover-bg)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--shell-accent-ring)]"
    >
      {icon}
      {label}
    </button>
  );
}
