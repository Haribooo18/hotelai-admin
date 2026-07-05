import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { surfaceStaticClass } from "@/lib/design/elevation";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: ReactNode;
  icon?: LucideIcon;
  hint?: ReactNode;
  className?: string;
};

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  className,
}: StatCardProps) {
  return (
    <div className={cn(surfaceStaticClass, "p-[var(--ds-surface-padding)]", className)}>
      <div className="flex items-center gap-2">
        {Icon ? (
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--ds-radius-sm)] bg-[var(--shell-accent-muted)] text-[var(--shell-accent)]">
            <Icon size={15} aria-hidden />
          </div>
        ) : null}
        <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--shell-muted)]">
          {label}
        </p>
      </div>
      <p className="mt-2.5 text-[var(--type-kpi-size)] font-[var(--type-kpi-weight)] leading-[var(--type-kpi-leading)] tracking-[var(--type-kpi-tracking)] text-[var(--shell-text)]">
        {value}
      </p>
      {hint ? (
        <p className="mt-1 text-[12px] text-[var(--shell-muted)]">{hint}</p>
      ) : null}
    </div>
  );
}
