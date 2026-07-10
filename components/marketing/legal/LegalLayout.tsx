import type { ReactNode } from "react";

import type { LegalSection as LegalSectionType } from "@/lib/marketing/legal";

type LayoutProps = {
  sections: readonly LegalSectionType[];
  children: ReactNode;
};

function LegalTableOfContents({
  sections,
}: {
  sections: readonly LegalSectionType[];
}) {
  return (
    <nav className="mkt-legal-toc" aria-label="Table of contents">
      <p className="mkt-legal-toc-title">On this page</p>
      <ol className="mkt-legal-toc-list" role="list">
        {sections.map((section) => (
          <li key={section.id} role="listitem">
            <a href={`#${section.id}`} className="mkt-legal-toc-link">
              {section.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function LegalLayout({ sections, children }: LayoutProps) {
  return (
    <div className="mkt-legal-layout">
      <div className="mkt-container-wide mkt-legal-layout-inner">
        <LegalTableOfContents sections={sections} />
        <div className="mkt-legal-content">{children}</div>
      </div>
    </div>
  );
}
