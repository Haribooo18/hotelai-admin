import { Globe, Phone, UserRound } from "lucide-react";

import { cn } from "@/lib/utils";

import type { BookingSource } from "./booking-ops-metrics";

const SOURCE_META: Record<
  BookingSource,
  { label: string; icon: typeof Globe; className: string }
> = {
  direct: {
    label: "Direct",
    icon: UserRound,
    className: "bg-[var(--shell-surface-raised)] text-[var(--shell-muted)]",
  },
  online: {
    label: "Online",
    icon: Globe,
    className: "bg-violet-500/12 text-violet-400",
  },
  phone: {
    label: "Phone",
    icon: Phone,
    className: "bg-sky-500/12 text-sky-400",
  },
};

type Props = {
  source: BookingSource;
};

export function BookingSourceBadge({ source }: Props) {
  const meta = SOURCE_META[source];
  const Icon = meta.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.05em]",
        meta.className
      )}
    >
      <Icon size={11} />
      {meta.label}
    </span>
  );
}
