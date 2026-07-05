"use client";

import { useTransition } from "react";
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

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PaymentStatusBadge } from "@/components/dashboard/bookings/PaymentStatusBadge";
import {
  DashboardGlassPanel,
  DashboardPanelHeader,
} from "@/components/dashboard/home/DashboardPrimitives";

import { HousekeepingBadge } from "./HousekeepingBadge";
import { RoomStatusBadge } from "./RoomStatusBadge";
import {
  formatRoomCurrency,
  formatRoomDate,
  getGuestInitials,
  getRoomMonthRevenue,
  getStayPaymentLabel,
  type RoomCardModel,
} from "./room-ops-metrics";

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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full gap-0 overflow-hidden border-0 bg-[var(--shell-content)] p-0 sm:max-w-xl"
      >
        <SheetHeader className="border-b border-[var(--shell-border)]/70 px-6 py-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--ds-radius-sm)] bg-[var(--shell-accent-muted)] text-[18px] font-semibold text-[var(--shell-accent)]">
              {model.roomCode}
            </div>
            <div className="min-w-0 flex-1">
              <SheetTitle className="text-left text-[18px] font-semibold tracking-[-0.02em]">
                Room {model.roomCode}
              </SheetTitle>
              <p className="mt-1 text-left text-[13px] text-[var(--shell-muted)]">
                {room.room_type} · {model.floorLabel}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <RoomStatusBadge status={model.status} />
                <HousekeepingBadge status={housekeepingStatus} />
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-3 overflow-y-auto px-6 py-5">
          <DashboardGlassPanel className="p-4">
            <DashboardPanelHeader title="Room" subtitle="Inventory details" className="mb-3" />
            <dl className="grid gap-2 text-[12px]">
              <Row label="Number" value={model.roomCode} />
              <Row label="Type" value={room.room_type} />
              <Row label="Floor" value={model.floorLabel} />
              <Row label="Capacity" value={`${room.capacity} guests`} />
              <Row label="Rate" value={formatRoomCurrency(room.price)} />
              <Row label="Amenities" value={`Up to ${room.capacity} guests`} />
              <Row label="Notes" value="—" />
            </dl>
          </DashboardGlassPanel>

          <DashboardGlassPanel className="p-4">
            <DashboardPanelHeader title="Current stay" subtitle="Guest and reservation" className="mb-3" />
            {activeBooking ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--shell-accent-muted)] text-[11px] font-semibold text-[var(--shell-accent)]">
                    {getGuestInitials(currentGuest)}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[var(--shell-text)]">
                      {currentGuest}
                    </p>
                    <p className="text-[11px] text-[var(--shell-muted)]">
                      {activeBooking.guest_email ?? activeBooking.guest_phone ?? "No contact"}
                    </p>
                  </div>
                </div>
                <Row
                  label="Dates"
                  value={`${formatRoomDate(activeBooking.check_in)} → ${formatRoomDate(activeBooking.check_out)}`}
                />
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[12px] text-[var(--shell-muted)]">Payment</span>
                  {paymentStatus ? (
                    <PaymentStatusBadge status={paymentStatus} />
                  ) : (
                    <span>—</span>
                  )}
                </div>
                <Row label="Adults" value={String(room.capacity)} />
                <Row label="Children" value="0" />
              </div>
            ) : (
              <p className="text-[13px] text-[var(--shell-muted)]">No active stay</p>
            )}
          </DashboardGlassPanel>

          <DashboardGlassPanel className="p-4">
            <DashboardPanelHeader title="Housekeeping" subtitle="Turnover status" className="mb-3" />
            <div className="flex flex-wrap gap-2">
              <HousekeepingBadge status="clean" />
              <HousekeepingBadge status="dirty" />
              <HousekeepingBadge status="inspected" />
            </div>
            <p className="mt-3 text-[12px] text-[var(--shell-text)]">
              {model.housekeepingLabel}
            </p>
            <p className="mt-2 text-[11px] text-[var(--shell-muted)]">
              Last cleaned: {formatRoomDate(new Date().toISOString().slice(0, 10))}
            </p>
            <p className="mt-1 text-[11px] text-[var(--shell-muted)]">
              Assigned: Housekeeping team
            </p>
          </DashboardGlassPanel>

          <DashboardGlassPanel className="p-4">
            <DashboardPanelHeader title="Maintenance" subtitle="Incidents and blocks" className="mb-3" />
            <p className="text-[12px] text-[var(--shell-muted)]">
              {model.status === "maintenance"
                ? "Room flagged for maintenance"
                : "No open maintenance incidents"}
            </p>
            <p className="mt-2 text-[11px] text-[var(--shell-muted)]">Notes: —</p>
          </DashboardGlassPanel>

          <DashboardGlassPanel className="p-4">
            <DashboardPanelHeader title="Revenue" subtitle="Financial snapshot" className="mb-3" />
            <dl className="grid gap-2 text-[12px]">
              <Row label="Today" value={formatRoomCurrency(revenueToday)} />
              <Row
                label="Current stay"
                value={
                  activeBooking
                    ? formatRoomCurrency(Number(activeBooking.total_price))
                    : "—"
                }
              />
              <Row label="Month" value={formatRoomCurrency(monthRevenue)} />
            </dl>
          </DashboardGlassPanel>
        </div>

        <div className="border-t border-[var(--shell-border)]/70 px-6 py-4">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              className="h-[var(--ds-input-height)] gap-2 rounded-[var(--ds-radius-sm)] bg-emerald-600 px-4 text-[13px] hover:bg-emerald-500"
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
      </SheetContent>
    </Sheet>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-[var(--shell-muted)]">{label}</dt>
      <dd className="text-right font-medium text-[var(--shell-text)]">{value}</dd>
    </div>
  );
}

function ActionChip({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-[var(--ds-input-height)] items-center gap-2 rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)] px-3 text-[12px] font-medium text-[var(--shell-text)] shadow-[var(--shell-shadow-sm)] transition-[background-color] hover:bg-[var(--shell-nav-hover-bg)]"
    >
      {icon}
      {label}
    </button>
  );
}
