import type { ReactNode } from "react";

import { inspectorHeaderClass } from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  /** Nested section header inside drawer panels — no extra border/padding */
  compact?: boolean;
  className?: string;
};

export function WorkspaceInspectorHeader({
  title,
  subtitle,
  action,
  compact = false,
  className,
}: Props) {
  return (
    <div
      className={cn(
        inspectorHeaderClass,
        compact && "border-0 px-0 pt-0 pb-3",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="ds-section-title">{title}</h2>
          {subtitle ? (
            <p className="mt-1 ds-caption text-[var(--shell-muted)]">{subtitle}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </div>
  );
}
