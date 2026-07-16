import type { HTMLAttributes, ReactNode } from "react";

import { Surface } from "@/components/ui/primitives/Surface";
import { Scrollable } from "@/components/ui/primitives/Scrollable";
import { cn } from "@/lib/utils";

type TableContainerProps = HTMLAttributes<HTMLDivElement> & {
  toolbar?: ReactNode;
  footer?: ReactNode;
  scrollable?: boolean;
};

export function TableContainer({
  toolbar,
  footer,
  scrollable = true,
  className,
  children,
  ...props
}: TableContainerProps) {
  const content = scrollable ? (
    <Scrollable className="min-h-0">{children}</Scrollable>
  ) : (
    children
  );

  return (
    <Surface interactive={false} className={cn("overflow-hidden", className)} {...props}>
      {toolbar ? (
        <div className="border-b border-[var(--shell-border)]/50 p-[var(--ds-surface-padding)] pb-3">
          {toolbar}
        </div>
      ) : null}
      <div className={cn(toolbar ? "p-[var(--ds-surface-padding)] pt-3" : "p-[var(--ds-surface-padding)]")}>
        {content}
      </div>
      {footer ? (
        <div className="border-t border-[var(--shell-border)]/50 p-[var(--ds-surface-padding)]">
          {footer}
        </div>
      ) : null}
    </Surface>
  );
}
