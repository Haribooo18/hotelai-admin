import type { HTMLAttributes, ReactNode } from "react";

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
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="ds-section-title">{title}</h2>
            {subtitle ? (
              <p className="mt-1 text-[var(--type-caption-size)] leading-[var(--type-caption-leading)] text-[var(--shell-muted)]">
                {subtitle}
              </p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
