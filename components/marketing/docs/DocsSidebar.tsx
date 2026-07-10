import Link from "next/link";

import { DOCS_SIDEBAR_NAV } from "@/lib/marketing/docs";
import { cn } from "@/lib/utils";

type Props = {
  activeHref: string;
};

function isActive(href: string, activeHref: string): boolean {
  return href === activeHref;
}

export function DocsSidebar({ activeHref }: Props) {
  return (
    <nav className="mkt-docs-sidebar" aria-label="Documentation">
      <p className="mkt-docs-sidebar-title">
        <Link href="/docs">Documentation</Link>
      </p>

      <ul className="mkt-docs-sidebar-list" role="list">
        {DOCS_SIDEBAR_NAV.map((entry) => {
          if (entry.type === "link") {
            const active = isActive(entry.href, activeHref);

            return (
              <li key={entry.href} role="listitem">
                <Link
                  href={entry.href}
                  className={cn(
                    "mkt-docs-sidebar-link",
                    active && "mkt-docs-sidebar-link-active"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {entry.label}
                </Link>
              </li>
            );
          }

          return (
            <li key={entry.label} className="mkt-docs-sidebar-group" role="listitem">
              <p className="mkt-docs-sidebar-group-label">{entry.label}</p>
              <ul className="mkt-docs-sidebar-sublist" role="list">
                {entry.items.map((item) => {
                  const active = isActive(item.href, activeHref);

                  return (
                    <li key={item.href} role="listitem">
                      <Link
                        href={item.href}
                        className={cn(
                          "mkt-docs-sidebar-link",
                          active && "mkt-docs-sidebar-link-active"
                        )}
                        aria-current={active ? "page" : undefined}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
