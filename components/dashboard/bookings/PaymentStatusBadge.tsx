import { cn } from "@/lib/utils";

import type { BookingPaymentStatus } from "./booking-ops-metrics";

const PAYMENT_META: Record<
  BookingPaymentStatus,
  { label: string; className: string }
> = {
  paid: {
    label: "Paid",
    className: "bg-emerald-500/12 text-emerald-500",
  },
  deposit: {
    label: "Deposit paid",
    className: "bg-sky-500/12 text-sky-400",
  },
  pending: {
    label: "Pending",
    className: "bg-amber-500/12 text-amber-400",
  },
  void: {
    label: "Void",
    className: "bg-red-500/12 text-red-400",
  },
};

type Props = {
  status: BookingPaymentStatus;
};

export function PaymentStatusBadge({ status }: Props) {
  const meta = PAYMENT_META[status];

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.05em]",
        meta.className
      )}
    >
      {meta.label}
    </span>
  );
}
