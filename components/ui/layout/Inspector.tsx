import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type InspectorProps = HTMLAttributes<HTMLElement> & {
  title?: string;
  header?: ReactNode;
  footer?: ReactNode;
};

export function Inspector({
  title,
  header,
  footer,
  className,
  children,
  ...props
}: InspectorProps) {
  return (
    <aside
      className={cn(
        "flex min-h-0 flex-col overflow-hidden rounded-[var(--ds-radius)] bg-[var(--shell-surface)] shadow-[var(--shell-shadow-sm)]",
        className
      )}
      {...props}
    >
      {header ?? (title ? (
        <div className="border-b border-[var(--shell-border)] px-[var(--ds-surface-padding)] py-3">
          <h2 className="ds-section-title">{title}</h2>
        </div>
      ) : null)}
      <div className="min-h-0 flex-1 overflow-y-auto p-[var(--ds-surface-padding)]">
        {children}
      </div>
      {footer ? (
        <div className="border-t border-[var(--shell-border)] p-[var(--ds-surface-padding)]">
          {footer}
        </div>
      ) : null}
    </aside>
  );
}
