import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/display/Badge";

import type { BookingPaymentStatus } from "./booking-ops-metrics";

const PAYMENT_META: Record<
  BookingPaymentStatus,
  { label: string; variant: "success" | "default" | "warning" | "destructive"; className?: string }
> = {
  paid: {
    label: "Paid",
    variant: "success",
  },
  deposit: {
    label: "Deposit paid",
    variant: "default",
    className: "bg-sky-500/12 text-sky-400 border-sky-500/20",
  },
  pending: {
    label: "Pending",
    variant: "warning",
  },
  void: {
    label: "Void",
    variant: "destructive",
  },
};

type Props = {
  status: BookingPaymentStatus;
  className?: string;
};

export function PaymentStatusBadge({ status, className }: Props) {
  const meta = PAYMENT_META[status];

  return (
    <Badge
      variant={meta.variant}
      className={cn("uppercase", meta.className, className)}
    >
      {meta.label}
    </Badge>
  );
}
