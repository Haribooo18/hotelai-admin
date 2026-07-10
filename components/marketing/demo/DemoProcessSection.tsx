import { ArrowDown, ArrowRight } from "lucide-react";

import { WorkspacePreview } from "@/components/marketing/product/WorkspacePreview";
import {
  mktOverlineClass,
  mktSectionHeadlineClass,
  mktSectionSubheadClass,
  mktSplitSectionClass,
} from "@/lib/marketing/design";
import { DEMO_PAGE_PROCESS } from "@/lib/marketing/demo-page";
import { cn } from "@/lib/utils";

export function DemoProcessSection() {
  return (
    <section
      id={DEMO_PAGE_PROCESS.sectionId}
      className="mkt-features-section mkt-features-section-alt"
      aria-labelledby="demo-process-heading"
    >
      <div className="mkt-container-wide">
        <div className={cn("mkt-split-section mkt-split-section-reverse", mktSplitSectionClass)}>
          <div className="mkt-split-section-copy">
            <p className={mktOverlineClass}>{DEMO_PAGE_PROCESS.overline}</p>
            <h2 id="demo-process-heading" className={mktSectionHeadlineClass}>
              {DEMO_PAGE_PROCESS.headline}
            </h2>
            <p className={mktSectionSubheadClass}>{DEMO_PAGE_PROCESS.subhead}</p>

            <ol
              className="mkt-features-workflow mkt-demo-process-flow mkt-split-workflow"
              aria-label="How the Monavel demo works"
            >
              {DEMO_PAGE_PROCESS.steps.map((step, index) => (
                <li key={step.id} className="mkt-features-workflow-step">
                  <span className="mkt-features-workflow-node">{step.label}</span>
                  {index < DEMO_PAGE_PROCESS.steps.length - 1 ? (
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
            <WorkspacePreview workspaceId="bookings" presentation="demoProcess" />
          </div>
        </div>
      </div>
    </section>
  );
}
