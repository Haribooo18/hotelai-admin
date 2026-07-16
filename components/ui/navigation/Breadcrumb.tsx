import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

type BreadcrumbItem = {
  label: ReactNode;
  href?: string;
  current?: boolean;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  className?: string;
  separator?: ReactNode;
};

export function Breadcrumb({
  items,
  className,
  separator = <ChevronRight size={14} className="text-[var(--shell-muted)]" aria-hidden />,
}: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-[13px]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="inline-flex items-center gap-1.5">
              {index > 0 ? separator : null}
              {item.href && !isLast ? (
                <a
                  href={item.href}
                  className="text-[var(--shell-muted)] transition-colors duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:text-[var(--shell-text)]"
                >
                  {item.label}
                </a>
              ) : (
                <span
                  aria-current={item.current || isLast ? "page" : undefined}
                  className={cn(
                    isLast || item.current
                      ? "font-medium text-[var(--shell-text)]"
                      : "text-[var(--shell-muted)]"
                  )}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
