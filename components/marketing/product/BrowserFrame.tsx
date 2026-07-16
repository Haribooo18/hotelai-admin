import type { ReactNode } from "react";

import type { ProductShowcaseSize } from "@/lib/marketing/product-presentation";
import { cn } from "@/lib/utils";

type Props = {
  productUrl: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  ariaHidden?: boolean;
  size?: ProductShowcaseSize;
};

export function BrowserFrame({
  productUrl,
  children,
  className,
  contentClassName,
  ariaHidden = false,
  size = "section",
}: Props) {
  return (
    <div
      className={cn("mkt-browser-frame", `mkt-browser-frame--${size}`, className)}
      aria-hidden={ariaHidden || undefined}
    >
      <div className="mkt-browser-shell">
        <div className="mkt-browser-chrome">
          <div className="mkt-browser-traffic" aria-hidden>
            <span className="mkt-browser-traffic-dot mkt-browser-traffic-dot--close" />
            <span className="mkt-browser-traffic-dot mkt-browser-traffic-dot--minimize" />
            <span className="mkt-browser-traffic-dot mkt-browser-traffic-dot--maximize" />
          </div>
          <div className="mkt-browser-url">
            <svg
              className="mkt-browser-url-lock"
              viewBox="0 0 10 10"
              fill="none"
              aria-hidden
            >
              <path
                d="M2.75 4.25V3.25a2.25 2.25 0 0 1 4.5 0v1"
                stroke="currentColor"
                strokeWidth="0.9"
                strokeLinecap="round"
              />
              <rect
                x="1.75"
                y="4.25"
                width="6.5"
                height="4.5"
                rx="1"
                stroke="currentColor"
                strokeWidth="0.9"
              />
            </svg>
            <span className="mkt-browser-url-text">{productUrl}</span>
          </div>
          <div className="mkt-browser-chrome-end" aria-hidden />
        </div>

        <div className={cn("mkt-browser-content", contentClassName)}>
          <div className="mkt-browser-content-inner">{children}</div>
        </div>
      </div>
    </div>
  );
}
