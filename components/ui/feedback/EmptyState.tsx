import type { ReactNode } from "react";

import { shellEmptyStateClass } from "@/lib/dashboard/design-system";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
};

export function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className={shellEmptyStateClass}>
      <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
        {icon ? (
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)] text-[var(--shell-muted)] shadow-[var(--shell-shadow-sm)]">
            {icon}
          </div>
        ) : null}
        <p className="text-[14px] font-medium tracking-[-0.01em] text-[var(--shell-text)]">
          {title}
        </p>
        <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-[var(--shell-muted)]">
          {description}
        </p>
        {action ? <div className="mt-5">{action}</div> : null}
      </div>
    </div>
  );
}
