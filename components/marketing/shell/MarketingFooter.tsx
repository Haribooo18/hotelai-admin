import Link from "next/link";

import {
  FOOTER_BOTTOM,
  FOOTER_BRAND,
  FOOTER_COLUMNS,
} from "@/lib/marketing/footer";

function FooterNavColumn({
  title,
  links,
  id,
}: {
  title: string;
  links: readonly { href: string; label: string }[];
  id: string;
}) {
  return (
    <div className="mkt-footer-column">
      <h3 className="mkt-footer-column-title" id={`footer-${id}-heading`}>
        {title}
      </h3>
      <nav aria-labelledby={`footer-${id}-heading`}>
        <ul className="mkt-footer-links">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="mkt-footer-link">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export function MarketingFooter() {
  return (
    <footer className="mkt-footer">
      <div className="mkt-container-wide mkt-footer-main">
        <div className="mkt-footer-grid">
          <div className="mkt-footer-brand">
            <Link href="/" className="mkt-footer-brand-name">
              {FOOTER_BRAND.name}
            </Link>
            <p className="mkt-footer-brand-tagline">{FOOTER_BRAND.tagline}</p>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <FooterNavColumn
              key={column.id}
              id={column.id}
              title={column.title}
              links={column.links}
            />
          ))}
        </div>
      </div>

      <div className="mkt-footer-bottom">
        <div className="mkt-container-wide mkt-footer-bottom-inner">
          <div className="mkt-footer-bottom-meta">
            <p className="mkt-footer-copyright">{FOOTER_BOTTOM.copyright}</p>
            <p className="mkt-footer-bottom-tagline">{FOOTER_BOTTOM.tagline}</p>
          </div>

          <nav aria-label="Legal" className="mkt-footer-legal">
            {FOOTER_BOTTOM.legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="mkt-footer-link">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
