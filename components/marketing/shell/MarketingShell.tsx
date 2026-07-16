import type { ReactNode } from "react";

import { MarketingFooter } from "@/components/marketing/shell/MarketingFooter";
import { MarketingHeader } from "@/components/marketing/shell/MarketingHeader";
import { HERO_CONTENT } from "@/lib/marketing/hero";

type Props = {
  children: ReactNode;
};

export function MarketingShell({ children }: Props) {
  return (
    <div data-surface="marketing" lang="en" className="min-h-screen">
      <a href={`#${HERO_CONTENT.skipLinkTarget}`} className="mkt-skip-link">
        {HERO_CONTENT.skipLinkLabel}
      </a>
      <MarketingHeader />
      <main>{children}</main>
      <MarketingFooter />
    </div>
  );
}
