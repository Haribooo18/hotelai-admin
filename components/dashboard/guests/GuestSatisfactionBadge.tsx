import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/display/Badge";

import type { GuestSatisfaction } from "./guest-crm-metrics";

const SATISFACTION_META: Record<
  GuestSatisfaction,
  { label: string; variant: "success" | "default" | "warning" | "outline"; dots: number }
> = {
  excellent: {
    label: "Excellent",
    variant: "success",
    dots: 5,
  },
  good: {
    label: "Good",
    variant: "default",
    dots: 4,
  },
  neutral: {
    label: "Neutral",
    variant: "warning",
    dots: 3,
  },
  new: {
    label: "New",
    variant: "outline",
    dots: 0,
  },
};

type Props = {
  satisfaction: GuestSatisfaction;
};

export function GuestSatisfactionBadge({ satisfaction }: Props) {
  const meta = SATISFACTION_META[satisfaction];

  return (
    <Badge variant={meta.variant} className="gap-1.5 uppercase">
      <span className="inline-flex gap-0.5" aria-hidden>
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            key={index}
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              index < meta.dots ? "bg-current" : "bg-current/20"
            )}
          />
        ))}
      </span>
      {meta.label}
    </Badge>
  );
}
