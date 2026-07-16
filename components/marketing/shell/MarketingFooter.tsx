import { MonavelHorizontal } from "@/components/brand";
import { HashAwareLink } from "@/components/marketing/shared/HashAwareLink";
import { FOOTER_BOTTOM, FOOTER_COLUMNS } from "@/lib/marketing/footer";

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
            <li key={`${link.href}-${link.label}`}>
              <HashAwareLink href={link.href} className="mkt-footer-link">
                {link.label}
              </HashAwareLink>
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
        <div className="mkt-footer-nav">
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
          <MonavelHorizontal decorative className="mkt-logo-horizontal--footer" />
          <p className="mkt-footer-signature">{FOOTER_BOTTOM.signature}</p>
        </div>
      </div>
    </footer>
  );
}
