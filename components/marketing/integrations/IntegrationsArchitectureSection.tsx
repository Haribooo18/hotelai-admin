import { ArrowDown, ArrowRight } from "lucide-react";

import { WorkspacePreview } from "@/components/marketing/product/WorkspacePreview";
import {
  mktOverlineClass,
  mktSectionHeadlineClass,
  mktSectionSubheadClass,
  mktSplitSectionClass,
  mktSplitSectionCopyCompactClass,
  mktSplitSectionVisualEmphasisClass,
} from "@/lib/marketing/design";
import { INTEGRATIONS_PAGE_ARCHITECTURE } from "@/lib/marketing/integrations-page";
import { cn } from "@/lib/utils";

export function IntegrationsArchitectureSection() {
  return (
    <section
      id={INTEGRATIONS_PAGE_ARCHITECTURE.sectionId}
      className="mkt-features-section"
      aria-labelledby="integrations-architecture-heading"
    >
      <div className="mkt-container-wide">
        <div
          className={cn(
            "mkt-split-section mkt-split-section-reverse",
            mktSplitSectionClass,
            mktSplitSectionVisualEmphasisClass
          )}
        >
          <div className={cn("mkt-split-section-copy", mktSplitSectionCopyCompactClass)}>
            <p className={mktOverlineClass}>
              {INTEGRATIONS_PAGE_ARCHITECTURE.overline}
            </p>
            <h2
              id="integrations-architecture-heading"
              className={mktSectionHeadlineClass}
            >
              {INTEGRATIONS_PAGE_ARCHITECTURE.headline}
            </h2>
            <p className={mktSectionSubheadClass}>
              {INTEGRATIONS_PAGE_ARCHITECTURE.subhead}
            </p>

            <ol
              className="mkt-features-workflow mkt-integrations-architecture-flow mkt-split-workflow"
              aria-label="Integration architecture overview"
            >
              {INTEGRATIONS_PAGE_ARCHITECTURE.steps.map((step, index) => (
                <li key={step.id} className="mkt-features-workflow-step">
                  <span className="mkt-features-workflow-node">{step.label}</span>
                  {index < INTEGRATIONS_PAGE_ARCHITECTURE.steps.length - 1 ? (
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
            <WorkspacePreview
              workspaceId="reception-ai"
              presentation="integrationsArchitecture"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
