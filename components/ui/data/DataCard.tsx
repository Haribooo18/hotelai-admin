import type { HTMLAttributes, ReactNode } from "react";

import { Surface } from "@/components/ui/primitives/Surface";
import { cn } from "@/lib/utils";

type DataCardProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  interactive?: boolean;
  padded?: boolean;
};

export function DataCard({
  title,
  subtitle,
  action,
  interactive = false,
  padded = true,
  className,
  children,
  ...props
}: DataCardProps) {
  return (
    <Surface interactive={interactive} className={className} {...props}>
      {title || subtitle || action ? (
        <div
          className={cn(
            "flex items-start justify-between gap-3",
            padded && "p-[var(--ds-surface-padding)] pb-0"
          )}
        >
          <div className="min-w-0">
            {title ? <h3 className="ds-section-title">{title}</h3> : null}
            {subtitle ? (
              <p className="mt-1 text-[var(--type-caption-size)] leading-[var(--type-caption-leading)] text-[var(--shell-muted)]">
                {subtitle}
              </p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}
      <div className={cn(padded && "p-[var(--ds-surface-padding)]")}>{children}</div>
    </Surface>
  );
}
