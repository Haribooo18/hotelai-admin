"use client";

import { Badge } from "@/components/ui/display/Badge";
import { statusBadgeClass } from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import type { TranslationPath } from "@/lib/i18n/translations";

import type { BookingPaymentStatus } from "./booking-ops-metrics";

const PAYMENT_META: Record<
  BookingPaymentStatus,
  {
    key: TranslationPath;
    variant: "success" | "default" | "warning" | "destructive";
    className?: string;
  }
> = {
  paid: {
    key: "statuses.payment.paid",
    variant: "success",
  },
  deposit: {
    key: "statuses.payment.deposit",
    variant: "default",
    className: "bg-sky-500/12 text-sky-400 border-sky-500/20",
  },
  pending: {
    key: "statuses.payment.pending",
    variant: "warning",
  },
  void: {
    key: "statuses.payment.void",
    variant: "destructive",
  },
};

type Props = {
  status: BookingPaymentStatus;
  className?: string;
};

export function PaymentStatusBadge({ status, className }: Props) {
  const { t } = useI18n();
  const meta = PAYMENT_META[status];

  return (
    <Badge
      variant={meta.variant}
      className={cn(statusBadgeClass, meta.className, className)}
    >
      {t(meta.key)}
    </Badge>
  );
}
