import type { ReactNode } from "react";

import { surfaceClass } from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
};

export function ShellCard({
  children,
  className,
  interactive = true,
}: Props) {
  return (
    <div
      className={cn(
        surfaceClass,
        interactive && "hover:-translate-y-px",
        className
      )}
    >
      {children}
    </div>
  );
}
