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
            <span className="mkt-browser-url-text">{productUrl}</span>
          </div>
        </div>

        <div className={cn("mkt-browser-content", contentClassName)}>
          <div className="mkt-browser-content-inner">{children}</div>
        </div>
      </div>
    </div>
  );
}
