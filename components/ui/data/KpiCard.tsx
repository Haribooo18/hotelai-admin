import type { LucideIcon } from "lucide-react";

import { Metric } from "@/components/ui/display/Metric";
import { cn } from "@/lib/utils";

type KpiCardProps = {
  label: string;
  icon: LucideIcon;
  value: number;
  format: (value: number) => string;
  bordered?: boolean;
  className?: string;
};

export function KpiCard({
  label,
  icon: Icon,
  value,
  format,
  bordered = false,
  className,
}: KpiCardProps) {
  return (
    <div
      className={cn(
        "group px-3 py-2 transition-[transform,opacity] duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:-translate-y-px",
        bordered && "xl:border-l xl:border-[var(--shell-border)]/60",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--ds-radius-sm)] bg-[var(--shell-accent-muted)] text-[var(--shell-accent)] transition-transform duration-[var(--ds-duration)] ease-[var(--ds-ease)] group-hover:scale-[1.04]">
          <Icon size={15} aria-hidden />
        </div>
        <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--shell-muted)]">
          {label}
        </p>
      </div>
      <p className="mt-2.5 text-[var(--type-kpi-size)] font-[var(--type-kpi-weight)] leading-[var(--type-kpi-leading)] tracking-[var(--type-kpi-tracking)] text-[var(--shell-text)]">
        <Metric value={value} formatter={format} />
      </p>
      <span className="sr-only" aria-live="polite">
        {format(value)}
      </span>
    </div>
  );
}
