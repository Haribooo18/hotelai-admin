"use client";

import { Globe, Phone, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/display/Badge";
import { statusBadgeClass } from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import type { TranslationPath } from "@/lib/i18n/translations";

import type { BookingSource } from "./booking-ops-metrics";

const SOURCE_META: Record<
  BookingSource,
  { key: TranslationPath; icon: typeof Globe; className: string }
> = {
  direct: {
    key: "statuses.bookingSource.direct",
    icon: UserRound,
    className: "bg-[var(--shell-surface-raised)] text-[var(--shell-muted)]",
  },
  online: {
    key: "statuses.bookingSource.online",
    icon: Globe,
    className: "bg-violet-500/12 text-violet-400 border-violet-500/20",
  },
  phone: {
    key: "statuses.bookingSource.phone",
    icon: Phone,
    className: "bg-sky-500/12 text-sky-400 border-sky-500/20",
  },
};

type Props = {
  source: BookingSource;
  className?: string;
};

export function BookingSourceBadge({ source, className }: Props) {
  const { t } = useI18n();
  const meta = SOURCE_META[source];
  const Icon = meta.icon;

  return (
    <Badge
      variant="outline"
      className={cn(statusBadgeClass, "gap-1", meta.className, className)}
    >
      <Icon size={11} aria-hidden />
      {t(meta.key)}
    </Badge>
  );
}
