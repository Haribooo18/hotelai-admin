import { Globe, Phone, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/display/Badge";
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
    className: "bg-violet-500/12 text-violet-400 border-violet-500/20",
  },
  phone: {
    label: "Phone",
    icon: Phone,
    className: "bg-sky-500/12 text-sky-400 border-sky-500/20",
  },
};

type Props = {
  source: BookingSource;
  className?: string;
};

export function BookingSourceBadge({ source, className }: Props) {
  const meta = SOURCE_META[source];
  const Icon = meta.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 uppercase",
        meta.className,
        className
      )}
    >
      <Icon size={11} aria-hidden />
      {meta.label}
    </Badge>
  );
}
