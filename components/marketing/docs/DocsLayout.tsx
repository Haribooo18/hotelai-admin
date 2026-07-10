import type { ReactNode } from "react";

import { DocsSidebar } from "@/components/marketing/docs/DocsSidebar";

type Props = {
  activeHref: string;
  children: ReactNode;
};

export function DocsLayout({ activeHref, children }: Props) {
  return (
    <div className="mkt-docs-layout">
      <div className="mkt-container-wide mkt-docs-layout-inner">
        <DocsSidebar activeHref={activeHref} />
        <div className="mkt-docs-content">{children}</div>
      </div>
    </div>
  );
}
