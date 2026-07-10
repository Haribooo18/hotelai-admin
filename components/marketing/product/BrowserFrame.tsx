import type { ReactNode } from "react";

import {
  PRODUCT_SCREENSHOT_ASPECT_RATIO,
} from "@/lib/marketing/product-media";
import { cn } from "@/lib/utils";

type Props = {
  productUrl: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  ariaHidden?: boolean;
};

export function BrowserFrame({
  productUrl,
  children,
  className,
  contentClassName,
  ariaHidden = false,
}: Props) {
  return (
    <div
      className={className}
      aria-hidden={ariaHidden || undefined}
      style={{ aspectRatio: PRODUCT_SCREENSHOT_ASPECT_RATIO }}
    >
      <div className="relative h-full overflow-hidden rounded-[var(--mkt-radius-2xl)] border border-[var(--mkt-border-strong)] bg-[var(--mkt-surface-2)] shadow-[var(--mkt-shadow-lg)]">
        <div className="flex h-10 items-center gap-3 border-b border-[var(--mkt-border-subtle)] bg-[var(--mkt-surface-glass)] px-4 backdrop-blur-md">
          <div className="flex items-center gap-1.5" aria-hidden>
            <span className="size-2.5 rounded-full bg-[oklch(0.55_0.18_25)]" />
            <span className="size-2.5 rounded-full bg-[oklch(0.75_0.14_85)]" />
            <span className="size-2.5 rounded-full bg-[oklch(0.62_0.14_145)]" />
          </div>
          <div className="min-w-0 flex-1 rounded-md border border-[var(--mkt-border-subtle)] bg-[var(--mkt-surface-inset)] px-3 py-1">
            <p className="truncate font-mono text-xs text-[var(--mkt-text-subtle)]">
              {productUrl}
            </p>
          </div>
        </div>

        <div
          className={cn(
            "relative w-full bg-[var(--mkt-surface-inset)]",
            contentClassName
          )}
          style={{ aspectRatio: PRODUCT_SCREENSHOT_ASPECT_RATIO }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
