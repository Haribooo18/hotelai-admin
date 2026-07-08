import type { HTMLAttributes, ReactNode } from "react";

import { Surface } from "@/components/ui/primitives/Surface";
import {
  cardContentGapClass,
  cardHeaderClass,
  cardPaddingClass,
  cardSubtitleClass,
} from "@/lib/dashboard/design-system";
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
  const hasHeader = Boolean(title || subtitle || action);

  return (
    <Surface interactive={interactive} className={className} {...props}>
      <div className={cn(padded && cardPaddingClass)}>
        {hasHeader ? (
          <div className={cardHeaderClass}>
            <div className="min-w-0">
              {title ? <h3 className="ds-section-title">{title}</h3> : null}
              {subtitle ? <p className={cardSubtitleClass}>{subtitle}</p> : null}
            </div>
            {action ? <div className="shrink-0">{action}</div> : null}
          </div>
        ) : null}
        <div className={cn(hasHeader && cardContentGapClass)}>{children}</div>
      </div>
    </Surface>
  );
}
