"use client";

import { useMemo } from "react";
import { RefreshCw } from "lucide-react";

import { FilterSelect } from "@/components/ui/core/FilterSelect";
import { SearchInput } from "@/components/ui/core/SearchInput";
import { ToolbarDateInput } from "@/components/ui/core/ToolbarDateInput";
import {
  FilterChip,
  ToolbarSecondaryButton,
} from "@/components/ui/data/FilterBar";
import { WorkspaceToolbar } from "@/components/dashboard/shared/WorkspaceToolbar";
import { BOOKING_STATUS_OPTIONS } from "@/lib/booking-status";
import { toolbarFilterIconSize } from "@/lib/dashboard/design-system";
import { useI18n } from "@/lib/i18n";

import type { Room } from "@/types/room";

import type {
  BookingPaymentStatus,
  BookingSource,
} from "./booking-ops-metrics";
import type { BookingsChipFilter, BookingsToolbarFilters } from "./bookings-ui";

type Props = {
  filters: BookingsToolbarFilters;
  rooms: Room[];
  refreshing: boolean;
  onFiltersChange: (filters: BookingsToolbarFilters) => void;
  onRefresh: () => void;
};

export function BookingsToolbar({
  filters,
  rooms,
  refreshing,
  onFiltersChange,
  onRefresh,
}: Props) {
  const { t } = useI18n();

  const chipFilters = useMemo(
    (): { id: BookingsChipFilter; label: string }[] => [
      { id: "all", label: t("bookings.chipAll") },
      { id: "new", label: t("bookings.chipNew") },
      { id: "confirmed", label: t("bookings.chipConfirmed") },
      { id: "check_in_today", label: t("bookings.chipCheckInToday") },
      { id: "check_out_today", label: t("bookings.chipCheckOutToday") },
    ],
    [t]
  );

  const paymentOptions = useMemo(
    (): { value: BookingPaymentStatus | ""; label: string }[] => [
      { value: "", label: t("toolbar.allPayments") },
      { value: "paid", label: t("statuses.payment.paid") },
      { value: "deposit", label: t("statuses.payment.deposit") },
      { value: "pending", label: t("statuses.payment.pending") },
      { value: "void", label: t("statuses.payment.void") },
    ],
    [t]
  );

  const sourceOptions = useMemo(
    (): { value: BookingSource | ""; label: string }[] => [
      { value: "", label: t("toolbar.allSources") },
      { value: "direct", label: t("statuses.bookingSource.direct") },
      { value: "online", label: t("statuses.bookingSource.online") },
      { value: "phone", label: t("statuses.bookingSource.phone") },
    ],
    [t]
  );

  const statusOptions = useMemo(
    () => [
      { value: "", label: t("toolbar.allStatuses") },
      ...BOOKING_STATUS_OPTIONS.map((option) => ({
        value: option.value,
        label: t(`statuses.booking.${option.value}`),
      })),
    ],
    [t]
  );

  function patch(partial: Partial<BookingsToolbarFilters>) {
    onFiltersChange({ ...filters, ...partial });
  }

  const roomOptions = useMemo(
    () => [
      { value: "", label: t("toolbar.allRooms") },
      ...rooms.map((room) => ({ value: room.id, label: room.room_type })),
    ],
    [rooms, t]
  );

  return (
    <WorkspaceToolbar
      search={
        <SearchInput
          placeholder={t("bookings.searchPlaceholder")}
          aria-label={t("bookings.searchAria")}
          value={filters.search}
          onChange={(event) => patch({ search: event.target.value })}
          onClear={() => patch({ search: "" })}
        />
      }
      primaryFilters={
        <>
          <FilterSelect
            value={filters.status}
            options={statusOptions}
            onChange={(value) => patch({ status: value })}
            ariaLabel={t("bookings.statusFilter")}
          />

          <FilterSelect
            value={filters.payment}
            options={paymentOptions}
            onChange={(value) => patch({ payment: value })}
            ariaLabel={t("bookings.paymentFilter")}
          />

          <FilterSelect
            value={filters.source}
            options={sourceOptions}
            onChange={(value) => patch({ source: value })}
            ariaLabel={t("bookings.sourceFilter")}
          />

          <FilterSelect
            value={filters.roomId}
            options={roomOptions}
            onChange={(value) => patch({ roomId: value })}
            ariaLabel={t("bookings.roomFilter")}
            className="max-w-[148px]"
          />

          <ToolbarDateInput
            value={filters.dateFilter}
            onChange={(event) => patch({ dateFilter: event.target.value })}
            aria-label={t("bookings.checkIn")}
          />
        </>
      }
      actions={
        <ToolbarSecondaryButton
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          loading={refreshing}
          aria-label={t("bookings.refreshAria")}
        >
          <RefreshCw size={toolbarFilterIconSize} aria-hidden />
          {t("common.refresh")}
        </ToolbarSecondaryButton>
      }
      chips={
        <>
          {chipFilters.map((chip) => (
            <FilterChip
              key={chip.id}
              active={filters.chipFilter === chip.id}
              onClick={() => patch({ chipFilter: chip.id })}
            >
              {chip.label}
            </FilterChip>
          ))}
        </>
      }
    />
  );
}
