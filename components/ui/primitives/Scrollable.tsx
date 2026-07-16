import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ScrollableProps = HTMLAttributes<HTMLDivElement>;

export function Scrollable({ className, children, ...props }: ScrollableProps) {
  return (
    <div className={cn("overflow-auto", className)} {...props}>
      {children}
    </div>
  );
}
