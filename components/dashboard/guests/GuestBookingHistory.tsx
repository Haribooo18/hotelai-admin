"use client";

import { CalendarDays } from "lucide-react";

import type { Booking } from "@/types/booking";

import {
  DataTable,
  type DataTableColumn,
} from "@/components/dashboard/DataTable";
import { BookingStatusBadge } from "@/components/dashboard/bookings/BookingStatusBadge";
import { WorkspaceEmptyState } from "@/components/dashboard/shared/WorkspaceEmptyState";
import { useI18n } from "@/lib/i18n";

type Props = {
  bookings: Booking[];
};

export function GuestBookingHistory({ bookings }: Props) {
  const { t } = useI18n();

  const columns: DataTableColumn<Booking>[] = [
    { header: t("bookings.checkIn"), cell: (b) => b.check_in },
    { header: t("bookings.checkOut"), cell: (b) => b.check_out },
    {
      header: t("bookings.status"),
      cell: (b) => <BookingStatusBadge status={b.status} />,
    },
    {
      header: t("bookings.total"),
      align: "right",
      cell: (b) => `$${b.total_price}`,
      cellClassName: "font-medium",
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={bookings}
      getRowId={(b) => b.id}
      caption={t("guests.bookingHistoryCaption")}
      empty={
        <WorkspaceEmptyState
          title={t("guests.noResults")}
          description={t("guests.noResultsDesc")}
          icon={<CalendarDays size={18} />}
        />
      }
    />
  );
}
