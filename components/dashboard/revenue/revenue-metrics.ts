import type { Booking } from "@/types/booking";
import type { Room } from "@/types/room";

export type RevenueDateRange = {
  from: string;
  to: string;
};

export type RevenueKpis = {
  revenueToday: number;
  revenueWeek: number;
  revenueMonth: number;
  adr: number;
  revpar: number;
  occupancy: number;
  averageStay: number;
  cancellationRate: number;
};

export type RevenueTrendPoint = {
  label: string;
  date: string;
  revenue: number;
  occupancy: number;
  adr: number;
};

export type RevenueBreakdownPoint = {
  label: string;
  value: number;
};

export type RevenueTransaction = {
  id: string;
  guestName: string;
  roomLabel: string;
  bookingLabel: string;
  paymentMethod: string;
  amount: number;
  status: Booking["status"];
  date: string;
  booking: Booking;
};

export type RevenueInsight = {
  id: string;
  text: string;
};

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function addDays(date: string, days: number): string {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next.toISOString().slice(0, 10);
}

function nightsBetween(checkIn: string, checkOut: string): number {
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
}

function isInRange(date: string, from: string, to: string): boolean {
  return date >= from && date <= to;
}

function isActiveOnDate(booking: Booking, date: string): boolean {
  if (booking.status === "cancelled") return false;
  return booking.check_in <= date && booking.check_out > date;
}

export function formatRevenueCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatRevenueDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function defaultRevenueRange(): RevenueDateRange {
  const to = todayIso();
  const from = addDays(to, -29);
  return { from, to };
}

function filterBookingsInRange(
  bookings: Booking[],
  range: RevenueDateRange
): Booking[] {
  return bookings.filter((booking) =>
    isInRange(booking.check_in, range.from, range.to)
  );
}

function revenueForBookings(bookings: Booking[]): number {
  return bookings
    .filter((booking) => booking.status !== "cancelled")
    .reduce((sum, booking) => sum + Number(booking.total_price), 0);
}

function totalNights(bookings: Booking[]): number {
  return bookings
    .filter((booking) => booking.status !== "cancelled")
    .reduce(
      (sum, booking) => sum + nightsBetween(booking.check_in, booking.check_out),
      0
    );
}

export function computeRevenueKpis(
  bookings: Booking[],
  rooms: Room[],
  range: RevenueDateRange
): RevenueKpis {
  const today = todayIso();
  const weekStart = addDays(today, -6);
  const monthPrefix = today.slice(0, 7);

  const inRange = filterBookingsInRange(bookings, range);
  const activeBookings = inRange.filter((b) => b.status !== "cancelled");

  const revenueToday = revenueForBookings(
    bookings.filter((b) => b.check_in === today)
  );

  const revenueWeek = revenueForBookings(
    bookings.filter((b) => isInRange(b.check_in, weekStart, today))
  );

  const revenueMonth = revenueForBookings(
    bookings.filter((b) => b.check_in.startsWith(monthPrefix))
  );

  const nights = totalNights(activeBookings);
  const revenue = revenueForBookings(activeBookings);
  const adr = nights > 0 ? revenue / nights : 0;

  const dayCount = Math.max(
    1,
    Math.round(
      (new Date(range.to).getTime() - new Date(range.from).getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1
  );

  const revpar =
    rooms.length > 0 ? revenue / (rooms.length * dayCount) : 0;

  const occupiedToday = bookings.filter((b) => isActiveOnDate(b, today)).length;
  const occupancy =
    rooms.length > 0 ? Math.round((occupiedToday / rooms.length) * 100) : 0;

  const averageStay =
    activeBookings.length > 0
      ? Math.round(nights / activeBookings.length)
      : 0;

  const cancellationRate =
    inRange.length > 0
      ? Math.round(
          (inRange.filter((b) => b.status === "cancelled").length /
            inRange.length) *
            100
        )
      : 0;

  return {
    revenueToday,
    revenueWeek,
    revenueMonth,
    adr,
    revpar,
    occupancy,
    averageStay,
    cancellationRate,
  };
}

export function buildRevenueTrend(
  bookings: Booking[],
  rooms: Room[],
  range: RevenueDateRange
): RevenueTrendPoint[] {
  const points: RevenueTrendPoint[] = [];
  let cursor = range.from;

  while (cursor <= range.to) {
    const dayBookings = bookings.filter(
      (booking) =>
        booking.check_in === cursor && booking.status !== "cancelled"
    );
    const revenue = revenueForBookings(dayBookings);
    const nights = totalNights(dayBookings);
    const occupied = bookings.filter((booking) =>
      isActiveOnDate(booking, cursor)
    ).length;

    points.push({
      date: cursor,
      label: new Intl.DateTimeFormat("en-US", {
        day: "numeric",
        month: "short",
      }).format(new Date(cursor)),
      revenue,
      occupancy:
        rooms.length > 0 ? Math.round((occupied / rooms.length) * 100) : 0,
      adr: nights > 0 ? revenue / nights : 0,
    });

    cursor = addDays(cursor, 1);
  }

  return points;
}

export function buildRevenueByRoomType(
  bookings: Booking[],
  rooms: Room[],
  range: RevenueDateRange
): RevenueBreakdownPoint[] {
  const inRange = filterBookingsInRange(bookings, range).filter(
    (b) => b.status !== "cancelled"
  );

  const totals = new Map<string, number>();

  for (const booking of inRange) {
    const room = rooms.find((item) => item.id === booking.room_id);
    const label = room?.room_type ?? "No type";
    totals.set(label, (totals.get(label) ?? 0) + Number(booking.total_price));
  }

  return Array.from(totals.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

export function buildRevenueByChannel(
  bookings: Booking[],
  range: RevenueDateRange
): RevenueBreakdownPoint[] {
  const inRange = filterBookingsInRange(bookings, range).filter(
    (b) => b.status !== "cancelled"
  );

  if (inRange.length === 0) return [];

  return [
    {
      label: "Direct booking",
      value: revenueForBookings(inRange),
    },
  ];
}

export function buildMonthlyComparison(
  bookings: Booking[]
): RevenueBreakdownPoint[] {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const previousMonth = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, "0")}`;

  const current = revenueForBookings(
    bookings.filter(
      (b) => b.check_in.startsWith(currentMonth) && b.status !== "cancelled"
    )
  );

  const previous = revenueForBookings(
    bookings.filter(
      (b) => b.check_in.startsWith(previousMonth) && b.status !== "cancelled"
    )
  );

  return [
    { label: "Current month", value: current },
    { label: "Previous month", value: previous },
  ];
}

export function buildRevenueTransactions(
  bookings: Booking[],
  rooms: Room[],
  range: RevenueDateRange
): RevenueTransaction[] {
  return filterBookingsInRange(bookings, range)
    .sort((a, b) => b.check_in.localeCompare(a.check_in))
    .map((booking) => {
      const room = rooms.find((item) => item.id === booking.room_id);

      return {
        id: booking.id,
        guestName: booking.guest_name,
        roomLabel: room?.room_type ?? "Room not assigned",
        bookingLabel: `${booking.check_in} — ${booking.check_out}`,
        paymentMethod: "Direct",
        amount: Number(booking.total_price),
        status: booking.status,
        date: booking.check_in,
        booking,
      };
    });
}

export function buildRevenueInsights(
  bookings: Booking[],
  rooms: Room[],
  range: RevenueDateRange
): RevenueInsight[] {
  const rangeDays = Math.max(
    1,
    Math.round(
      (new Date(range.to).getTime() - new Date(range.from).getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1
  );

  const previousRange: RevenueDateRange = {
    from: addDays(range.from, -rangeDays),
    to: addDays(range.from, -1),
  };

  const currentRevenue = revenueForBookings(
    filterBookingsInRange(bookings, range).filter((b) => b.status !== "cancelled")
  );

  const previousRevenue = revenueForBookings(
    filterBookingsInRange(bookings, previousRange).filter(
      (b) => b.status !== "cancelled"
    )
  );

  const insights: RevenueInsight[] = [];

  if (previousRevenue > 0) {
    const change = Math.round(
      ((currentRevenue - previousRevenue) / previousRevenue) * 100
    );
    insights.push({
      id: "revenue-change",
      text:
        change >= 0
          ? `Revenue increased by ${change}% for the selected period`
          : `Revenue decreased by ${Math.abs(change)}% for the selected period`,
    });
  }

  const currentKpis = computeRevenueKpis(bookings, rooms, range);
  const previousKpis = computeRevenueKpis(bookings, rooms, previousRange);

  if (previousKpis.adr > 0) {
    const adrChange = Math.round(
      ((currentKpis.adr - previousKpis.adr) / previousKpis.adr) * 100
    );
    insights.push({
      id: "adr-change",
      text:
        adrChange === 0
          ? "ADR is stable"
          : adrChange > 0
            ? `ADR increased by ${adrChange}%`
            : `ADR decreased by ${Math.abs(adrChange)}%`,
    });
  }

  insights.push({
    id: "occupancy",
    text:
      currentKpis.occupancy > 75
        ? "Occupancy is high — consider raising rates"
        : currentKpis.occupancy < 40
          ? "Occupancy is low — consider promotional offers"
          : "Occupancy is stable",
  });

  const roomTypes = buildRevenueByRoomType(bookings, rooms, range);
  if (roomTypes[0]) {
    insights.push({
      id: "top-room",
      text: `Top room type: ${roomTypes[0].label}`,
    });
  }

  const topRoom = rooms.find((room) => room.room_type === roomTypes[0]?.label);
  if (topRoom && currentKpis.adr > 0 && topRoom.price < currentKpis.adr) {
    insights.push({
      id: "pricing",
      text: `Recommendation: raise the price of "${topRoom.room_type}" to ${formatRevenueCurrency(Math.round(currentKpis.adr))}`,
    });
  }

  return insights;
}

export function exportBookingsCsv(transactions: RevenueTransaction[]): void {
  const header = [
    "Guest",
    "Room",
    "Booking",
    "Payment method",
    "Amount",
    "Status",
    "Date",
  ];

  const rows = transactions.map((item) => [
    item.guestName,
    item.roomLabel,
    item.bookingLabel,
    item.paymentMethod,
    String(item.amount),
    item.status,
    item.date,
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `monavel-revenue-${todayIso()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
