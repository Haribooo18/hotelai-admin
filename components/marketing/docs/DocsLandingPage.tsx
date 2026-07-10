import Link from "next/link";

import { FinalCtaSection } from "@/components/marketing/landing/FinalCtaSection";
import { DocsCallout } from "@/components/marketing/docs/DocsCallout";
import { DocsLayout } from "@/components/marketing/docs/DocsLayout";
import { MarketingDocsHero } from "@/components/marketing/shared/MarketingDocsHero";
import { DOCS_LANDING } from "@/lib/marketing/docs";

export function DocsLandingPage() {
  return (
    <>
      <MarketingDocsHero
        overline={DOCS_LANDING.overline}
        title={DOCS_LANDING.title}
        description={DOCS_LANDING.description}
      />

      <DocsLayout activeHref={DOCS_LANDING.path}>
        <div className="mkt-docs-landing">
          <ul className="mkt-docs-landing-grid" role="list">
            {DOCS_LANDING.cards.map((card) => {
              const Icon = card.icon;

              return (
                <li key={card.id} role="listitem">
                  <Link href={card.href} className="mkt-docs-landing-card">
                    <div className="mkt-features-workspace-icon" aria-hidden>
                      <Icon className="size-5" strokeWidth={1.5} />
                    </div>
                    <h2 className="mkt-features-card-title">{card.title}</h2>
                    <p className="mkt-features-card-description">
                      {card.description}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>

          <DocsCallout>
            Trial setup essentials. For sales or Enterprise questions, visit{" "}
            <Link href="/contact" className="mkt-docs-inline-link">
              Contact
            </Link>
            .
          </DocsCallout>
        </div>
      </DocsLayout>
      <FinalCtaSection variant="docs" />
    </>
  );
}
