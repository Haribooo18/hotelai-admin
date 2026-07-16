import type { HTMLAttributes, ReactNode } from "react";

import { cardHeaderClass, cardSubtitleClass } from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";

type SectionProps = HTMLAttributes<HTMLElement> & {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
};

export function Section({
  title,
  subtitle,
  action,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section className={cn("space-y-4", className)} {...props}>
      {title ? (
        <div className={cardHeaderClass}>
          <div className="min-w-0">
            <h2 className="ds-section-title">{title}</h2>
            {subtitle ? <p className={cardSubtitleClass}>{subtitle}</p> : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
