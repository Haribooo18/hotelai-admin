import type { HTMLAttributes, ReactNode } from "react";

import { stickyToolbarClass } from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";

type ToolbarProps = HTMLAttributes<HTMLDivElement> & {
  leading?: ReactNode;
  trailing?: ReactNode;
};

export function Toolbar({
  leading,
  trailing,
  className,
  children,
  ...props
}: ToolbarProps) {
  return (
    <div className={cn(stickyToolbarClass, className)} {...props}>
      {leading || trailing ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          {leading ? <div className="min-w-0 flex-1">{leading}</div> : null}
          {trailing ? <div className="shrink-0">{trailing}</div> : null}
        </div>
      ) : null}
      {children}
    </div>
  );
}
