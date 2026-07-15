import Link from "next/link";

import type { DocsSection } from "@/lib/marketing/docs";

type Props = {
  sections: readonly DocsSection[];
};

export function DocsTableOfContents({ sections }: Props) {
  if (sections.length === 0) return null;

  return (
    <nav className="mkt-docs-toc" aria-label="On this page">
      <p className="mkt-docs-toc-title">On this page</p>
      <ul className="mkt-docs-toc-list" role="list">
        {sections.map((section) => (
          <li key={section.id} role="listitem">
            <Link href={`#${section.id}`} className="mkt-docs-toc-link">
              {section.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
