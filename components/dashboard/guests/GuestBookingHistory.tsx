import type { Booking } from "@/types/booking";

import {
  DataTable,
  type DataTableColumn,
} from "@/components/dashboard/DataTable";
import { BookingStatusBadge } from "@/components/dashboard/bookings/BookingStatusBadge";

type Props = {
  bookings: Booking[];
};

export function GuestBookingHistory({ bookings }: Props) {
  const columns: DataTableColumn<Booking>[] = [
    { header: "Check-in", cell: (b) => b.check_in },
    { header: "Check-out", cell: (b) => b.check_out },
    {
      header: "Status",
      cell: (b) => <BookingStatusBadge status={b.status} />,
    },
    {
      header: "Total",
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
      caption="Guest booking history"
      empty={
        <div className="rounded-[var(--ds-radius)] border border-[var(--shell-border)] bg-[var(--shell-surface)] py-12 text-center text-[var(--shell-muted)]">
          No booking history
        </div>
      }
    />
  );
}
