import Link from "next/link";

import { DocsNavCardGrid } from "@/components/marketing/docs/DocsNavCard";
import { DocsSearch } from "@/components/marketing/docs/DocsSearch";
import { DOCS_LANDING } from "@/lib/marketing/docs";

export function DocsLandingPage() {
  return (
    <div className="mkt-docs-portal">
      <section className="mkt-docs-portal-hero" aria-labelledby="docs-landing-heading">
        <div className="mkt-docs-portal-container">
          <h1 id="docs-landing-heading" className="mkt-docs-portal-title">
            {DOCS_LANDING.title}
          </h1>
          <p className="mkt-docs-portal-lead">{DOCS_LANDING.description}</p>
        </div>
      </section>

      <section className="mkt-docs-portal-search-section" aria-label="Search">
        <div className="mkt-docs-portal-container mkt-docs-portal-search-wrap">
          <DocsSearch placeholder={DOCS_LANDING.searchPlaceholder} />
        </div>
      </section>

      <section
        id={DOCS_LANDING.gettingStarted.id}
        className="mkt-docs-portal-section"
        aria-labelledby="docs-getting-started-heading"
      >
        <div className="mkt-docs-portal-container">
          <h2
            id="docs-getting-started-heading"
            className="mkt-docs-portal-section-title"
          >
            {DOCS_LANDING.gettingStarted.title}
          </h2>
          <DocsNavCardGrid
            cards={DOCS_LANDING.gettingStarted.cards}
            columns={4}
            showMeta
          />
        </div>
      </section>

      <section
        id={DOCS_LANDING.platform.id}
        className="mkt-docs-portal-section"
        aria-labelledby="docs-platform-heading"
      >
        <div className="mkt-docs-portal-container">
          <h2 id="docs-platform-heading" className="mkt-docs-portal-section-title">
            {DOCS_LANDING.platform.title}
          </h2>
          <DocsNavCardGrid cards={DOCS_LANDING.platform.cards} columns={4} />
        </div>
      </section>

      <section
        id={DOCS_LANDING.integrations.id}
        className="mkt-docs-portal-section"
        aria-labelledby="docs-integrations-heading"
      >
        <div className="mkt-docs-portal-container">
          <h2
            id="docs-integrations-heading"
            className="mkt-docs-portal-section-title"
          >
            {DOCS_LANDING.integrations.title}
          </h2>
          <DocsNavCardGrid cards={DOCS_LANDING.integrations.cards} columns={4} />
        </div>
      </section>

      <section
        id={DOCS_LANDING.administration.id}
        className="mkt-docs-portal-section"
        aria-labelledby="docs-administration-heading"
      >
        <div className="mkt-docs-portal-container">
          <h2
            id="docs-administration-heading"
            className="mkt-docs-portal-section-title"
          >
            {DOCS_LANDING.administration.title}
          </h2>
          <DocsNavCardGrid
            cards={DOCS_LANDING.administration.cards}
            columns={3}
          />
        </div>
      </section>

      <section
        id={DOCS_LANDING.developer.id}
        className="mkt-docs-portal-section"
        aria-labelledby="docs-developer-heading"
      >
        <div className="mkt-docs-portal-container">
          <h2 id="docs-developer-heading" className="mkt-docs-portal-section-title">
            {DOCS_LANDING.developer.title}
          </h2>
          <DocsNavCardGrid cards={DOCS_LANDING.developer.cards} columns={4} />
        </div>
      </section>

      <section
        id={DOCS_LANDING.popularArticles.id}
        className="mkt-docs-portal-section"
        aria-labelledby="docs-popular-heading"
      >
        <div className="mkt-docs-portal-container">
          <h2 id="docs-popular-heading" className="mkt-docs-portal-section-title">
            {DOCS_LANDING.popularArticles.title}
          </h2>
          <ul className="mkt-docs-popular-list" role="list">
            {DOCS_LANDING.popularArticles.items.map((item) => (
              <li key={item.label} role="listitem">
                <Link href={item.href} className="mkt-docs-popular-link">
                  <span className="mkt-docs-popular-label">{item.label}</span>
                  <span className="mkt-docs-popular-arrow" aria-hidden>
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id={DOCS_LANDING.support.id}
        className="mkt-docs-portal-section mkt-docs-portal-section--support"
        aria-labelledby="docs-support-heading"
      >
        <div className="mkt-docs-portal-container">
          <nav className="mkt-docs-support" aria-labelledby="docs-support-heading">
            <h2 id="docs-support-heading" className="mkt-docs-support-label">
              {DOCS_LANDING.support.title}
            </h2>
            <div className="mkt-docs-support-links">
              {DOCS_LANDING.support.links.map((link, index) => (
                <span key={link.label} className="mkt-docs-support-item">
                  {index > 0 ? (
                    <span className="mkt-docs-support-sep" aria-hidden>
                      ·
                    </span>
                  ) : null}
                  <Link href={link.href} className="mkt-docs-support-link">
                    {link.label}
                  </Link>
                </span>
              ))}
            </div>
          </nav>
        </div>
      </section>
    </div>
  );
}
