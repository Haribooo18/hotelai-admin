import type { ReactNode } from "react";

import { DocsSearch } from "@/components/marketing/docs/DocsSearch";
import { DocsSidebar } from "@/components/marketing/docs/DocsSidebar";
import { DOCS_LANDING } from "@/lib/marketing/docs";

type Props = {
  activeHref: string;
  children: ReactNode;
  toc?: ReactNode;
};

export function DocsLayout({ activeHref, children, toc }: Props) {
  return (
    <div className="mkt-docs-layout">
      <div className="mkt-container-wide mkt-docs-layout-toolbar">
        <DocsSearch
          placeholder={DOCS_LANDING.searchPlaceholder}
          size="compact"
        />
      </div>
      <div className="mkt-container-wide mkt-docs-layout-inner">
        <DocsSidebar activeHref={activeHref} />
        <div className="mkt-docs-content">{children}</div>
        {toc ? <aside className="mkt-docs-toc-aside">{toc}</aside> : null}
      </div>
    </div>
  );
}
