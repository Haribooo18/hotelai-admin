import { ArrowDown, ArrowRight } from "lucide-react";

import { WorkspacePreview } from "@/components/marketing/product/WorkspacePreview";
import {
  mktOverlineClass,
  mktSectionHeadlineClass,
  mktSectionSubheadClass,
  mktSplitSectionClass,
} from "@/lib/marketing/design";
import { SECURITY_PAGE_ARCHITECTURE } from "@/lib/marketing/security-page";
import { cn } from "@/lib/utils";

export function SecurityArchitectureSection() {
  return (
    <section
      id={SECURITY_PAGE_ARCHITECTURE.sectionId}
      className="mkt-features-section"
      aria-labelledby="security-architecture-heading"
    >
      <div className="mkt-container-wide">
        <div className={cn("mkt-split-section", mktSplitSectionClass)}>
          <div className="mkt-split-section-copy">
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

            <ol
              className="mkt-features-workflow mkt-security-architecture-flow mkt-split-workflow"
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

          <div className="mkt-split-section-visual">
            <WorkspacePreview workspaceId="dashboard" presentation="securityArchitecture" />
          </div>
        </div>
      </div>
    </section>
  );
}
