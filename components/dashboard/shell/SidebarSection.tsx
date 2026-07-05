import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  title?: string;
};

export function SidebarSection({ children, className, title }: Props) {
  return (
    <div className={cn("space-y-1", className)}>
      {title ? (
        <p className="px-3 pb-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--shell-muted)]">
          {title}
        </p>
      ) : null}
      {children}
    </div>
  );
}
