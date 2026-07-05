import { cn } from "@/lib/utils";

import type { GuestSatisfaction } from "./guest-crm-metrics";

const SATISFACTION_META: Record<
  GuestSatisfaction,
  { label: string; className: string; dots: number }
> = {
  excellent: {
    label: "Excellent",
    className: "bg-emerald-500/12 text-emerald-500",
    dots: 5,
  },
  good: {
    label: "Good",
    className: "bg-sky-500/12 text-sky-400",
    dots: 4,
  },
  neutral: {
    label: "Neutral",
    className: "bg-amber-500/12 text-amber-400",
    dots: 3,
  },
  new: {
    label: "New",
    className: "bg-[var(--shell-surface-raised)] text-[var(--shell-muted)]",
    dots: 0,
  },
};

type Props = {
  satisfaction: GuestSatisfaction;
};

export function GuestSatisfactionBadge({ satisfaction }: Props) {
  const meta = SATISFACTION_META[satisfaction];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.05em]",
        meta.className
      )}
    >
      <span className="inline-flex gap-0.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            key={index}
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              index < meta.dots
                ? "bg-current"
                : "bg-current/20"
            )}
          />
        ))}
      </span>
      {meta.label}
    </span>
  );
}
