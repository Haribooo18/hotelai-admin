import { ArrowDown, ArrowRight } from "lucide-react";

import {
  mktOverlineClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import { SECURITY_PAGE_ARCHITECTURE } from "@/lib/marketing/security-page";

export function SecurityArchitectureSection() {
  return (
    <section
      id={SECURITY_PAGE_ARCHITECTURE.sectionId}
      className="mkt-features-section"
      aria-labelledby="security-architecture-heading"
    >
      <div className="mkt-container-wide">
        <header className={mktSectionHeaderClass}>
          <p className={mktOverlineClass}>{SECURITY_PAGE_ARCHITECTURE.overline}</p>
          <h2
            id="security-architecture-heading"
            className={mktSectionHeadlineClass}
          >
            {SECURITY_PAGE_ARCHITECTURE.headline}
          </h2>
          <p className={mktSectionSubheadClass}>
            {SECURITY_PAGE_ARCHITECTURE.subhead}
          </p>
        </header>

        <div className={mktSectionBodyClass}>
          <ol
            className="mkt-features-workflow mkt-security-architecture-flow"
            aria-label="Monavel platform security architecture"
          >
            {SECURITY_PAGE_ARCHITECTURE.steps.map((step, index) => (
              <li key={step.id} className="mkt-features-workflow-step">
                <span className="mkt-features-workflow-node">{step.label}</span>
                {index < SECURITY_PAGE_ARCHITECTURE.steps.length - 1 ? (
                  <>
                    <ArrowRight
                      className="mkt-features-workflow-arrow mkt-features-workflow-arrow-horizontal"
                      aria-hidden
                    />
                    <ArrowDown
                      className="mkt-features-workflow-arrow mkt-features-workflow-arrow-vertical"
                      aria-hidden
                    />
                  </>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
